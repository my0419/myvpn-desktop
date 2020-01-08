import axiosRetry from 'axios-retry'
import axios from 'axios'
import aesjs from 'aes-js'

const AGENT_HTTP_PORT = 8400;

export class ServerAgent {

  constructor (serverIp, aesKey) {
    this.aesKey = aesKey
    this.agentUrl = `http://${serverIp}:${AGENT_HTTP_PORT}`
  }

  async getState() {
    const client = axios.create({ baseURL: this.agentUrl, timeout: 1000 });
    let retries = 30
    axiosRetry(client, {
      retries,
      retryCondition: (error) => {
        retries -= 1
        return (axiosRetry.isNetworkOrIdempotentRequestError(error) || error.toString().indexOf('timeout of') !== -1) && retries > 0;
      },
      retryDelay: (retryCount) => 1000,
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
}
