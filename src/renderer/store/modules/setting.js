const dnsList = [
  {
    title: 'Open DNS',
    first: '208.67.222.222',
    second: '208.67.220.220'
  },
  {
    title: 'Cloudflare',
    first: '1.1.1.1',
    second: '1.0.0.1'
  },
  {
    title: 'Comodo Secure DNS',
    first: '8.26.56.26',
    second: '8.20.247.20'
  },
  {
    title: 'Google Public DNS',
    first: '8.8.8.8',
    second: '8.8.4.4'
  },
  {
    title: 'Quad9',
    first: '9.9.9.9',
    second: '149.112.112.112'
  },
  {
    title: 'Level3',
    first: '209.244.0.3',
    second: '208.244.0.4'
  },
  {
    title: 'DNS Advantage',
    first: '156.154.70.1',
    second: '156.154.71.1'
  },
  {
    title: 'OpenNIC',
    first: '46.151.208.154',
    second: '128.199.248.105'
  },
  {
    title: 'Dyn',
    first: '216.146.35.35',
    second: '216.146.36.36'
  },
  {
    title: 'SafeDNS',
    first: '195.46.39.39',
    second: '195.46.39.40'
  },
  {
    title: 'DNS.Watch',
    first: '84.200.69.80',
    second: '84.200.70.40'
  },
  {
    title: 'Custom',
    first: null,
    second: null
  }
]

const state = {
  dns: {
    // default: Open DNS
    first: dnsList[0].first,
    second: dnsList[0].second,
    list: dnsList
  },
  shadowsocks: {
    v2rayPlugin: false
  },
  customPort: 1080, // default socks5 only
  numberOfAccounts: 1,
}

const mutations = {
  SET_CUSTOM_PORT (state, val) {
    state.customPort = val
  },
  SET_FIRST_DNS (state, val) {
    state.dns.first = val
  },
  SET_SECOND_DNS (state, val) {
    state.dns.second = val
  },
  RESET_DNS (state) {
    state.dns.first = state.dns.list[0].first
    state.dns.second = state.dns.list[0].second
  }
}

const actions = {
  setDNSFirst ({ commit, state }, val) {
    commit('SET_FIRST_DNS', val)
  },
  setCustomPort ({ commit, state }, val) {
    commit('SET_CUSTOM_PORT', val)
  },
  setDNSSecond ({ commit, state }, val) {
    commit('SET_SECOND_DNS', val)
  },
  resetDNS ({ commit, state }) {
    commit('RESET_DNS')
  }
}

export default {
  state,
  mutations,
  actions
}
