import BaseProtocol from "./base";

class PptpProtocol extends BaseProtocol {

  /**
   * @returns {Object}
   */
  envVariables () {
    return Object.assign(super.envVariables(), {
      'VPN_USER': this.params.account.accounts[0].username,
      'VPN_PASSWORD': this.params.account.accounts[0].password,
    })
  }

}

export default PptpProtocol