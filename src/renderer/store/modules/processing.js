import {Deployment} from '../../../lib/deployment'
import {sleep} from '../../../lib/urils'

const state = {
  complete: false,
  cancel: false,
  errorText: null,
  reconnect: false,
  allowCancel: false,
  client: null
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
  async processing ({ commit, dispatch, state }, params) {
    const {
      client,
      region,
      sshKey,
      privateKey,
      connectionType,
      accountUsername,
      accountPassword,
      accountPskKey
    } = params
    state.client = client
    try {
      let deploy = null
      let connected = false
      let server = null
      let unsubscribe = null
      const sshKeyId = await client.addSshKey(sshKey)
      let cancelled = false
      const createServerProcessing = async () => {
        if (deploy !== null) {
          deploy.closeConnection()
        }
        server = null
        unsubscribe = this.subscribe((mutation, state) => {
          switch (mutation.type) {
            case 'PROCESSING_CANCEL':
              cancelled = true
              if (server !== null) {
                client.deleteServer(server.slug)
                client.deleteSshKey(sshKeyId, server.slug)
              }
              if (deploy !== null) {
                deploy.closeConnection()
              }
              throw new Error('cancel')
          }
        })
        state.allowCancel = true
        dispatch('log', 'Creating server and waiting for run')
        try {
          server = await client.createServer(sshKeyId, region)
          dispatch('saveServer', server)
          // this hack for PROCESSING_CANCEL
          if (cancelled === true) {
            console.info('stopped. cancelled.')
            return
          }
          server = await client.checkServer(server.slug)
          dispatch('saveServer', server)
        } catch (e) {
          if (cancelled === true) {
            return
          }
          throw new Error(e.message)
        }
        dispatch('log', 'Connecting to the server (SSH)')
        if (cancelled === true) {
          console.info('stopped. cancelled.')
          return
        }
        deploy = new Deployment(server.ipv4, privateKey, connectionType, accountUsername, accountPassword, accountPskKey)
        try {
          await deploy.openConnection()
          state.allowCancel = false
          connected = true
        } catch (e) {
          console.log(e)
          console.log('ssh return error text:', e.message)
          dispatch('log', 'Connection failed. SSH error: ' + e.message)
          commit('PROCESSING_FAILED_CONNECTION')
          client.deleteServer(server.slug)
        }
      }
      while (connected === false && cancelled === false) {
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
      if (unsubscribe !== null) {
        unsubscribe();
      }
      if (cancelled === true) {
        console.info('end process. cancelled.')
        return
      }
      dispatch('log', 'Installing the required software') // @TODO wait interval

      let result = {}
      try {
        result = await deploy.setup()
      } catch (e) {
        console.debug('Error on setup: ', e, ' retry...')
        result = await deploy.setup() // lets try again
      }


      if (connectionType === 'openvpn') {
        dispatch('setAccountOvpn', result.ovpn)
      }
      dispatch('log', 'VPN service configured')
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
