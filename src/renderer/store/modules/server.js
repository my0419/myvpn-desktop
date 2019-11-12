const state = {
  name: '',
  slug: null,
  ipv4: null
}

const mutations = {}

const actions = {
  saveServer ({ commit, state }, params) {
    const {name, slug, ipv4} = params
    state.name = name
    state.slug = slug
    state.ipv4 = ipv4
  }
}

export default {
  state,
  mutations,
  actions
}
