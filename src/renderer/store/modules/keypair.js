const state = {
  public: null,
  private: null,
  sshPublic: null
}

const mutations = {
  KEYPAIR_PUBLIC (state, key) {
    state.public = key
  },
  KEYPAIR_PRIVATE (state, key) {
    state.private = key
  },
  KEYPAIR_SSH (state, key) {
    state.sshPublic = key
  }
}

const actions = {
  generateKeypair ({ commit, state }) {
    let keypair = require('keypair')
    let forge = require('node-forge')

    let pair = keypair()
    commit('KEYPAIR_PUBLIC', pair.public)
    commit('KEYPAIR_PRIVATE', pair.private)
    let publicKey = forge.pki.publicKeyFromPem(pair.public)
    let ssh = forge.ssh.publicKeyToOpenSSH(publicKey, 'admin@self.host')
    commit('KEYPAIR_SSH', ssh)
  }
}

export default {
  state,
  mutations,
  actions
}
