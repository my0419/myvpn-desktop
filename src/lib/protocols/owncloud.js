import BaseProtocol from './base'

class NextcloudProtocol extends BaseProtocol {
  /**
   * @returns {Object}
   */
  /*    envVariables () {
        return Object.assign(super.envVariables(), {
            'DB_ROOT_PASSWORD': this.params.account.accounts[0].password,
        })
    }*/
}

export default NextcloudProtocol
