import {
  PROTOCOL_CODES,
  PROTOCOL_LIST,
  TYPE_L2TP
} from "../../../lib/protocols";

const state = {
  list: PROTOCOL_LIST,
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
  codes: PROTOCOL_CODES
}
