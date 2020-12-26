import {sleep} from '../urils'
import {ServerAgent} from "./agent";
import Environment from "./environment";

export class Deployment {

  /**
   * @param sshIp
   * @param sshPort
   * @param sshUser
   * @param sshPassword
   * @param sshPrivateKey
   * @param {BaseProtocol} protocol
   */
  constructor (sshIp, sshPort, sshUser, sshPassword, sshPrivateKey, protocol) {
    let Client = require('ssh2').Client
    this.sshConn = new Client()
    this.connectionConfig = {
      host: sshIp,
      port: sshPort,
      username: sshUser,
      readyTimeout: 10000,
    }
    if (sshPrivateKey) {
      this.connectionConfig.privateKey = sshPrivateKey
    } else {
      this.connectionConfig.password = sshPassword
    }

    const variables = protocol.envVariables()
    const bash = ServerAgent.startupCommand(
      new Environment(variables)
    )

    this.bash = `
        #!/bin/sh
        echo '${bash} && exit 0' > /tmp/setup-vpn.sh &&
        sudo chmod +x /tmp/setup-vpn.sh &&
        sudo /tmp/setup-vpn.sh && exit 24
    `
    console.log('[bash] custom server', this.bash)

    this.connectionOpen = false
    this.setupComplete = false
  }

  async openConnection () {
    console.warn(`open connection: ${this.connectionConfig}`)
    let errorStr = null
    this.sshConn
      .on('ready', () => this.connectionOpen = true)
      .on('error', (err) => {
        console.warn('connection error event:', err)
        errorStr = err
      })
      .connect(this.connectionConfig)
    while (this.connectionOpen === false && errorStr === null) {
      await sleep(1000)
    }
    if (errorStr !== null) {
      throw new Error(errorStr)
    }
    console.warn(`connected ${this.connectionConfig}`)
  }

  async setup () {
    if (this.connectionOpen === false) {
      this.openConnection()
    }
    let error = null
    let stderrText = ''
    await this.sshConn.exec(this.bash, (err, stream) => {
      stream.on('close', (code, signal) => {
        this.setupComplete = (code === 0 || code === 24)
        if (this.setupComplete === false && error === null) {
          // https://www.secureblackbox.com/kb/help/ref_err_ssherrorcodes.html
          error = new Error(`Failed install software. Connection closed. Code: ${code}, Signal: ${signal}, STDERR: ${stderrText} `)
          error.code = code
        }
      })
      stream.on('data', (data) => {
        if (data.toString('utf8').indexOf('Please login as the user') !== -1) {
          error = new Error(data.toString('utf8'))
          this.closeConnection()
        }
        console.log('STDOUT: ', data.toString('utf8'))
      }).stderr.on('data', (data) => {
        stderrText = data.toString('utf8')
        console.log('STDERR: ', data.toString('utf8'))
      })
    })

    while (this.setupComplete === false && error === null) {
      await sleep(1000)
    }
    this.closeConnection()
    if (error !== null) {
      throw error
    }
    return true
  }

  closeConnection () {
    this.connectionOpen = false
    this.setupComplete = false
    this.sshConn.end()
    this.sshConn.destroy()
  }
}