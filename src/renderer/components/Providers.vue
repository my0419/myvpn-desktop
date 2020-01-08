<template>
  <el-tabs :value="selectedProvider" @tab-click="handleChangeProvider" class="providers" type="border-card">
    <el-tab-pane v-for="provider in providers" :name="provider.name" :disabled="apikey.length > 0 && activeProvider() !== provider.name">
      <span slot="label">
        <img class="provider-choose-logo" :src="provider.logo" />
      </span>
      <ProviderAccount
              v-if="activeProvider() === provider.name"
              :provider-key="provider.name"
              :provider-name="provider.title"
              :provider-website="provider.website"
              :faq-link="provider.faq"
              :oauthConfig="provider.oauthConfig"
              :oauth-window-height="provider.oauthWindow.height"
              :oauth-window-width="provider.oauthWindow.width"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>
  .providers .el-tabs__item {
    height: 50px;
  }
  .providers .provider-choose-logo {
    height: 28px;
    position: relative;
    top: 6px;
  }
</style>

<style>
  .el-tabs__item.is-disabled {
    display: none;
  }
</style>

<script>
  import { mapState } from 'vuex'
  import { CRYPTOSERVERS_KEY } from '../../lib/providers'
  import ProviderAccount from './ProviderAccount'

  const providers = [{
    name: 'cryptoservers',
    title: 'CryptoServers',
    logo: 'static/img/providers/cryptoservers.svg',
    website: 'https://cryptoservers.net',
    faq: 'https://myvpn.run/faq/setup/cryptoservers',
    oauthConfig: {client_id: "173", redirect_uri: "http://localhost", scope: "*", authorize_url: "https://cryptoservers.net/oauth/authorize", response_type: "token" },
    oauthWindow: {width: 600, height: 540}
  }, {
    name: 'digitalocean',
    title: 'DigitalOcean',
    logo: 'static/img/providers/digitalocean.svg',
    website: 'https://www.digitalocean.com',
    faq: 'https://myvpn.run/faq/setup/digitalocean',
    oauthConfig: {client_id: "a018284aebda94528eb1fdb00e5f53803590f3dd050a1da64a9e549e2eb1c309", redirect_uri: "https://localhost", scope: "read write", authorize_url: "https://cloud.digitalocean.com/v1/oauth/authorize", response_type: "token" },
    oauthWindow: {width: 760, height: 705}
  }, {
    name: 'linode',
    title: 'Linode',
    logo: 'static/img/providers/linode.svg',
    website: 'https://www.linode.com',
    faq: 'https://myvpn.run/faq/setup/linode',
    oauthConfig: {client_id: "839b0a3d0ab64f6c8c2d", redirect_uri: "https://localhost", scope: "linodes:read_write,stackscripts:read_write", authorize_url: "https://login.linode.com/oauth/authorize", response_type: "token" },
    oauthWindow: {width: 600, height: 710}
  }]

  export default {
    components: {ProviderAccount},
    computed: mapState({
      selectedProvider: state => state.provider.name || CRYPTOSERVERS_KEY,
      apikey: state => state.provider.config.apikey || '',
    }),
    data () {
      return {
        activeTab: null,
        providers,
      }
    },
    methods: {
      activeProvider () {
        return this.activeTab || this.selectedProvider
      },
      handleChangeProvider (tab) {
        if (tab.paneName !== this.selectedProvider) {
          this.$store.dispatch('configureProvider', {name: tab.paneName, config: {apikey: ''}}) // clear
        }
        this.activeTab = tab.paneName
      }
    }
  }
</script>
