import BaseProtocol from './base'

class Ikev2Protocol extends BaseProtocol {
  /**
   * @returns {Object}
   */
  envVariables() {
    return Object.assign(super.envVariables(), {
      ACCOUNTS_COUNT: this.params.setting.numberOfAccounts,
      VPN_ACCOUNTS: this.params.account.accounts,
    })
  }
}

export default Ikev2Protocol
