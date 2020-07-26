const TYPE_L2TP='l2tp',
      TYPE_PPTP='pptp',
      TYPE_OPENVPN='openvpn',
      TYPE_WIREGUARD='wireguard',
      TYPE_SHADOWSOCKS='shadowsocks',
      CODES = [
        {code: 1, type: TYPE_L2TP},
        {code: 2, type: TYPE_PPTP},
        {code: 3, type: TYPE_OPENVPN},
        {code: 4, type: TYPE_WIREGUARD},
        {code: 5, type: TYPE_SHADOWSOCKS},
      ]

const state = {
  list: [
    {
      key: TYPE_L2TP,
      title: 'L2TP'
    },
    {
      key: TYPE_PPTP,
      title: 'PPTP'
    },
    {
      key: TYPE_OPENVPN,
      title: 'OpenVPN'
    },
    {
      key: TYPE_WIREGUARD,
      title: 'WireGuard'
    },
    {
      key: TYPE_SHADOWSOCKS,
      title: 'Shadowsocks'
    }
  ],
  selected: TYPE_L2TP
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
  actions,
  codes: CODES
}
