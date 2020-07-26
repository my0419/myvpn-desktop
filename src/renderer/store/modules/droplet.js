import storeType from "./type";

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
    state.list = (servers || []).map(v => {
      let typeObj = null
      let code = v.name.split('-')[1] || null
      if (code !== null) {
        typeObj = (storeType.codes.filter(v => v.code == code) || [])[0] || null;
      }
      return {...v, ...{'type': typeObj ? typeObj.type : null}}
    })
    state.isEmpty = servers.length === 0
  }
}

export default {
  state,
  mutations,
  actions
}
