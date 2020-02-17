const state = {
  list: [
    {
      key: 'l2tp',
      title: 'L2TP'
    },
    {
      key: 'pptp',
      title: 'PPTP'
    },
    {
      key: 'openvpn',
      title: 'OpenVPN'
    },
    {
      key: 'wireguard',
      title: 'WireGuard'
    },
    {
      key: 'shadowsocks',
      title: 'Shadowsocks'
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
