import axiosRetry from 'axios-retry'
import axios from 'axios'
import aesjs from 'aes-js'
import {generateRandomString} from "../string";

export const AGENT_HTTP_PORT = 8400;
export const CONFIG_SPLIT_ACCOUNTS_LINE = '----- next account config ------'

export class ServerAgent {

  constructor (serverIp, aesKey) {
    this.aesKey = aesKey
    this.serverIp = serverIp
  }

  async getState() {
    const agentUrl = `http://${this.serverIp}:${AGENT_HTTP_PORT}`
    const client = axios.create({ baseURL: agentUrl, timeout: 5000 });
    let retries = 30
    axiosRetry(client, {
      retries,
      retryCondition: (error) => {
        retries -= 1
        console.log('retry condition on error', error)
        return (axiosRetry.isNetworkOrIdempotentRequestError(error) || error.toString().indexOf('timeout of') !== -1) && retries > 0;
      },
      retryDelay: (retryCount) => 2500,
      shouldResetTimeout: true
    });

    return await client.get('/').then(res => {
        let encryptedBytes = new Buffer(res.data, 'base64');
        let aesCbc = new aesjs.ModeOfOperation.cbc(new TextEncoder('utf-8').encode(this.aesKey), new Int8Array(new ArrayBuffer(16)));
        let decryptedBytes = aesjs.padding.pkcs7.strip(aesCbc.decrypt(encryptedBytes));
        let decryptedData = aesjs.utils.utf8.fromBytes(decryptedBytes)
        return JSON.parse(decryptedData)
    });
  }

  /**
   * Generate random AES Key
   * @returns {string}
   */
  static generateAesKey() {
    return generateRandomString(32)
  }

  /**
   * Setting up the server environment command
   *
   * @param {Environment} environment
   * @returns {string}
   */
  static startupCommand(environment)
  {
    const serviceEnvConfig = environment.convertToString('Environment=')
    return `#!/bin/sh
sudo wget -O /usr/local/bin/myvpn-agent https://github.com/my0419/myvpn-agent/releases/latest/download/myvpn-agent_linux_x86_64 &&
chmod +x /usr/local/bin/myvpn-agent &&
echo "[Unit]
Description=MyVPN Agent

[Service]
ExecStart=/usr/local/bin/myvpn-agent
Restart=no
${serviceEnvConfig}

[Install]
WantedBy=multi-user.target" > /etc/systemd/system/myvpn-agent.service &&
systemctl start myvpn-agent.service`
  }

}
