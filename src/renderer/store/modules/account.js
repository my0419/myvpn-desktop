import {generateHumanString} from '../../../lib/string'

const state = {
  username: '',
  password: '',
  pskKey: '',
  ovpn: ''
}

const mutations = {
}

const actions = {
  generatePersonalAccess ({ commit, state }) {
    state.username = generateHumanString(6)
    state.password = generateHumanString(8)
    state.pskKey = generateHumanString(8)
  },
  setAccountOvpn ({ commit, state }, value) {
    state.ovpn = value
  }
}

export default {
  state,
  mutations,
  actions
}
