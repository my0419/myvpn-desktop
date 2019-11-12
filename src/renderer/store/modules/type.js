const state = {
  list: [
    {
      key: 'l2tp',
      title: 'Login and password — L2TP'
    },
    {
      key: 'pptp',
      title: 'Login and password — PPTP'
    },
    {
      key: 'openvpn',
      title: 'File — OpenVPN'
    }
  ],
  selected: 'l2tp'
}

const mutations = {
  ACCESS_TYPE (state, val) {
    state.selected = val
  }
}

const actions = {
  updateType ({ commit, state }, val) {
    commit('ACCESS_TYPE', val)
  }
}

export default {
  state,
  mutations,
  actions
}
