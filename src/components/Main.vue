<template>
  <div class="app-page">
    <h3>{{ $t('Choose a hosting provider and connect your account') }}</h3>
    <Providers />
    <h3 v-if="selectedProvider !== 'custom'">{{ $t('Choose the server region') }}</h3>
    <FormRegions v-if="selectedProvider !== 'custom'" />
    <h3>{{ $t('Choose the software') }}</h3>
    <FormTypes />
    <ModalAdvancedSettings />
    <div class="m-top main-footer">
      <el-button
        class="btn-group-item btn-group-item--fill"
        type="primary"
        :disabled="!configuredSuccess"
        v-on:click="handleProcessing"
        icon="el-icon-magic-stick"
      >
        <span v-if="selectedProvider !== 'custom'">{{
          $t('Create and configure a server')
        }}</span>
        <span v-else>{{ $t('Connect to the server and configure the protocol') }}</span>
      </el-button>
      <el-button
        class="btn-group-item btn-group-item--fill"
        v-if="isDev"
        type="primary"
        v-on:click="handleDevelopmentAccess"
        icon="el-icon-brush"
        >Access Page</el-button
      >
      <el-button
        class="btn-group-item btn-group-item--fill"
        v-if="isDev"
        type="primary"
        v-on:click="handleDevelopmentStore"
        icon="el-icon-brush"
        >Reset Store</el-button
      >
    </div>
    <div v-if="version" class="app-version">{{ $t('Version') }}: {{ version }}</div>
  </div>
</template>

<style lang="scss" scoped>
@import 'sass-mixins';

.main-footer {
  @include mq-max($MD) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .el-button {
    @include mq-max($MD) {
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
import { localStorageService } from '@/lib/utils'
import { CRYPTOSERVERS_KEY } from '@/lib/providers'

const isElectron = process.env.IS_ELECTRON
const isDev = process.env.NODE_ENV === 'development'

let electron = null

if (isElectron) {
  const remote = require('@electron/remote')
  const app = remote.app
  electron = { app, remote, shell: remote.shell }
}

const getVersion = async () => {
  if (isElectron && electron.remote) {
    return electron.app.getVersion()
  } else {
    try {
      const appVesion = await cordova.getAppVersion.getVersionNumber()
      return appVesion ?? null
    } catch (error) {
      return '.Online'
    }
  }
}

const redirectToLinkUpdate = () =>
  electron && electron.shell.openExternal('https://myvpn.run/#download')

const getProviderKey = () => localStorageService.get('my_vpn_provider_key')

const closeApp = () =>
  setTimeout(function () {
    if (electron.remote.process.platform !== 'darwin' && electron.app) {
      electron.app.quit()
    }
  }, 500)

function initProviderParams(redirectHash) {
  const hash = redirectHash.replace(/(^#\/#|\/#|#)/gm, '')
  const params = new URLSearchParams(hash)
  const access_token = params.get('access_token')
  if (access_token) {
    return access_token
  }
}

let version = null
getVersion().then(currentVersion => {
  version = currentVersion
})

export default {
  components: { Providers, Copied, FormTypes, FormRegions, ModalAdvancedSettings },
  computed: mapState({
    selectedProvider: state => state.provider.name || CRYPTOSERVERS_KEY,
    configuredSuccess: state => state.provider.configuredSuccess,
    token: state => state.provider.config.apikey,
  }),
  data() {
    return {
      imgPath: `${process.env.BASE_URL}/img/`,
      isDev,
      version,
    }
  },
  mounted() {
    require('axios')
      .get('https://api.github.com/repos/my0419/myvpn-desktop/releases/latest')
      .then(res => {
        const lastVersion = res.data.name
        const currentVersion = electron.remote.app.getVersion()
        if (lastVersion !== currentVersion) {
          const message = `${this.$root.$t(
            'Your version',
          )} v${currentVersion}, ${this.$root.$t(
            'latest version',
          )} <strong>v${lastVersion}</strong>`
          const options = {
            title: this.$root.$t('There is a new version available!'),
            dangerouslyUseHTMLString: true,
            confirmButtonText: this.$root.$t('Download the latest version'),
            cancelButtonText: this.$root.$t('Continue'),
            type: 'warning',
          }
          this.$confirm(message, 'Warning', options)
            .then(_ => {
              redirectToLinkUpdate()
              closeApp()
            })
            .catch(_ => {
              this.$message({
                message: this.$root.$t('We recommend that you do not ignore updates.'),
                type: 'info',
                showClose: true,
              })
            })
        }
      })
      .catch(_ => {
        console.log('Skip application update check.')
      })

    const initWebOAuth2 = redirectHash => {
      const access_token = initProviderParams(redirectHash)
      const provider_key = getProviderKey()

      if (access_token && provider_key) {
        try {
          this.setToken(access_token, provider_key)
        } catch (error) {
          console.log(error.message)
          this.$message({
            message: this.$root.$t('Authorization Error'),
            type: 'error',
            showClose: true,
          })
        }
      }
    }

    if (!isElectron) {
      if (__IS_WEB_APP) {
        initWebOAuth2(window.location.hash)
      } else {
        const cordovaApp = {
          // Application Constructor
          initialize: function () {
            this.bindEvents()
          },
          // Bind Event Listeners
          bindEvents: function () {
            document.addEventListener('deviceready', this.onDeviceReady, false)
          },
          // deviceready Event Handler
          onDeviceReady: function () {
            universalLinks.subscribe('openMainPage', cordovaApp.onOpenMainPage)
          },
          // launchedAppFromLink Event Handler
          onOpenMainPage: function (eventData) {
            console.log('Did launch app from the link: ' + eventData.url)
            initWebOAuth2(eventData.url)
          },
        }

        cordovaApp.initialize()
      }
    }
  },
  methods: {
    setToken(value, providerKey) {
      this.$store.dispatch('updateConfig', { apikey: value })
      this.$store.dispatch('configureProvider', {
        name: providerKey,
        config: { apikey: value },
      }) // attach client
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
        return false
      }
      this.$store.dispatch('generatePersonalAccess', 5)
      this.$store.commit('PROVIDER_CONFIGURE_SUCCESS')
      // this.$store.dispatch('generateKeypair')

      this.$router.push({ name: 'access' })
    },
  },
}
</script>
