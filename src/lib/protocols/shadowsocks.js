import BaseProtocol from "./base";

class ShadowsocksProtocol extends BaseProtocol {

  /**
   * @returns {Object}
   */
  envVariables () {
    let port = 8381
    return Object.assign(super.envVariables(), {
      // VPN_ACCOUNTS_PASSWORD_x
      // VPN_ACCOUNTS_PORT_x
      'VPN_ACCOUNTS': this.params.account.accounts.map(val => {
        const params = {
          password: val.password,
          port: port
        }
        port += 1 // ports from 8381
        return params
      }),
      'SHADOWSOCKS_PLUGIN_V2RAY_ENABLE': this.params.setting.shadowsocks.v2rayPlugin // bool
    })
  }

}

export default ShadowsocksProtocol