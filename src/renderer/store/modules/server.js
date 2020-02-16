const state = {
  name: '',
  slug: null,
  ipv4: null,
  password: null,
  aesKey: null,
  sshUser: 'root',
  sshPort: 22,
  sshPassword: '',
  sshPrivateKey: null
}

const mutations = {}

const actions = {
  saveServer ({ commit, state }, params) {
    const {name, slug, ipv4, password, aesKey} = params
    state.name = name
    state.slug = slug
    state.ipv4 = ipv4
    state.aesKey = aesKey
    state.password = password || null
  }
}

export default {
  state,
  mutations,
  actions
}
