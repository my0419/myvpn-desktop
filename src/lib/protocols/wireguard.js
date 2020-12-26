import BaseProtocol from "./base";

class WireguardProtocol extends BaseProtocol {

  /**
   * @returns {Object}
   */
  envVariables () {
    return Object.assign(super.envVariables(), {
      'ACCOUNTS_COUNT': this.params.setting.numberOfAccounts
    })
  }

}

export default WireguardProtocol