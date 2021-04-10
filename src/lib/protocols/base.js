class BaseProtocol {

  constructor (params) {
    this.params = params
  }

  /**
   * Defaults
   * @returns {Object}
   */
  envVariables () {
    const isDev = typeof process != 'undefined' && process.env.NODE_ENV === 'development'
    return {
      'VPN_TYPE': this.params.protocol,
      'DNS_PRIMARY': this.params.setting.dns.first,
      'DNS_SECONDARY': this.params.setting.dns.second,
      'ENCRYPT_KEY': this.params.aesKey,
      'VPN_CLIENT_CONFIG_FILE': '/tmp/myvpn-client-config',
      'MYVPN_DEBUG': isDev ? 'true' : 'false',
    }
  }

}

export default BaseProtocol