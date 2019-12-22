import {ProviderFactory} from '../../../lib/providers'

const state = {
  name: null,
  config: {}, // ex. token
  client: null,
  regions: [],
  processing: false,
  configuredSuccess: null,
  configuredError: ''
}

const mutations = {
  PROVIDER_CONFIGURE_SUCCESS (state) {
    state.configuredSuccess = true
    state.configuredError = ''
  },
  PROVIDER_CONFIGURE_FAILED (state, text) {
    state.configuredSuccess = false
    state.configuredError = text
  },
  PROVIDER_CONFIGURE_START_PROCESSING (state) {
    state.processing = true
  },
  PROVIDER_CONFIGURE_STOP_PROCESSING (state) {
    state.processing = false
  },
  PROVIDER_REGISTER_CLIENT (state, client) {
    state.configuredError = ''
    state.configuredSuccess = null
    state.client = client
  },
  PROVIDER_REGIONS (state, regions) {
    state.regions = regions
  },
  UPDATE_CONFIG (state, value) {
    state.config = value
  }
}
const actions = {
  async configureProvider ({ commit, dispatch, state }, params) {
    const { name, config } = params
    const { apikey } = config
    state.name = name
    if (apikey === '' || Object.keys(config).length === 0) {
      state.configuredSuccess = null
      return
    }
    let client = ProviderFactory.register(name, config)
    commit('PROVIDER_REGISTER_CLIENT', client)
    commit('PROVIDER_CONFIGURE_START_PROCESSING')
    try {
      await client.identifyAccess()
      let regions = await client.regions()
      commit('PROVIDER_REGIONS', regions)
      if (regions.length > 0) {
        commit('REGION_PROVIDER', regions[0].slug) // set default region
      }
      commit('PROVIDER_CONFIGURE_SUCCESS')
      dispatch('loadDroplets', {client})
    } catch (e) {
      if (e.message.includes('Unexpected token')) {
        return commit('PROVIDER_CONFIGURE_FAILED', 'Failed to connect to the API of the hosting provider.')
      } else {
        return commit('PROVIDER_CONFIGURE_FAILED', e.message.replace('Unable to authenticate you.', 'You entered an incorrect key. Authentication failed.'))
      }
    } finally {
      commit('PROVIDER_CONFIGURE_STOP_PROCESSING')
    }
  },
  updateConfig ({ commit, state }, val) {
    commit('UPDATE_CONFIG', val)
  }
}

export default {
  state,
  mutations,
  actions
}
