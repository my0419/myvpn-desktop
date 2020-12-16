<template>
    <div class="app-page step-access">
        <el-alert :title="$t('Save access to the VPN. When you exit, all data will be cleared.')" type="warning" show-icon></el-alert>

        <div class="selectable m-top">
            <el-row style="text-align: right">
                <el-button type="success" size="mini"  v-on:click="handleMainPage" icon="el-icon-arrow-left">{{ $t('Go Back') }}</el-button>
                <el-button v-if="selectedProvider !== 'custom'" type="danger" size="mini" v-on:click="deleteServer" icon="el-icon-delete">{{ $t('Delete server') }}</el-button>
            </el-row>

            <el-tabs v-model="activeTab">
                <el-tab-pane :label="$t('My VPN')" name="1">
                    <div v-if="connectionType === 'l2tp'">
                        <h2>{{ $t('Type of connection') }}</h2>
                        <h3>L2TP</h3>

                        <h2>{{ $t('IP address') }}</h2>
                        <h3><Copied :text="serverIp" /></h3>

                        <h2>{{ $t('Login') }}</h2>
                        <h3><Copied :text="accountUsername" /></h3>

                        <h2>{{ $t('Password') }}</h2>
                        <h3><Copied :text="accountPassword" /></h3>

                        <h2>{{ $t('PSK key') }}</h2>
                        <h3><Copied :text="accountPskKey" /></h3>
                    </div>
                    <div v-if="connectionType === 'l2tp'">
                        <h2>{{ $t('Type of connection') }}</h2>
                        <h3>L2TP</h3>

                        <h2>{{ $t('IP address') }}</h2>
                        <h3><Copied :text="serverIp" /></h3>

                        <h2>{{ $t('Login') }}</h2>
                        <h3><Copied :text="accountUsername" /></h3>

                        <h2>{{ $t('Password') }}</h2>
                        <h3><Copied :text="accountPassword" /></h3>
                    </div>
                    <div v-if="connectionType === 'socks5'">
                        <h2>{{ $t('Type of connection') }}</h2>
                        <h3>SOCKS5</h3>

                        <h2>{{ $t('IP address') }}</h2>
                        <h3><Copied :text="serverIp" /></h3>

                        <h2>{{ $t('Port') }}</h2>
                        <h3><Copied text="1080" /></h3>

                    </div>
                    <div v-if="connectionType === 'openvpn'">
                        <h2>{{ $t('Type of connection') }}</h2>
                        <h3>OpenVPN</h3>
                        <h2>{{ $t('IP address') }}</h2>
                        <h3><Copied :text="serverIp" /></h3>
                        <el-button type="primary" v-on:click="saveOpenvpn" icon="el-icon-tickets">{{ $t('Save ovpn file') }}</el-button>
                    </div>
                    <div v-if="connectionType === 'wireguard'">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <h2>{{ $t('Type of connection') }}</h2>
                                <h3>WireGuard</h3>
                                <h2>{{ $t('IP address') }}</h2>
                                <h3><Copied :text="serverIp" /></h3>
                                <el-button type="primary" v-on:click="saveWireguard" icon="el-icon-tickets">{{ $t('Save WireGuard Configuration') }}</el-button>
                            </el-col>
                            <el-col :span="12">
                                <h2>{{ $t('Connect via QR Code') }}</h2>
                                <qrcode-vue :value="clientConfig" :size="300" :level="M"></qrcode-vue>
                                <el-button type="primary" icon="el-icon-download" size="small" v-on:click="saveQrCode">{{ $t('Save QR Code') }}</el-button>
                                <hr />
                            </el-col>
                        </el-row>
                    </div>
                    <div v-if="connectionType === 'shadowsocks'">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <h2>{{ $t('IP address') }}</h2>
                                <h3><Copied :text="serverIp" /></h3>
                                <h2>{{ $t('Password') }}</h2>
                                <h3><Copied :text="accountPassword" /></h3>
                                <h2>{{ $t('Server Port') }}</h2>
                                <h3><Copied text="8388" /></h3>
                                <h2>{{ $t('Local Port') }}</h2>
                                <h3><Copied text="1080" /></h3>
                                <h2>{{ $t('Encryption method') }}</h2>
                                <h3><Copied text="chacha20-ietf-poly1305" /></h3>
                            </el-col>
                            <el-col :span="12">
                                <h2>{{ $t('Connect via QR Code') }}</h2>
                                <qrcode-vue :value="shadowsocksConnect" :size="200" :level="M"></qrcode-vue>
                                <el-button type="primary" icon="el-icon-download" size="small" v-on:click="saveQrCode">{{ $t('Save QR Code') }}</el-button>
                                <h2>{{ $t('Config') }}</h2>
                                <el-button type="primary" v-on:click="saveShadowsocks" icon="el-icon-tickets">{{ $t('Save Shadowsocks Configuration') }}</el-button>
                                <div class="copied-section">
                                    <Copied :text="clientConfig" :hiddenText="true" />
                                </div>
                                <h2>{{ $t('Protocol Connection') }}</h2>
                                <el-input :value="shadowsocksConnect" :readonly="true"/>
                                <div class="copied-section">
                                    <Copied :text="shadowsocksConnect" :hiddenText="true" />
                                </div>
                                <hr />
                            </el-col>
                        </el-row>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="$t('My Server')" name="2" v-if="selectedProvider !== 'custom'">
                    <el-button-group>
                        <el-button type="primary" icon="el-icon-document-copy" v-clipboard="serverAccess" v-clipboard:success="clipboardSuccessHandler">{{ $t('Copy all accesses') }}</el-button>
                        <el-button type="primary" icon="el-icon-download" v-on:click="saveServerAccess">{{ $t('Save all accesses') }}</el-button>
                    </el-button-group>
                    <h2>{{ $t('IP address') }}</h2>
                    <h3><Copied :text="serverIp" /></h3>

                    <h2>{{ $t('User') }}</h2>
                    <h3><Copied text="root" /></h3>

                    <div v-if="serverPassword">
                        <h2>{{ $t('Root password') }}</h2>
                        <h3><Copied :text="serverPassword" /></h3>
                    </div>

                    <el-alert :title="$t('To connect to the server via SSH, save a private key named «myvpn.key» and enter the command below')" type="info"></el-alert>

                    <h2>{{ $t('Private Key') }}</h2>
                    <el-input  type="textarea" :value="keypairPrivate" :readonly="true"/>
                    <Copied :text="keypairPrivate" :hiddenText="true" />
                    <div class="m-top">
                        <el-button type="primary" v-on:click="savePrivateKey" icon="el-icon-tickets">{{ $t('Save Private Key') }}</el-button>
                    </div>
                    <h2>{{ $t('Command to connect') }}</h2>
                    <el-input :value="`chmod 600 myvpn.key && ssh -i myvpn.key root@${serverIp}`" :readonly="true"/>
                    <Copied :text="`chmod 600 myvpn.key && ssh -i myvpn.key root@${serverIp}`" :hiddenText="true" />

                    <h2>{{ $t('RSA Key') }}</h2>
                    <el-input  type="textarea" :value="keypairSshPublic" :readonly="true"/>
                    <Copied :text="keypairSshPublic" :hiddenText="true" />
                    <div class="m-top">
                        <el-button type="primary" v-on:click="saveRsaKey" icon="el-icon-tickets">{{ $t('Save RSA Key') }}</el-button>
                    </div>

                    <h2>{{ $t('Public Key') }}</h2>
                    <el-input  type="textarea" :value="keypairPublic" :readonly="true"/>
                    <Copied :text="keypairPublic" :hiddenText="true" />
                    <div class="m-top">
                        <el-button type="primary" v-on:click="savePublicKey" icon="el-icon-tickets">{{ $t('Save Public Key') }}</el-button>
                    </div>

                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<style scoped>
    h3 {
        text-transform: none;
    }
    .copied-section {
        margin-top: 10px;
    }
</style>

<script>
  import { mapState } from 'vuex'
  import QrcodeVue from 'qrcode.vue'
  import Copied from './Copied'

  const fs = require('fs')
  const isBrowser = process.browser
  let electron = null

  if (!isBrowser) {
    const { remote } = require('electron')
    electron = { remote }
  }  

  function renderMessage(message, type, options) {
    return this.$message({message: this.$root.$t(message), type, ...options})
  }

  function displaySuccessfulMessage() {
    renderMessage.call(this, 'File saved', 'success')
  }

  function displayErrorMessage(error) {
    console.log('save file error: ', error)
    renderMessage.call(this, 'Failed to save the file', 'error', {
      dangerouslyUseHTMLString: true,
    })
  }

  function saveFileFromBrowser(filename, fileData) {
    const blob = new Blob([fileData], {type: "text/*"});
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  function saveFileHandler(filename, fileData) {
    if (isBrowser) {
      try {        
        saveFileFromBrowser.call(this, filename, fileData)
      } catch(error) {
        displayErrorMessage.call(this, error)
      }
    } else {
      const savePath = electron.remote.dialog.showSaveDialog({defaultPath: filename})
      fs.writeFile(savePath, fileData, 'binary', (err) => {
        err !== null ? displayErrorMessage.call(this, err) : displaySuccessfulMessage.call(this)
      })
    }
  }

  export default {
    components: {Copied, QrcodeVue},
    data () {
      return {
        activeTab: '1'
      }
    },
    computed: mapState({
      selectedProvider: state => state.provider.name,
      configuredSuccess: state => state.provider.configuredSuccess,
      connectionType: state => state.type.selected,
      serverName: state => state.server.name,
      serverSlug: state => state.server.slug,
      serverIp: state => state.server.ipv4,
      serverPassword: state => state.server.password,
      keypairPrivate: state => state.keypair.private,
      keypairPublic: state => state.keypair.public,
      keypairSshPublic: state => state.keypair.sshPublic,
      accountUsername: state => state.account.username,
      accountPassword: state => state.account.password,
      accountPskKey: state => state.account.pskKey,
      clientConfig: state => state.account.clientConfig,
      shadowsocksConnect: state => {
        return `ss://${btoa(`chacha20-ietf-poly1305:${state.account.password}@${state.server.ipv4}:8388`)}`
      },
      serverAccess: state => `Server Name: ${state.server.name}
IP: ${state.server.ipv4}
Username: root

Private Key:
${state.keypair.private}

RSA Key:
${state.keypair.sshPublic}

Public Key:
${state.keypair.public}

Command:
ssh -i myvpn.key root@${state.server.ipv4}`
    }),
    mounted: function () {
      if (!this.configuredSuccess) {
        this.$router.push({ name: 'main' })
      }
    },
    methods: {
      clipboardSuccessHandler ({ value, event }) {
        this.$message({message: this.$root.$t('Copied!'), type: 'success', duration: 800})
      },
      handleMainPage: function () {
        this.$router.push({ name: 'main' })
      },
      deleteServer: function () {
        this.$store.dispatch('deleteServer', this.serverSlug)
        renderMessage.call(this, 'Request to delete the server has been sent', 'success')
        this.$router.push({ name: 'main' })
      },
      saveOpenvpn: function () {
        this.saveFile(`myvpn-${this.serverName}.ovpn`, this.clientConfig)
      },
      saveWireguard: function () {
        this.saveFile('wireguard.conf', this.clientConfig)
      },
      saveShadowsocks: function () {
        this.saveFile('shadowsocks-client.json', this.clientConfig)
      },
      savePrivateKey: function () {
        this.saveFile('myvpn.key', this.keypairPrivate)
      },
      saveRsaKey: function () {
        this.saveFile('myvpn-rsa.key', this.keypairSshPublic)
      },
      savePublicKey: function () {
        this.saveFile('myvpn-public.key', this.keypairPublic)
      },
      saveServerAccess: function () {
        this.saveFile('myvpn-server.txt', this.serverAccess)
      },
      saveFile: saveFileHandler,
      saveQrCode: function () {
        const qrCodeImage = document.getElementsByTagName('canvas')[0]
        qrCodeImage.toBlob((blob) => {
          let reader = new FileReader()
          reader.onload = () => {
            this.saveFile('myvpn-qrcode.png', reader.result)
          }
          reader.readAsBinaryString(blob);
        })
      }
    }
  }
</script>
