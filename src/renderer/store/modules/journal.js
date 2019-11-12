const state = {
  log: ''
}

const mutations = {
  JOURNAL_LOG_WRITE (state, text) {
    state.log += `${text}\n`
  }
}

const actions = {
  log ({ commit, state }, text) {
    commit('JOURNAL_LOG_WRITE', text)
  }
}

export default {
  state,
  mutations,
  actions
}
