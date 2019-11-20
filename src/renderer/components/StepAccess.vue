<template>
    <div>
        <HeaderSteps :active="2" />
        <el-alert :title="$t('Save access to the VPN. When you exit, all data will be cleared.')" type="warning" show-icon></el-alert>

        <div class="app-page selectable">
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
                    <div v-if="connectionType === 'pptp'">
                        <h2>{{ $t('Type of connection') }}</h2>
                        <h3>PPTP</h3>

                        <h2>{{ $t('IP address') }}</h2>
                        <h3><Copied :text="serverIp" /></h3>

                        <h2>{{ $t('Login') }}</h2>
                        <h3><Copied :text="accountUsername" /></h3>

                        <h2>{{ $t('Password') }}</h2>
                        <h3><Copied :text="accountPassword" /></h3>
                        <u class="text-warning">{{ $t('Be sure to enable MPPE encryption') }}</u>
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
                                <qrcode-vue :value="wireguardConfig" :size="300" :level="M"></qrcode-vue>
                                <hr />
                            </el-col>
                        </el-row>
                    </div>
                    <hr />
                    <el-button type="success" v-on:click="handleMainPage" icon="el-icon-arrow-left">{{ $t('Go Back') }}</el-button>
                    <el-button type="danger" v-on:click="deleteServer" icon="el-icon-delete">{{ $t('Delete server') }}</el-button>
                </el-tab-pane>
                <el-tab-pane :label="$t('My Server')" name="2">
                    <h2>{{ $t('Protocol') }}</h2>
                    <h3>SSH</h3>

                    <h2>{{ $t('IP address') }}</h2>
                    <h3><Copied :text="serverIp" /></h3>

                    <h2>{{ $t('User') }}</h2>
                    <h3><Copied text="root" /></h3>

                    <div v-if="serverPassword">
                        <h2>{{ $t('Root password') }}</h2>
                        <h3><Copied :text="serverPassword" /></h3>
                    </div>

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

                    <h2>{{ $t('Private Key') }}</h2>
                    <el-input  type="textarea" :value="keypairPrivate" :readonly="true"/>
                    <Copied :text="keypairPrivate" :hiddenText="true" />
                    <div class="m-top">
                        <el-button type="primary" v-on:click="savePrivateKey" icon="el-icon-tickets">{{ $t('Save Private Key') }}</el-button>
                    </div>
                    <h2>{{ $t('Console') }}</h2>
                    <el-input :value="`chmod 600 myvpn-${serverName}-private.key && ssh -i myvpn-${serverName}-private.key root@${serverIp}`" :readonly="true"/>
                    <Copied :text="`chmod 600 myvpn-${serverName}-private.key && ssh -i myvpn-${serverName}-private.key root@${serverIp}`" :hiddenText="true" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import QrcodeVue from 'qrcode.vue'
  import HeaderSteps from './HeaderSteps'
  import Copied from './Copied'

  const {dialog} = require('electron').remote
  const fs = require('fs')

  export default {
    components: {Copied, HeaderSteps, QrcodeVue},
    data () {
      return {
        activeTab: '1'
      }
    },
    computed: mapState({
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
      accountOvpn: state => state.account.ovpn,
      wireguardConfig: state => state.account.wireguard
    }),
    mounted: function () {
      if (!this.configuredSuccess) {
        this.$router.push({ name: 'main' })
      }
    },
    methods: {
      handleMainPage: function () {
        this.$router.push({ name: 'main' })
      },
      deleteServer: function () {
        this.$store.dispatch('deleteServer', this.serverSlug)
        this.$message({message: this.$root.$t('Request to delete the server has been sent'), type: 'success'})
        this.$router.push({ name: 'main' })
      },
      saveOpenvpn: function () {
        this.saveFile(`myvpn-${this.serverName}.ovpn`, this.accountOvpn)
      },
      saveWireguard: function () {
        this.saveFile(`wireguard-${this.serverName}.conf`, this.wireguardConfig)
      },
      savePrivateKey: function () {
        this.saveFile(`myvpn-${this.serverName}-private.key`, this.keypairPrivate)
      },
      saveRsaKey: function () {
        this.saveFile(`myvpn-${this.serverName}-rsa.key`, this.keypairSshPublic)
      },
      savePublicKey: function () {
        this.saveFile(`myvpn-${this.serverName}-public.key`, this.keypairPublic)
      },
      saveFile: function (filename, fileData) {
        const savePath = dialog.showSaveDialog({defaultPath: filename})
        fs.writeFile(savePath, fileData, (err) => {
          if (err !== null) {
            console.log('save file error: ', err)
            this.$message({
              dangerouslyUseHTMLString: true,
              message: this.$root.$t('Failed to save the file'),
              type: 'error'
            })
          } else {
            this.$message({message: this.$root.$t('File saved'), type: 'success'})
          }
        })
      }
    }
  }
</script>
