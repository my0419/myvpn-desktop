<template>
  <div>
    <el-container>
      <el-aside width="80px">
        <el-menu class="left-menu-vertical" height="100vh" :collapse="true">
          <el-menu-item  @click="handleGoToWebsite" index="0">
            <img class="menu-icon-logo" src="static/img/logo-small.png" />
          </el-menu-item>
          <el-menu-item @click="handleDroplets" index="1" :disabled="!configuredSuccess || dropletsLoading">
            <el-badge class="menu-badge" :value="dropletsCount" type="primary" v-if="dropletsExists">
                <img class="menu-icon" src="static//img/icons/server.svg" />
                <span slot="title">{{ $t('Servers') }}</span>
            </el-badge>
            <img class="menu-icon" src="static/img/icons/server.svg" v-if="dropletsExists === false" />
            <span slot="title" v-if="dropletsExists === false">{{ $t('Servers') }}</span>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <img class="menu-icon menu-icon-gray" src="static/img/icons/english.svg" />
              <span slot="title">{{ $t('Settings') }}</span>
            </template>
            <el-menu-item-group>
              <span slot="title">{{ $t('Language') }}</span>
              <el-menu-item index="1-1" @click="changeLang('ru')">Русский</el-menu-item>
              <el-menu-item index="1-2" @click="changeLang('en')">English</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item-group class="app-version" :title="`v${appVersion}`" />
        </el-menu>
      </el-aside>
      <el-container>
        <div class="app-page">
          <h3>1. {{ $t('Choose a hosting provider and connect your account') }}</h3>
          <Providers />
          <h3>2. {{ $t('Select a server region')}}</h3>
          <FormRegions />
          <h3>3. {{ $t('Select the connection protocol') }}</h3>
          <FormTypes />

          <div class="m-top">
            <el-button type="primary" :disabled="!configuredSuccess" v-on:click="handleProcessing" icon="el-icon-magic-stick">{{ $t('Create a VPN server and get access') }}</el-button>
          </div>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import FormRegions from './FormRegions'
  import FormTypes from './FormTypes'
  import Copied from './Copied'
  import Providers from './Providers'
  import { redirectTo, localStorageService } from '../../lib/utils'

  const isBrowser = process.browser
  let electron = null

  if (!isBrowser) {
    const { app, remote, shell } = require('electron')
    electron = { app, remote, shell }
  }

  const getVersion = () => 
    isBrowser ? '.Online' : electron.remote.app.getVersion()

  const redirectToSite = (url) =>
    isBrowser ? redirectTo(url) : shell.openExternal(url)

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

  function openUpdateDialog(lastVersion, currentVersion) {
    const message = `${this.$root.$t('Your version')} v${currentVersion}, ${this.$root.$t('latest version')} <strong>v${lastVersion}</strong>`
    const options = {
      title: this.$root.$t('There is a new version available!'),
      dangerouslyUseHTMLString: true,
      confirmButtonText: this.$root.$t('Download the latest version'),
      cancelButtonText: this.$root.$t('Continue'),
      type: 'warning'
    }
    return this.$confirm(message, 'Warning', options)
  }

  function renderMessage(message, type, options) {
    return this.$message({message: this.$root.$t(message), type, ...options})
  }

  function checkUpdateApp() {
    require('axios').get('https://myvpn.run/api/v1/application')
      .then(res => {
        const lastVersion = res.data.desktop.latestVersion
        const currentVersion = electron.remote.app.getVersion()
        if (lastVersion !== currentVersion) {
          openUpdateDialog.call(this, lastVersion, currentVersion)
            .then(_ => {
              redirectToLinkUpdate()
              closeApp()
            })            
            .catch(_ => this.renderMessage('We recommend that you do not ignore updates.', 'info'))
        }
      })
      .catch(error => {        
        console.log('Skip application update check.')
      });
  }

  export default {
    components: {Providers, Copied, FormTypes, FormRegions},
    computed: mapState({
      configuredSuccess: state => state.provider.configuredSuccess,
      dropletsExists: state => state.droplet.isEmpty === false,
      dropletsCount: state => state.droplet.list.length,
      dropletsLoading: state => state.droplet.loading,
      token: state => state.provider.config.apikey,
      appVersion: getVersion
    }),
    mounted () {
      checkUpdateApp()
      if (isBrowser) {
        const access_token = initProviderParams()
        const provider_key = getProviderKey()
        if (access_token && provider_key) {
          try {            
            this.setToken(access_token, provider_key)
            this.handleProcessing()
          } catch (error) {
            console.log(error.message)
            this.renderMessage('Authorization Error', 'error')
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
      handleDroplets: function () {
        this.$router.push({ name: 'droplets' })
      },
      handleGoToWebsite: function () {
        redirectToUrl('https://myvpn.run')               
      },
      changeLang: function (code) {
        this.$i18n.locale = code
      }
    }
  }
</script>