import {sleep} from '../urils'

export class Deployment {
  constructor (ipv4, privateKey, connectionType, username, password, pskKey) {
    let Client = require('ssh2').Client
    this.sshConn = new Client()
    this.ipv4 = ipv4
    this.privateKey = privateKey
    this.connectionType = connectionType
    this.username = username
    this.password = password
    this.pskKey = pskKey

    this.connectionOpen = false
    this.setupComplete = false
  }

  async openConnection () {
    console.warn(`open connection: ${this.ipv4}`)
    let errorStr = null
    this.sshConn
      .on('ready', () => this.connectionOpen = true)
      .on('error', (err) => {
        console.warn('connection error event:', err)
        errorStr = err
      })
      .connect({
        host: this.ipv4,
        port: 22,
        username: 'root',
        privateKey: this.privateKey,
        readyTimeout: 30000,
        // timeout: 1,
        // debug: (data) => {}
      })
    while (this.connectionOpen === false && errorStr === null) {
      await sleep(1000)
    }
    if (errorStr !== null) {
      throw new Error(errorStr)
    }
    console.warn(`connected ${this.ipv4}`)
  }

  async setup () {
    if (this.connectionOpen === false) {
      this.openConnection()
    }
    let error = null
    let exec = {cmd: '', successExec: ''}
    let res = {}
    switch (this.connectionType) {
      case 'l2tp': {
        exec.cmd = `export VPN_IPSEC_PSK=${this.pskKey} && export VPN_USER=${this.username} && export VPN_PASSWORD=${this.password} && bash -c "$(wget https://gist.githubusercontent.com/myvpn-run/c2ba3ac57c290a15f6808affc8419edf/raw/17fda843f3ad2ddaebc8ceaa9197a2a89f75ee4d/l2tp.sh -O -)"`
        exec.successExec = 'IPsec VPN server is now ready for use'
        break
      }
      case 'pptp': {
        exec.cmd = `export CLIENT=${this.username} && export PASS=${this.password} && bash -c "$(wget https://gist.githubusercontent.com/myvpn-run/5681e9085b2f0e9bef7c435746b99462/raw/5a9b42cb6d2df3f2fc2637ab83a025859191e88d/pptp.sh -O -)"`
        exec.successExec = 'All done!'
        break
      }
      case 'openvpn': {
        exec.cmd = `export CLIENT=${this.username} && bash -c "$(wget https://gist.githubusercontent.com/myvpn-run/ab573e451a7b44991fb3a4566496d0f0/raw/4b9aa9f10049f1350fd81e1d1e4350b5bb227c7e/openvpn.sh -O -)" && cat /root/${this.username}.ovpn`
        exec.successExec = 'remote-cert-tls server'
        break
      }
      case 'wireguard': {
        exec.cmd = `bash -c "$(wget https://gist.githubusercontent.com/my0419/e5adf8d1d1102d214bd5c0af8fad3529/raw/2d2fb800086d3dafe4654d506a4960275428d626/wireguard.sh -O -)"`
        exec.successExec = 'Endpoint ='
        break
      }
    }
    await sleep(5000)
    await this.sshConn.exec(exec.cmd, (err, stream) => {
      stream.on('close', (code, signal) => {
        if (this.setupComplete === false) {
          // https://www.secureblackbox.com/kb/help/ref_err_ssherrorcodes.html
          error = new Error(`Failed install software. Connection closed. Code: ${code}, Signal: ${signal} `)
          error.code = code
        }
      })
      stream.on('data', (data) => {
        console.log('STDOUT: ', data.toString('utf8'))
        this.setupComplete = data.toString('utf8').includes(exec.successExec)
        if (this.connectionType === 'openvpn' && this.setupComplete) {
          res.ovpn = data.toString('utf8')
        }
        if (this.connectionType === 'wireguard' && this.setupComplete) {
          res.wireguard = data.toString('utf8')
        }
      }).stderr.on('data', (data) => {
        if (data.toString('utf8').includes('not get lock /var/lib/dpkg/lock')) {
          error = new Error('Failed install software, dpkg locked')
          console.warn(data.toString('utf8'))
        }
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
    return res
  }

  closeConnection () {
    console.warn(`close connection: ${this.ipv4}`)
    this.connectionOpen = false
    this.setupComplete = false
    this.sshConn.end()
    this.sshConn.destroy()
  }
}
