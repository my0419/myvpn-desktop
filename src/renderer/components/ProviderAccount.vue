<template>
    <el-row v-loading.lock=processing>
        <div v-if="tokenInput">
            <el-input prefix-icon="el-icon-key" :placeholder="$t(`Insert the API key from your ${providerName} account`)" :value="token" @input="setToken" autofocus clearable></el-input>
            <el-button class="m-top" type="primary" v-if="token && configuredSuccess" icon="el-icon-receiving" v-on:click="goToDroplets">{{ $t('Servers') }}</el-button>
        </div>
        <div v-else>
            <el-button type="primary" v-if="token" icon="el-icon-receiving" v-on:click="goToDroplets">{{ $t('Servers') }}</el-button>
            <el-button type="info" v-if="token" icon="el-icon-connection" v-on:click="logout">{{ $t('Logout') }}</el-button>
            <el-button type="success" :name="providerName" v-else icon="el-icon-connection" v-on:click="login">{{ $t(`Log in to the ${providerName} account`) }}</el-button>
        </div>
        <p>
            <el-alert v-if="configuredError !== '' && token !== ''" :title="$t(configuredError)" type="error" show-icon :closable=false />
        </p>
        <div>
            <el-link v-if="tokenInput && !viaKey" v-on:click="tokenInput = false">{{ $t('Connect via login and password') }}<i class="el-icon-user-solid el-icon--right"></i> </el-link>
            <el-link v-if="!tokenInput" v-on:click="tokenInput = true">{{ $t('Connect via API key') }}<i class="el-icon-key el-icon--right"></i> </el-link>
            <el-divider v-if="!viaKey" direction="vertical"></el-divider>
            <el-link v-on:click.prevent="handleLinkTo(providerWebsite)">{{ $t('Go to website')}}<i class="el-icon-link el-icon--right"></i></el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link v-on:click.prevent="handleLinkTo(faqLink)">{{ $t('How to set up')}}<i class="el-icon-question el-icon--right"></i></el-link>
        </div>
    </el-row>
</template>

<script>
  import { mapState } from 'vuex'
  import providers from '../../config/providers'
  import { redirectTo, localStorageService } from '../../lib/utils'
  import OAuth2Provider from 'myvpn-electron-oauth/lib/oauth2'

  const isBrowser = process.browser
  let electron = null
  if (!isBrowser) {
    const { shell, remote } = require('electron')
    electron = { shell, remote }
  }
  const redirectToUrl = (url) =>
    isBrowser ? redirectTo(url) : electron.shell.openExternal(url)
  const saveProviderKey = (value) =>
    localStorageService.set('my_vpn_provider_key', value)
  const removeProviderKey = () =>
    localStorageService.remove('my_vpn_provider_key')
  export default {
    props: ['providerKey', 'providerName', 'providerWebsite', 'faqLink', 'oauthConfig', 'oauthWindowWidth', 'oauthWindowHeight', 'viaKey'],
    data () {
      return {
        tokenInput: false
      }
    },
    mounted () {
      if (this.oauthConfig === null && this.viaKey) {
        this.tokenInput = true
      }
    },
    computed: mapState({
      processing: state => state.provider.processing,
      configuredError: state => state.provider.configuredError,
      configuredSuccess: state => state.provider.configuredSuccess,
      token: state => state.provider.config.apikey,
    }),
    methods: {
      setToken (value) {
        this.$store.dispatch('updateConfig', {apikey: value})
        this.$store.dispatch('configureProvider', {name: this.providerKey, config: {apikey: value}}) // attach client
      },
      login (e) {
        isBrowser ? this.loginOnSiteProvider(e.currentTarget.name) : this.createLoginWindow()
      },
      logout () {
        this.setToken('')
        if (isBrowser) {
          removeProviderKey()
        }
      },
      handleLinkTo (url) {
        redirectToUrl(url)
      },
      goToDroplets: function () {
        this.$router.push({ name: 'droplets' })
      },
      loginOnSiteProvider(providerTitle) {
        const {
          name,
          oauthConfig
        } = providers.web.reduce((cfg, provider) => ({
          ...cfg,
          ...(provider.title === providerTitle ? provider : {})
        }), {})
        const {
          client_id,
          redirect_uri,
          scope,
          authorize_url,
          response_type
        } = oauthConfig
        const baseURL = `${authorize_url}?`
        const uri = `redirect_uri=${redirect_uri}&client_id=${client_id}&response_type=${response_type}&scope=${scope}`
        const encoded = baseURL + encodeURI(uri)
        saveProviderKey(name)
        redirectTo(encoded, false)
      },
      createLoginWindow() {
        const { BrowserWindow, session } = electron.remote
        const provider = new OAuth2Provider(this.oauthConfig)
        let window = new BrowserWindow({
          width: this.oauthWindowWidth || 600,
          height: this.oauthWindowHeight || 540,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
          }})
        provider.perform(window)
          .then(resp => {
            session.defaultSession.clearStorageData()
            this.setToken((new URLSearchParams(resp)).get('access_token'))
            window.close()
          }, err => {
            this.$message({message: this.$root.$t('Please try again'), type: 'error'})
            window.close()
          })
      }
    },
    watch: {
      configuredSuccess: function (val) {
        if (val) {
          this.$message({message: this.$root.$t('Successful connection to the account'), type: 'success'})
        }
      },
    }
  }
</script>
