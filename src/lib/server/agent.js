import axiosRetry from 'axios-retry'
import axios from 'axios'
import aesjs from 'aes-js'
import { generateRandomString } from '../string'

export const CONFIG_SPLIT_ACCOUNTS_LINE = '----- next account config ------'

const TIMEOUT_CODE_ERROR = 'ECONNABORTED'
const NETWORK_CODE_ERROR = 'ERR_NETWORK'

export class ServerAgent {
  constructor(serverIp, aesKey) {
    this.aesKey = aesKey
    this.serverIp = serverIp
  }

  async getState() {
    const isBrowser = document.getElementById('app').getAttribute('data-target') === 'web'

    const agentUrl = isBrowser
      ? `https://${this.serverIp}.nip.io`
      : `http://${this.serverIp}:8400`

    const client = axios.create({ baseURL: agentUrl, timeout: 5000 })

    let retries = 30

    axiosRetry(client, {
      retries,
      retryCondition: error => {
        retries--

        const isRetriesLength = retries > 0
        const isTimeOutOrNetworkError =
          error.code === TIMEOUT_CODE_ERROR || error.code === NETWORK_CODE_ERROR
        const isNetworkOrIdempotentRequestError =
          axiosRetry.isNetworkOrIdempotentRequestError(error)

        return (
          isNetworkOrIdempotentRequestError || isTimeOutOrNetworkError || isRetriesLength
        )
      },
      retryDelay: retryCount => 2500,
      shouldResetTimeout: true,
    })

    return await client.get('/').then(res => {
      let encryptedBytes = new Buffer(res.data, 'base64')

      let aesCbc = new aesjs.ModeOfOperation.cbc(
        new TextEncoder('utf-8').encode(this.aesKey),
        new Int8Array(new ArrayBuffer(16)),
      )

      let decryptedBytes = aesjs.padding.pkcs7.strip(aesCbc.decrypt(encryptedBytes))

      let decryptedData = aesjs.utils.utf8.fromBytes(decryptedBytes)

      return JSON.parse(decryptedData)
    })
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
  static startupCommand(environment) {
    const serviceEnvConfig = environment.convertToString('Environment=')
    return `
      #!/bin/sh
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
      systemctl start myvpn-agent.service
    `
  }
}
