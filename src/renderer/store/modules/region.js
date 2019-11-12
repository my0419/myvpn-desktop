const state = {
  value: null
}

const mutations = {
  REGION_PROVIDER (state, slug) {
    state.value = slug
  }
}

const actions = {
  updateRegion ({ commit, state }, index) {
    commit('REGION_PROVIDER', index)
  }
}

export default {
  state,
  mutations,
  actions
}
