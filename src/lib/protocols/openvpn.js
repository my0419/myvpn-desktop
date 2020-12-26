import BaseProtocol from "./base";

class OpenvpnProtocol extends BaseProtocol {

  /**
   * @returns {Object}
   */
  envVariables () {
    return Object.assign(super.envVariables(), {
      'VPN_USER': this.params.account.accounts[0].username,
    })
  }

}

export default OpenvpnProtocol