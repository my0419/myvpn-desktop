<template>
    <div class="app-page step-access">
        <div class="selectable m-top">
            <el-row class="step-access__nav">
                <el-button type="success" size="mini"  v-on:click="handleMainPage" icon="el-icon-arrow-left">{{ $t('Go Back') }}</el-button>
                <el-button v-if="selectedProvider !== 'custom'" type="danger" size="mini" v-on:click="deleteServer" icon="el-icon-delete">{{ $t('Delete server') }}</el-button>
            </el-row>

            <el-tabs class="step-access__tabs" data-tabs="access-tabs" v-model="activeTab">
                <el-tab-pane :label="$t('Configuration')" name="1">
                    <div v-if="connectionType === 'l2tp'">
                        <el-form class="step-access__form step-access__form-vpn">
                            <el-form-item :label="$root.$t('Type of connection')">
                              IPSec/L2TP
                            </el-form-item>
                            <el-form-item :label="$root.$t('IP address')">
                               <Copied :text="serverIp" />
                            </el-form-item>
                            <el-form-item :label="$root.$t('Login')">
                                <Copied :text="accountUsername" />
                            </el-form-item>
                            <el-form-item :label="$root.$t('Password')">
                                <Copied :text="accountPassword" />
                            </el-form-item>
                            <el-form-item :label="$root.$t('PSK key')">
                               <Copied :text="accountPskKey" />
                            </el-form-item>
                        </el-form>
                    </div>
                    <div v-if="connectionType === 'ikev2'">
                        <el-form class="step-access__form step-access__form-vpn">
                            <el-form-item :label="$root.$t('Type of connection')">
                                IKEv2/IPSec
                            </el-form-item>
                            <el-form-item :label="$root.$t('IP address')">
                               <Copied :text="serverIp" />
                            </el-form-item>
                            <el-form-item :label="$root.$t('Certificate')">
                              <el-input type="textarea" :value="clientConfig[0]" :readonly="true"/>

                              <el-form-item>
                                <el-button size="small"  type="primary" icon="el-icon-document-copy" v-clipboard="clientConfig[0]" v-clipboard:success="clipboardSuccessHandler">{{ $t('Copy Certificate') }}</el-button>
                                <el-button size="small"  type="primary" icon="el-icon-download" v-on:click="() => saveClientConfig('myvpn-ikev2-cert.pem')">{{ $t('Save Certificate') }}</el-button>
                              </el-form-item>
                            </el-form-item>
                          <el-form-item :label="$root.$t('Accounts')">
                            <div v-if="accounts.length > 1">
                              <el-input type="textarea" :value="accountsText" :readonly="true"/>
                              <Copied :text="accountsText" :hiddenText="true" />
                            </div>
                            <div v-else>
                              <el-form-item :label="$root.$t('Username')">
                                <Copied :text="accountUsername" />
                              </el-form-item>
                              <el-form-item :label="$root.$t('Password')">
                                <Copied :text="accountPassword" />
                              </el-form-item>
                            </div>
                          </el-form-item>
                        </el-form>
                    </div>
                    <div v-if="connectionType === 'openconnect'">
                        <el-form class="step-access__form step-access__form-vpn">
                            <el-form-item :label="$root.$t('Type of connection')">
                                IKEv2/IPSec
                            </el-form-item>
                            <el-form-item :label="$root.$t('IP address')">
                               <Copied :text="serverIp" />
                            </el-form-item>
                            <el-form-item :label="$root.$t('OpenConnect Gateway')">
                               <Copied :text="`https://${serverIp}:4443`" />
                            </el-form-item>
                          <el-form-item :label="$root.$t('Accounts')">
                            <div v-if="accounts.length > 1">
                              <el-input type="textarea" :value="accountsText" :readonly="true"/>
                              <Copied :text="accountsText" :hiddenText="true" />
                            </div>
                            <div v-else>
                              <el-form-item :label="$root.$t('Username')">
                                <Copied :text="accountUsername" />
                              </el-form-item>
                              <el-form-item :label="$root.$t('Password')">
                                <Copied :text="accountPassword" />
                              </el-form-item>
                            </div>
                          </el-form-item>
                        </el-form>
                    </div>
                    <div v-if="connectionType === 'pptp'">
                        <el-form class="step-access__form step-access__form-vpn">
                            <el-form-item :label="$root.$t('Type of connection')">
                                PPTP
                            </el-form-item>
                            <el-form-item :label="$root.$t('IP address')">
                               <Copied :text="serverIp" />
                            </el-form-item>
                            <el-form-item :label="$root.$t('Login')">
                               <Copied :text="accountUsername" />
                            </el-form-item>
                            <el-form-item :label="$root.$t('Password')">
                               <Copied :text="accountPassword" />
                            </el-form-item>
                            <el-form-item>
                               <u class="text-warning">{{ $t('Be sure to enable MPPE encryption') }}</u>
                            </el-form-item>
                      </el-form>
                    </div>
                    <div v-if="connectionType === 'socks5'">
                        <el-form class="step-access__form step-access__form-vpn">
                            <el-form-item :label="$root.$t('Type of connection')">
                              SOCKS5
                            </el-form-item>
                            <el-form-item :label="$root.$t('IP address')">
                                <Copied :text="serverIp" />
                            </el-form-item>
                            <el-form-item :label="$root.$t('Port')">
                                <Copied :text="customPort" />
                            </el-form-item>
                        </el-form>
                    </div>
                    <div v-if="connectionType === 'openvpn'">
                        <el-form class="step-access__form step-access__form-vpn">
                            <el-form-item :label="$root.$t('Type of connection')">
                                OpenVPN
                            </el-form-item>
                            <el-form-item :label="$root.$t('IP address')">
                               <Copied :text="serverIp" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" v-on:click="saveOpenvpn" icon="el-icon-tickets">{{ $t('Save ovpn file') }}</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div v-if="connectionType === 'wireguard'">
                        <el-row :gutter="20" class="step-access__form-wrapper">
                            <el-col :span="14" class="step-access__form-col">
                                <el-form class="step-access__form step-access__form-vpn">
                                    <el-form-item :label="$root.$t('Type of connection')">
                                        WireGuard
                                    </el-form-item>
                                    <el-form-item :label="$root.$t('Accounts')">
                                        {{ accounts.length }}
                                    </el-form-item>
                                    <el-form-item :label="$root.$t('IP address')">
                                        <Copied :text="serverIp" />
                                    </el-form-item>
                                    <el-form-item :label="$root.$t('Config')">
                                        <el-select v-model="selectedAccountNumber" placeholder="Account">
                                            <el-option
                                                v-for="(_, index) in accounts"
                                                :key="`account_wg_${index}`"
                                                :label="`${$root.$t('Account')} #${index+1}`"
                                                :value="index">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item class="m-top">
                                        <el-button type="primary" class="btn-group-item btn-group-item--fill" v-on:click="saveWireguard" icon="el-icon-download">{{ $t('Save Configuration') }}</el-button>
                                    </el-form-item>
                                </el-form>

                            </el-col>
                            <el-col :span="10" class="step-access__form-col">
                              <h2>{{ $t('Connect using QR Code') }}</h2>
                              <qrcode-vue class="m-top qr-code-container" :value="selectedAccountConfig" :size="300" level="L"></qrcode-vue>
                              <div class="m-top">
                                <a href="#" v-on:click.prevent="saveQrCode">
                                  <i class="el-icon-download"></i> {{ $t('Save QR Code') }}
                                </a>
                              </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div v-if="connectionType === 'shadowsocks'">
                        <el-row :gutter="20" class="step-access__form-wrapper">
                            <el-col :span="14" class="step-access__form-col">
                              <el-form class="step-access__form step-access__form-vpn">
                                <el-form-item :label="$root.$t('Type of connection')">
                                  ShadowSocks
                                </el-form-item>
                                <el-form-item :label="$root.$t('Accounts')">
                                  {{ accounts.length }}
                                </el-form-item>
                                <el-form-item :label="$root.$t('IP address')">
                                  <Copied :text="serverIp" />
                                </el-form-item>
                                <el-form-item :label="$root.$t('Local Port')">
                                  <Copied text="1080" />
                                </el-form-item>
                                <el-form-item :label="$root.$t('Encryption method')">
                                  <Copied text="chacha20-ietf-poly1305" />
                                </el-form-item>
                                <el-form-item :label="$root.$t('Config')">
                                  <el-select v-model="selectedAccountNumber" placeholder="Account" style="width: 240px">
                                    <el-option
                                        v-for="(_, index) in accounts"
                                        :key="`account_ss_${index}`"
                                        :label="`${$root.$t('Account')} #${index+1}`"
                                        :value="index">
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                                <el-form-item :label="$root.$t('Password')">
                                  <Copied :text="accountPassword" />
                                </el-form-item>
                                <el-form-item :label="$root.$t('Port')">
                                  <Copied :text="shadowsocksPort" />
                                </el-form-item>
                                <el-form-item :label="$root.$t('Connection')">
                                  <el-input :value="shadowsocksConnect" :readonly="true" style="width: 240px"/>
                                  <div>
                                    <Copied :text="shadowsocksConnect" :hiddenText="true" />
                                  </div>
                                </el-form-item>
                                <el-form-item>
                                  <el-button class="btn-group-item btn-group-item--fill" type="primary" icon="el-icon-download" v-on:click="saveShadowsocks">{{ $t('Save Configuration') }}</el-button>
                                </el-form-item>
                              </el-form>
                            </el-col>
                            <el-col :span="10" class="step-access__form-col">
                              <h2>{{ $t('Connect using QR Code') }}</h2>
                              <qrcode-vue :value="shadowsocksConnect" :size="300" class="qr-code-container" level="L"></qrcode-vue>
                              <div class="m-top">
                                <a href="#" v-on:click.prevent="saveQrCode">
                                  <i class="el-icon-download"></i> {{ $t('Save QR Code') }}
                                </a>
                              </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div v-if="connectionType === 'owncloud' || connectionType === 'nextcloud'">
                      <el-form class="step-access__form step-access__form-vpn">
                        <el-form-item :label="$root.$t('Type')">
                          {{ connectionType }}
                        </el-form-item>
                        <el-form-item :label="$root.$t('Address')">
                          <Copied :text="`https://${clientConfig[0] || 'invalid'}`" />
                          <p class="note-block">
                            <strong>{{ $t('Let\'s Encrypt certificate') }}:</strong><br />
                            {{ $t('The certificate will be issued automatically within 2-3 minutes. At the first visit may be invalid, refresh the page.')}}
                          </p>
                          <p class="note-block">
                            <strong>{{ $t('Domain Binding') }}:</strong><br />
                            {{ $t('If you use own domain name you need to follow 2 simple steps.')}}
                            <ol class="no-margin">
                              <li>{{ $t('Go to your domain control panel and create a DNS record referencing the IP') }} <strong>{{ serverIp }}</strong></li>
                              <li>{{ $t('Go to this domain and configure the cloud by creating an administrator account.')}}</li>
                            </ol>
                          </p>
                        </el-form-item>
                        <el-form-item :label="$root.$t('IP')">
                          <Copied :text="serverIp" />
                        </el-form-item>
                      </el-form>
                    </div>
                    <div v-if="connectionType === 'torbridge'">
                      <el-form class="step-access__form step-access__form-vpn">
                        <el-form-item :label="$root.$t('Type')">
                          TorBridge
                        </el-form-item>
                        <el-form-item :label="$root.$t('Bridge Address')">
                          <el-input type="textarea" :value="clientConfig" :readonly="true"/>
                          <Copied :text="clientConfig" :hiddenText="true" />
                          <div class="note-block">
                            {{ $t('Note') }}:<br />
                            {{ $t('Open tor browser, then click "Tor Network Settings". Under the "Bridges" section, select the checkbox "Use a bridge", choose "Provide a bridge" and enter bridge address on a separate line.')}}
                          </div>
                        </el-form-item>
                        <el-form-item :label="$root.$t('IP')">
                          <Copied :text="serverIp" />
                        </el-form-item>
                        <el-form-item :label="$root.$t('OR Port')">
                          <Copied :text="torbridge.orPort" />
                        </el-form-item>
                        <el-form-item :label="$root.$t('PT Port')">
                          <Copied :text="torbridge.ptPort" />
                        </el-form-item>
                        <el-form-item :label="$root.$t('Nickname')">
                          <Copied :text="torbridge.nickname" />
                        </el-form-item>
                        <el-form-item :label="$root.$t('Email')">
                          <Copied :text="torbridge.email" />
                        </el-form-item>
                      </el-form>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="$t('My Server')" name="2" v-if="selectedProvider !== 'custom'">
                    <el-form class="step-access__form step-access__form-server">
                        <el-form-item>
                          <el-button size="small"  type="primary" icon="el-icon-document-copy" v-clipboard="serverAccess" v-clipboard:success="clipboardSuccessHandler">{{ $t('Copy all accesses') }}</el-button>
                          <el-button size="small"  type="primary" icon="el-icon-download" v-on:click="saveServerAccess">{{ $t('Save all accesses') }}</el-button>
                        </el-form-item>
                        <el-form-item :label="$root.$t('IP address')">
                            <Copied :text="serverIp" />
                        </el-form-item>
                        <el-form-item :label="$root.$t('User')">
                            <Copied text="root" />
                        </el-form-item>
                        <el-form-item v-if="serverPassword" :label="$root.$t('Password')">
                            <Copied :text="serverPassword" />
                        </el-form-item>
                        <el-form-item :label="$root.$t('Private Key')">
                          <el-input  type="textarea" :value="keypairPrivate" :readonly="true"/>
                          <Copied :text="keypairPrivate" :hiddenText="true" />
                          <span class="v-line"></span>
                          <a href="#" v-on:click.prevent="savePrivateKey">
                            <i class="el-icon-download"></i> {{ $t('Save') }}
                          </a>
                        </el-form-item>
                        <el-form-item :label="$root.$t('Connection')">
                          <el-input :value="`$ chmod 600 myvpn.key && ssh -i myvpn.key root@${serverIp}`" :readonly="true"/>
                          <Copied :text="`chmod 600 myvpn.key && ssh -i myvpn.key root@${serverIp}`" :hiddenText="true" />
                        </el-form-item>
                        <el-form-item :label="$root.$t('RSA Key')">
                          <el-input  type="textarea" :value="keypairSshPublic" :readonly="true"/>
                          <Copied :text="keypairSshPublic" :hiddenText="true" />
                          <span class="v-line"></span>
                          <a href="#" v-on:click.prevent="saveRsaKey">
                            <i class="el-icon-download"></i> {{ $t('Save') }}
                          </a>
                        </el-form-item>
                        <el-form-item :label="$root.$t('Public Key')">
                          <el-input  type="textarea" :value="keypairPublic" :readonly="true"/>
                          <Copied :text="keypairPublic" :hiddenText="true" />
                          <span class="v-line"></span>
                          <a href="#" v-on:click.prevent="savePublicKey">
                            <i class="el-icon-download"></i> {{ $t('Save') }}
                          </a>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<style lang="scss" >
@import 'sass-mixins';

.step-access {
  & &__tabs[data-tabs=access-tabs] {
    @include mq-max($XS) {
      margin-top: 15px;
    }
  }
  .selectable {
    @include mq-max($XS) {
      margin-top: 0;
    }
  }
}
.step-access__nav {
  z-index: 4;
  align-items: center;
  width: 500px;
  text-align: right;
  position: absolute;
  right: 20px;
  top: 40px;
  @include mq-max($XS) {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    top: 0;
    left: 0;
    right: initial;
    position: relative;
    width: initial;
    text-align: left;
  }
  .el-button--mini {
    @include mq-max($XS) {
      height: 36px;
      &:first-child {
        width: 100px;
      }
      &:last-child {
        margin-left: auto;
        width: calc(100% - 110px);
      }
    }
  }
}
.v-line {
  display: inline-block;
  border-right: 1px solid #3b3b3b;
  height: 21px;
  position: relative;
  top: 6px;
}
.qr-code-container {
    padding: 15px;
    max-width: 300px;
    background-color: #fff;
    text-align: center;
  }
.step-access__form {
  &-wrapper {
    @include mq-max($XS) {
      display: flex;
      flex-direction: column;
    }
  }
  &-col {
    @include mq-max($XS) {
      width: 100%;
      &:not(:first-child) {
        margin-top: 20px;
      }
    }
  }
  color: #fbfbfb;
  &-server {
    @include mq-max($XS) {
      margin-left: 0;
      .el-form-item {
        display: flex;
        flex-direction: column;
        &:not(:first-child):not(:last-child)::after {
          content: '';
          @include hr();
        }
      }
      .el-button {
        margin-right: 0;
        width: 100%;
        height: 36px;
      }
      .el-button +.el-button {
        margin-top: 15px;
        margin-right: 0;
        margin-left: 0;
      }
    }
  }
  &-vpn {
    .el-form-item {
      @include mq-max($XS) {
        display: flex;
        flex-direction: column;
        &:not(:last-child)::after {
          content: '';
          @include hr();
        }
      }
    }
    .el-form-item__content {
      margin-left: 160px;
      @include mq-max($XS) {
        margin-left: 0;
      }
    }
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .text-copy-wrap {
    margin-top: 0;
  }
}
</style>

<style scoped>
  h3 {
    text-transform: none;
  }
  .copied-section {
      margin-top: 10px;
  }
  .step-access__tabs {
      margin-top: -15px;
  }
</style>

<script>
  import { mapState } from 'vuex'
  import QrcodeVue from 'qrcode.vue'
  import Copied from './Copied'

  const fs = require('fs')
  const isElectron = process.env.IS_ELECTRON

  let electron = null

  if (isElectron) {
    const remote = require('@electron/remote')
    electron = { remote }
  }

  function renderMessage(message, type, options) {
    return this.$message({message: this.$root.$t(message), type, ...options, showClose: true})
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
    const blob = new Blob([fileData], {type: 'text/*'})
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename
    link.click()
  }

  function saveFileHandler(filename, fileData) {
    if (isElectron) {
      const openSaveDialog = electron.remote.dialog.showSaveDialog({defaultPath: filename})

      openSaveDialog.then(({ filePath, canceled }) => {
        if (!canceled) {
          fs.writeFile(filePath, fileData, 'binary', (err) => {
            err !== null ? displayErrorMessage.call(this, err) : displaySuccessfulMessage.call(this)
          })
        }
      })
    } else {
      try {
        saveFileFromBrowser.call(this, filename, fileData)
      } catch(error) {
        displayErrorMessage.call(this, error)
      }
    }
  }

  export default {
    components: {Copied, QrcodeVue},
    data() {
      return {
        activeTab: '1',
        selectedAccountNumber: 0,
      }
    },
    computed: {
      selectedAccountConfig: {
        get () {
          return this.$store.state.account.clientConfig[this.selectedAccountNumber] || `Error. No config for account #${this.selectedAccountNumber+1}`
        }
      },
      customPort: {
        get () {
          return this.$store.state.setting.customPort
        }
      },
      torbridge: {
        get () {
          return this.$store.state.setting.torbridge
        }
      },
      accountsText: {
        get () {
          return this.accounts.map((v) => `Username: ${v.username} Password: ${v.password}`).join('\n')
        }
      },
      accountUsername: {
        get () {
          return this.$store.state.account.accounts[this.selectedAccountNumber].username || 'N/A'
        }
      },
      accountPassword: {
        get () {
          return this.$store.state.account.accounts[this.selectedAccountNumber].password || 'N/A'
        }
      },
      shadowsocksPort: {
        get () {
          return 8381 + this.selectedAccountNumber
        }
      },
      shadowsocksConnect: {
        get () {
          return `ss://${btoa(`chacha20-ietf-poly1305:${this.accountPassword}@${this.$store.state.server.ipv4}:${this.shadowsocksPort}`)}`
        }
      },
      ...mapState({
      selectedProvider: state => state.provider.name,
      configuredSuccess: state => state.provider.configuredSuccess,
      connectionType: state => state.type.selected,
      serverName: state => state.server.name,
      serverSlug: state => state.server.slug,
      serverIp: state => state.server.ipv4 || '0.0.0.0',
      serverPassword: state => state.server.password,
      keypairPrivate: state => state.keypair.private,
      keypairPublic: state => state.keypair.public,
      keypairSshPublic: state => state.keypair.sshPublic,
      accounts: state => state.account.accounts,
      accountPskKey: state => state.account.pskKey,
      clientConfig: state => state.account.clientConfig,
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
    })
  },
    mounted: function () {
      if (!this.configuredSuccess) {
        this.$router.push({ name: 'main' })
      }
    },
    methods: {
      clipboardSuccessHandler ({ value, event }) {
        this.$message({message: this.$root.$t('Copied!'), type: 'success', duration: 800, showClose: true})
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
        this.saveFile(`myvpn-${this.serverName}.ovpn`, this.selectedAccountConfig)
      },
      saveWireguard: function () {
        this.saveFile('wireguard.conf', this.selectedAccountConfig)
      },
      saveShadowsocks: function () {
        this.saveFile('shadowsocks-client.json', this.selectedAccountConfig)
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
      saveClientConfig: function (filename) {
        this.saveFile(filename, this.clientConfig[0])
      },
      saveFile: saveFileHandler,
      saveQrCode: function () {
        const qrCodeImage = document.getElementsByTagName('canvas')[0]
        qrCodeImage.toBlob((blob) => {
          let reader = new FileReader()
          reader.onload = () => {
            this.saveFile('myvpn-qrcode.png', reader.result)
          }
          reader.readAsBinaryString(blob)
        })
      }
    },
    beforeRouteLeave(to, from, next) {
      if (from.name === 'access' && to.name === 'processing') {
        return next({ name: 'main' })
      } else {
        next()
      }
    }
  }
</script>
