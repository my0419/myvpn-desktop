<template>
  <el-tabs :value="selectedProvider" @tab-click="handleChangeProvider" class="providers" type="border-card">
    <el-tab-pane v-for="provider in providers" :key="provider.name" type="card" :name="provider.name" :disabled="apikey.length > 0 && activeProvider() !== provider.name">
      <span slot="label">
        <img class="provider-choose-logo" :src="staticPath + provider.logo" v-if="provider.logo" />
        <span class="provider-choose-title" v-if="provider.name === 'custom'">{{ $t(provider.title) }}</span>
      </span>
      <div v-if="activeProvider() === provider.name">
        <ProviderSelf v-if="provider.name === 'custom'" />
        <ProviderAccount v-else
                :provider-key="provider.name"
                :provider-name="provider.title"
                :provider-website="provider.website"
                :faq-link="provider.faq"
                :oauthConfig="provider.oauthConfig || null"
                :oauth-window-height="(provider.oauthWindow) ? provider.oauthWindow.height : null"
                :oauth-window-width="(provider.oauthWindow) ? provider.oauthWindow.width : null"
                :via-key="provider.viaKey || false"
        />
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>
  .providers .provider-choose-title {
    font-weight: 600;
    font-size: 1.1rem;
    color: #3f3f3f;
  }
  .providers .provider-choose-logo {
    height: 23px;
    position: relative;
    top: 6px;
  }
</style>
<style>
  .providers {
    box-shadow: none !important;
  }
  .el-tabs__item {
    height: 50px;
    padding: 0 10px !important;
    border-right: 1px solid #ddd !important;
  }
  .el-tabs__item:last-child {
    border-right: none !important;
  }
  .el-tabs__nav {
    height: 42px;
  }
</style>

<script>
  import { mapState } from 'vuex'
  import { CRYPTOSERVERS_KEY } from '../../lib/providers'
  import ProviderAccount from './ProviderAccount'
  import providers from '../../config/providers'
  import ProviderSelf from "./ProviderSelf";

  export default {
    components: {ProviderSelf, ProviderAccount},
    computed: mapState({
      selectedProvider: state => state.provider.name || CRYPTOSERVERS_KEY,
      apikey: state => state.provider.config.apikey || '',
    }),
    data () {
      return {
        staticPath: process.browser || process.env.NODE_ENV === 'development' ? 'static' :  __static,
        activeTab: null,
        providers: providers[process.browser ? 'web' : 'desktop'],
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
