import {generateHumanString} from '../../../lib/string'
import {CONFIG_SPLIT_ACCOUNTS_LINE} from "../../../lib/server/agent";

const state = {
  accounts: [],
  pskKey: '',
  clientConfig: [],
}

const mutations = {
}

const actions = {
  generatePersonalAccess ({ commit, state }, numberOfAccounts) {

    if (numberOfAccounts <= 0) {
      numberOfAccounts = 1
    }

    state.accounts = []
    for (let n = 1; n <= numberOfAccounts; n++) {
      state.accounts.push({
        username: generateHumanString(6),
        password: generateHumanString(8)
      })
    }

    state.pskKey = generateHumanString(8)
  },
  setClientConfig ({ commit, state }, value) {
    state.clientConfig = value.split(CONFIG_SPLIT_ACCOUNTS_LINE)
  }
}

export default {
  state,
  mutations,
  actions
}
