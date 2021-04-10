import {ServerAgent} from "../../../lib/server/agent";
import {Deployment} from '../../../lib/server/deployment'
import Environment from "../../../lib/server/environment";
import {sleep} from "../../../lib/urils";
import {ProtocolFactory} from "../../../lib/protocols";

const state = {
  complete: false,
  cancel: false,
  errorText: null,
  reconnect: false,
  allowCancel: false,
  client: null, // provider
  protocol: null,
}

const mutations = {
  PROCESSING_COMPLETE (state) {
    state.complete = true
  },
  PROCESSING_CANCEL (state) {
    state.cancel = true
    state.complete = false
    state.reconnect = false
    state.errorText = null
    state.client = null
  },
  PROCESSING_ERROR (state, text) {
    state.errorText = text
    state.cancel = false
  },
  PROCESSING_FAILED_CONNECTION (state) {
    state.reconnect = true
  }
}

const actions = {
  async processingSSH ({ commit, dispatch, state }, params) {
    const {
      sshIp,
      sshPrivateKey,
      sshPassword,
      sshPort,
      sshUser,
      protocol,
      configuration
    } = params

    dispatch('log', 'Connecting to the server')

    configuration.aesKey = ServerAgent.generateAesKey()
    const protocolInstance = ProtocolFactory.create(protocol, configuration)
    const deploy = new Deployment(sshIp, sshPort, sshUser, sshPassword, sshPrivateKey, protocolInstance)
    let result = null
    try {
      await deploy.openConnection()
      dispatch('log', 'Starting MyVPN Agent. Make sure that port 443 is open on your server.')
      await deploy.setup()

      const agent = new ServerAgent(sshIp, configuration.aesKey)
      while (result === null) {
        result = await agent.getState().then(data => {
          console.log('myvpn agent response:', data)
          const status = data.status
          if (typeof status !== 'object') {
            dispatch('log', 'MyVPN Agent response could not be decrypted.')
            return new Error('Failed to decrypt response')
          }
          if (data.time_running > 60 * 5) {
            return new Error('Waiting time 300sec is exceeded')
          }
          switch (status.code) {
            case 'error':
              dispatch('log', 'Software installation is failure')
              throw new Error(status.error_text || 'Unknown error')
            case 'completed':
              dispatch('log', 'Software installation is complete')
              return status.client_config
            case 'idle':
              dispatch('log', 'Waiting for software setup to start on the server')
              break
            case 'setup':
              dispatch('log', 'Waiting for software installation')
              break
          }
          return null
        }, err => {
          console.log('myvpn agent http failed:', err)
          commit('PROCESSING_ERROR', 'Failed to connect to MyVPN Agent, port 443 is not available.')
          return err
        })
        if (result === null) {
          await sleep(5000)
        }
      }
      dispatch('setClientConfig', result)
      commit('PROCESSING_COMPLETE')
    } catch (e) {
      commit('PROCESSING_ERROR', e.message)
    }

  },
  async processing ({ commit, dispatch, state }, params) {
    const {
      client,
      region,
      sshKey,
      protocol,
      configuration
    } = params
    state.client = client
    try {
      let completed = false
      let server = null
      let result = null
      let unsubscribe = null

      configuration.aesKey = ServerAgent.generateAesKey()

      const protocolInstance = ProtocolFactory.create(protocol, configuration)
      const variables = protocolInstance.envVariables()
      const startupCommand = ServerAgent.startupCommand(
        new Environment(variables)
      )

      console.log('[bash] agent startup', startupCommand)

      const sshKeyId = await client.addSshKey(sshKey)
      let cancelled = false
      const createServerProcessing = async () => {
        server = null
        result = null
        unsubscribe = this.subscribe((mutation, state) => {
          switch (mutation.type) {
            case 'PROCESSING_CANCEL':
              cancelled = true
              if (server !== null) {
                client.deleteServer(server.slug)
                client.deleteSshKey(sshKeyId, server.slug)
              }
              throw new Error('cancel')
          }
        })
        state.allowCancel = true
        dispatch('log', 'Creating a new server')
        try {
          server = await client.createServer(sshKeyId, region, protocol, startupCommand)
          dispatch('saveServer', server)
          // this hack for PROCESSING_CANCEL
          if (cancelled === true) {
            console.info('stopped. cancelled.')
            return
          }
          dispatch('log', 'Waiting for the server to start')
          server = await client.checkServer(server.slug)
          dispatch('saveServer', server)

          dispatch('log', 'Connecting to the server')

          /* MyVPN Agent */
          const agent = new ServerAgent(server.ipv4, configuration.aesKey)
          while (result === null) {
            result = await agent.getState().then(data => {
              console.log('myvpn agent response:', data)
              const status = data.status
              if (typeof status !== 'object') {
                dispatch('log', 'MyVPN Agent response could not be decrypted.')
                return new Error('Failed to decrypt response')
              }
              if (data.time_running > 60 * 5) {
                return new Error('Waiting time 300sec is exceeded')
              }
              switch (status.code) {
                case 'error':
                  dispatch('log', 'Software installation is failure')
                  client.deleteServer(server.slug)
                  throw new Error(status.error_text || 'Unknown error')
                case 'completed':
                  dispatch('log', 'Software installation is complete')
                  completed = true
                  return status.client_config
                case 'idle':
                  dispatch('log', 'Waiting for software setup to start on the server')
                  break
                case 'setup':
                  dispatch('log', 'Waiting for software installation')
                  break
              }
              return null
            }, err => {
              console.log('myvpn agent http failed:', err)
              commit('PROCESSING_FAILED_CONNECTION')
              client.deleteServer(server.slug)
              return err
            })
            if (result === null) {
              await sleep(5000)
            }
          }
        } catch (e) {
          if (cancelled === true) {
            return
          }
          throw new Error(e.message)
        }

        if (cancelled === true) {
          console.info('stopped. cancelled.')
        }
      }
      while (completed === false && cancelled === false) {
        try {
          await createServerProcessing()
        } catch (e) {
          if (unsubscribe !== null) {
            unsubscribe();
          }
          commit('PROCESSING_ERROR', e.message)
          return null
        }
      }
      unsubscribe !== null && unsubscribe();
      if (cancelled === true) {
        console.info('end process. cancelled.')
        return
      }

      dispatch('setClientConfig', result)
      await client.deleteSshKey(sshKeyId, server.slug)
    } catch (e) {
      dispatch('log', `Error: ${e.message}`)
      commit('PROCESSING_ERROR', e.message)
      return null
    }
    state.complete = true
    commit('PROCESSING_COMPLETE')
    dispatch('loadDroplets', {client})
  },
  deleteServer ({ commit, state }, slug) {
    state.client.deleteServer(slug)
  },
  cancelProcessing ({ commit, state }) {
    commit('PROCESSING_CANCEL')
  }
}

export default {
  state,
  mutations,
  actions
}
