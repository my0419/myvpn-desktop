class BaseProtocol {

  constructor (params) {
    this.params = params
  }

  /**
   * @returns {Object}
   */
  envVariables () {
    return {
      'VPN_TYPE': this.params.protocol,
      'DNS_PRIMARY': this.params.setting.dns.first,
      'DNS_SECONDARY': this.params.setting.dns.second,
      'ENCRYPT_KEY': this.params.aesKey,
      'VPN_CLIENT_CONFIG_FILE': '/tmp/myvpn-client-config'
    }
  }

}

export default BaseProtocol