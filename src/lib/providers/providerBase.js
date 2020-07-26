import {generateRandomString} from "../string";

export class ProviderBase {
  constructor (config) {
    this.config = config
    this.aesKey = generateRandomString(32)
  }

  /**
   * MyVPN Agent Installer
   * @param params
   * @returns {string}
   */
  startupCommand(params) {
    return `#!/bin/sh
sudo wget -O /usr/local/bin/myvpn-agent https://github.com/my0419/myvpn-agent/releases/latest/download/myvpn-agent_linux_x86_64 &&
chmod +x /usr/local/bin/myvpn-agent &&
echo "[Unit]
Description=MyVPN Agent

[Service]
ExecStart=/usr/local/bin/myvpn-agent
Restart=no
Environment=VPN_TYPE=${params.connectionType}
Environment=VPN_IPSEC_PSK=${params.accountPskKey}
Environment=VPN_USER=${params.accountUsername}
Environment=VPN_PASSWORD=${params.accountPassword}
Environment=DNS_PRIMARY=${params.setting.dns.first}
Environment=DNS_SECONDARY=${params.setting.dns.second}
Environment=SHADOWSOCKS_PLUGIN_V2RAY_ENABLE=${params.setting.shadowsocks.v2rayPlugin ? '1' : '0'}
Environment=ENCRYPT_KEY=${this.aesKey}
Environment=VPN_CLIENT_CONFIG_FILE=/tmp/myvpn-client-config

[Install]
WantedBy=multi-user.target" > /etc/systemd/system/myvpn-agent.service &&
systemctl start myvpn-agent.service`
  }

  async identifyAccess () {
    return new Promise()
  }

  async regions () {
    return [{name: '', slug: '', available: false}]
  }

  async addSshKey (publicKey) {
  }

  async createServer (sshKeyId, region, protocol, startupCommand) {
    return {slug: '', ipv4: '', aesKey: this.aesKey}
  }

  async checkServer (id) {

  }

  async deleteServer (id) {

  }

  async deleteSshKey (id, dropletId) {

  }

}
