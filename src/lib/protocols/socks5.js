import BaseProtocol from "./base";

class Socks5Protocol extends BaseProtocol {

  /**
   * @returns {Object}
   */
  envVariables () {
    return Object.assign(super.envVariables(), {
      'ACCESS_TYPE': 'public',
      'VPN_PORT': this.params.setting.customPort,
      'VPN_USER': '',
      'VPN_PASSWORD': '',
    })
  }

}

export default Socks5Protocol