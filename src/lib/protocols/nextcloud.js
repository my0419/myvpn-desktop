import BaseProtocol from './base'

class NextcloudProtocol extends BaseProtocol {
  /**
   * @returns {Object}
   */
  envVariables() {
    const nextcloud = this.params.setting.nextcloud
    return Object.assign(super.envVariables(), {
      NC_DOMAIN: nextcloud.domain,
      NC_DB_DRIVER: nextcloud.db,
      NC_LETSENCRYPT_EMAIL: nextcloud.email,
    })
  }
}

export default NextcloudProtocol
