import Vue from 'vue'
import Vuex from 'vuex'

// import { createPersistedState, createSharedMutations } from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: process.env.NODE_ENV === 'development' ? [
    // createPersistedState(), @TODO enable for electron build only
    // createSharedMutations()
  ] : [],
  strict: false,
  // strict: process.env.NODE_ENV !== 'production'
})
