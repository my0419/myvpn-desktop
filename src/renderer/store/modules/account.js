import {generateHumanString} from '../../../lib/string'

const state = {
  username: '',
  password: '',
  pskKey: '',
  clientConfig: ''
}

const mutations = {
}

const actions = {
  generatePersonalAccess ({ commit, state }) {
    state.username = generateHumanString(6)
    state.password = generateHumanString(8)
    state.pskKey = generateHumanString(8)
  },
  setClientConfig ({ commit, state }, value) {
    state.clientConfig = value
  }
}

export default {
  state,
  mutations,
  actions
}
