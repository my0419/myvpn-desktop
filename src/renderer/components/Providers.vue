<template>
  <el-tabs :value="selectedProvider" @tab-click="handleChangeProvider" class="providers" type="border-card">
    <el-tab-pane name="cryptoservers">
      <span slot="label">
        <img class="provider-choose-logo" src="static/img/providers/cryptoservers.svg" />
      </span>
      <ProviderAccount
          v-if="activeProvider() === 'cryptoservers'"
          provider-key="cryptoservers"
          provider-name="CryptoServers"
          provider-website="https://cryptoservers.net"
          faq-link="https://myvpn.run/faq/setup/cryptoservers"
          :oauthConfig='{client_id: "173", redirect_uri: "http://localhost", scope: "*", authorize_url: "https://cryptoservers.net/oauth/authorize", response_type: "token" }'
      />
    </el-tab-pane>
    <el-tab-pane name="digitalocean">
      <span slot="label">
        <img class="provider-choose-logo" src="static/img/providers/digitalocean.svg" />
      </span>
      <ProviderAccount
              v-if="activeProvider() === 'digitalocean'"
              provider-key="digitalocean"
              provider-name="DigitalOcean"
              provider-website="https://www.digitalocean.com"
              faq-link="https://myvpn.run/faq/setup/vpn"
              :oauth-window-height="760"
              :oauth-window-width="705"
              :oauthConfig='{client_id: "a018284aebda94528eb1fdb00e5f53803590f3dd050a1da64a9e549e2eb1c309", redirect_uri: "https://localhost", scope: "read write", authorize_url: "https://cloud.digitalocean.com/v1/oauth/authorize", response_type: "token" }'
      />
    </el-tab-pane>
    <el-tab-pane name="linode">
      <span slot="label">
        <img class="provider-choose-logo" src="static/img/providers/linode.svg" />
      </span>
      <ProviderAccount
              v-if="activeProvider() === 'linode'"
              provider-key="linode"
              provider-name="Linode"
              provider-website="https://www.linode.com"
              faq-link="https://myvpn.run/faq/setup/linode"
              :oauth-window-height="710"
              :oauthConfig='{client_id: "839b0a3d0ab64f6c8c2d", redirect_uri: "https://localhost", scope: "linodes:read_write", authorize_url: "https://login.linode.com/oauth/authorize", response_type: "token" }'
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
  #tab-cryptoservers {
    border-right: 1px solid #dadada !important;
  }
</style>

<script>
  import { mapState } from 'vuex'
  import { CRYPTOSERVERS_KEY } from '../../lib/providers'
  import ProviderAccount from './ProviderAccount'

  export default {
    components: {ProviderAccount},
    computed: mapState({
      selectedProvider: state => state.provider.name || CRYPTOSERVERS_KEY,
    }),
    data () {
      return {
        activeTab: null,
      }
    },
    methods: {
      activeProvider () {
        return this.activeTab || this.selectedProvider
      },
      handleChangeProvider (tab) {
        this.$store.dispatch('updateConfig', {apikey: ''})
        this.$store.dispatch('configureProvider', {name: tab.paneName, config: {apikey: ''}}) // clear
        this.activeTab = tab.paneName
      }
    }
  }
</script>
