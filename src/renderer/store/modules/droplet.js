const state = {
  name: '',
  list: [],
  isEmpty: null,
  loading: false
}

const mutations = {}

const actions = {
  async loadDroplets ({ commit, state }, params) {
    const { client } = params
    state.loading = true
    let servers = await client.serverList()
    state.loading = false
    state.list = servers
    state.isEmpty = servers.length === 0
  }
}

export default {
  state,
  mutations,
  actions
}
