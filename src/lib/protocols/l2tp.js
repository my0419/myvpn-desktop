import BaseProtocol from "./base";

class L2tpProtocol extends BaseProtocol {

  /**
   * @returns {Object}
   */
  envVariables () {
    return Object.assign(super.envVariables(), {
      'VPN_IPSEC_PSK': this.params.account.pskKey,
      'VPN_USER': this.params.account.accounts[0].username,
      'VPN_PASSWORD': this.params.account.accounts[0].password,
    })
  }

}

export default L2tpProtocol