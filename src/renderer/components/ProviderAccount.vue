<template>
    <el-row v-loading.lock=processing>
        <div v-if="tokenInput">
            <el-input prefix-icon="el-icon-key" :placeholder="$t(`Insert the API key from your ${providerName} account`)" :value="token" @input="setToken" autofocus clearable></el-input>
        </div>
        <div v-else>
            <el-button type="info" v-if="token" icon="el-icon-connection" v-on:click="logout">{{ $t('Logout') }}</el-button>
            <el-button type="success" v-else icon="el-icon-connection" v-on:click="login">{{ $t(`Log in to the ${providerName} account`) }}</el-button>
        </div>
        <p>
            <el-alert v-if="configuredError !== '' && token !== ''" :title="$t(configuredError)" type="error" show-icon :closable=false />
        </p>
        <div>
            <el-link v-if="tokenInput" v-on:click="tokenInput = false">{{ $t('Connect via login and password') }}<i class="el-icon-user-solid el-icon--right"></i> </el-link>
            <el-link v-else v-on:click="tokenInput = true">{{ $t('Connect via API key') }}<i class="el-icon-key el-icon--right"></i> </el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link v-on:click.prevent="handleLinkTo(providerWebsite)">{{ $t('Go to website')}}<i class="el-icon-link el-icon--right"></i></el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link v-on:click.prevent="handleLinkTo(faqLink)">{{ $t('How to set up')}}<i class="el-icon-question el-icon--right"></i></el-link>
        </div>
    </el-row>
</template>

<script>
  const { shell } = require('electron')
  const { BrowserWindow } = require('electron').remote
  import { mapState } from 'vuex'
  import OAuth2Provider from "~/myvpn-electron-oauth/lib/oauth2"

  export default {
    props: ['providerKey', 'providerName', 'providerWebsite', 'faqLink', 'oauthConfig', 'oauthWindowWidth', 'oauthWindowHeight'],
    data () {
      return {
        tokenInput: false
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
      login () {
        const window = new BrowserWindow({
          width: this.oauthWindowWidth || 600,
          height: this.oauthWindowHeight || 540,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
          }
        })
        const provider = new OAuth2Provider(this.oauthConfig)
        provider.perform(window)
          .then(resp => {
            window.close()
            this.setToken((new URLSearchParams(resp)).get('access_token'))
          }, err => {
            window.close()
            this.$message({message: this.$root.$t('Please try again'), type: 'error'})
          })
      },
      logout () {
        this.setToken('')
      },
      handleLinkTo (url) {
        shell.openExternal(url)
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
