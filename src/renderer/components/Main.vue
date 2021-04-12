<template>
  <div class="app-page">
    <h3>{{ $t('Choose a hosting provider and connect your account') }}</h3>
    <Providers />
    <h3 v-if="selectedProvider !== 'custom'">{{ $t('Select a server region')}}</h3>
    <FormRegions v-if="selectedProvider !== 'custom'" />
    <h3>{{ $t('Select the connection protocol') }}</h3>
    <FormTypes />
    <ModalAdvancedSettings />
    <div class="m-top main-footer">
      <el-button class="btn-group-item btn-group-item--fill" type="primary" :disabled="!configuredSuccess" v-on:click="handleProcessing" icon="el-icon-magic-stick">
        <span v-if="selectedProvider !== 'custom'">{{ $t('Create a server and configure the VPN') }}</span>
        <span v-else>{{ $t('Connect to the server and configure the VPN') }}</span>
      </el-button>
      <el-button class="btn-group-item btn-group-item--fill" v-if="isDev" type="primary" v-on:click="handleDevelopmentAccess" icon="el-icon-brush">[Dev] Access Page</el-button>
      <el-button class="btn-group-item btn-group-item--fill" v-if="isDev" type="primary" v-on:click="handleDevelopmentStore" icon="el-icon-brush">[Dev] Reset Store</el-button>
    </div>
    <div class="app-version">
      {{ $t('Version')}}: {{ appVersion }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '~mixins';
  .main-footer {
    @include mqMAX($MD) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .el-button {
      @include mqMAX($MD) {
        &:not(:first-child) {
          margin-top: 20px;
          margin-left: 0;
        }
      }
    }
  }
</style>

<script>
  import { mapState } from 'vuex'
  import FormRegions from './FormRegions'
  import FormTypes from './FormTypes'
  import Copied from './Copied'
  import Providers from './Providers'
  import ModalAdvancedSettings from './ModalAdvancedSettings'
  import { localStorageService } from '../../lib/utils'
  import { CRYPTOSERVERS_KEY } from '../../lib/providers'

  const isBrowser = process.browser
  const isDev = process.env.NODE_ENV === 'development'

  let electron = null

  if (!isBrowser) {
    const { app, remote, shell } = require('electron')
    electron = { app, remote, shell }
  }

  const getVersion = () =>
    isBrowser ? '.Online' : electron.remote.app.getVersion()

  const redirectToLinkUpdate = () =>
    electron && electron.shell.openExternal('https://myvpn.run/#download')

  const getProviderKey = () =>
    localStorageService.get('my_vpn_provider_key')

  const closeApp = () =>
    setTimeout(function () {
      if (electron.remote.process.platform !== 'darwin') {
        electron.app.quit();
      }
    }, 500)

  function initProviderParams() {
    const hash = window.location.hash.replace(/(^#\/#|\/#|#)/mg, '')
    const params = new URLSearchParams(hash)
    const access_token = params.get('access_token')
    if (access_token) {
      return access_token
    }
  }

  export default {
    components: {Providers, Copied, FormTypes, FormRegions, ModalAdvancedSettings},
    computed: mapState({
      selectedProvider: state => state.provider.name || CRYPTOSERVERS_KEY,
      configuredSuccess: state => state.provider.configuredSuccess,
      token: state => state.provider.config.apikey,
      appVersion: getVersion
    }),
    data () {
      return {
        staticPath: process.browser || process.env.NODE_ENV === 'development' ? 'static' :  __static,
        isDev
      }
    },
    mounted () {
      require('axios').get('https://api.github.com/repos/my0419/myvpn-desktop/releases/latest')
        .then(res => {
          const lastVersion = res.data.name
          const currentVersion = electron.remote.app.getVersion()
          if (lastVersion !== currentVersion) {
            const message = `${this.$root.$t('Your version')} v${currentVersion}, ${this.$root.$t('latest version')} <strong>v${lastVersion}</strong>`
            const options = {
              title: this.$root.$t('There is a new version available!'),
              dangerouslyUseHTMLString: true,
              confirmButtonText: this.$root.$t('Download the latest version'),
              cancelButtonText: this.$root.$t('Continue'),
              type: 'warning'
            }
            this.$confirm(message, 'Warning', options).then(_ => {
              redirectToLinkUpdate()
              closeApp()
            })
              .catch(_ => {
                this.$message({message: this.$root.$t('We recommend that you do not ignore updates.'), type: 'info'})
              })
          }
        })
        .catch(error => {
          console.log('Skip application update check.', error)
        });

      if (isBrowser) {
        const access_token = initProviderParams()
        const provider_key = getProviderKey()
        if (access_token && provider_key) {
          try {
            this.setToken(access_token, provider_key)
            this.handleProcessing()
          } catch (error) {
            console.log(error.message)
            this.$message({message: this.$root.$t('Authorization Error'), type: 'error'})
          }
        }
      }
    },
    methods: {
      setToken (value, providerKey) {
        this.$store.dispatch('updateConfig', {apikey: value})
        this.$store.dispatch('configureProvider', {name: providerKey, config: {apikey: value}}) // attach client
      },
      handleProcessing: function () {
        this.$router.push({ name: 'processing' })
      },
      /* development debugging */
      handleDevelopmentStore: function () {
        /*const store = new require('electron-store')({ name: 'vuex' })
        store.clear()*/
      },
      handleDevelopmentAccess: function () {
        if (!isDev) {
          return false;
        }
        this.$store.dispatch('generatePersonalAccess', 5)
        this.$store.commit('PROVIDER_CONFIGURE_SUCCESS')
        // this.$store.dispatch('generateKeypair')

        this.$router.push({ name: 'access' })
      }
    }
  }
</script>