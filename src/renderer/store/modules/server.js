const state = {
  name: '',
  slug: null,
  ipv4: null,
  password: null
}

const mutations = {}

const actions = {
  saveServer ({ commit, state }, params) {
    const {name, slug, ipv4, password} = params
    state.name = name
    state.slug = slug
    state.ipv4 = ipv4
    state.password = password || null
  }
}

export default {
  state,
  mutations,
  actions
}
