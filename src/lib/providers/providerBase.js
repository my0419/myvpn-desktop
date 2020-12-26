export class ProviderBase {

  constructor (config) {
    this.config = config
  }

  async identifyAccess () {
    return new Promise()
  }

  async regions () {
    return [{name: '', slug: '', available: false}]
  }

  async addSshKey (publicKey) {
  }

  async createServer (sshKeyId, region, protocol, startupCommand) {
    return {slug: '', ipv4: ''}
  }

  async checkServer (id) {

  }

  async deleteServer (id) {

  }

  async deleteSshKey (id, dropletId) {

  }

}
