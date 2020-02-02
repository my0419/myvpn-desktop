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
              :oauthConfig="provider.oauthConfig || null"
              :oauth-window-height="(provider.oauthWindow) ? provider.oauthWindow.height : null"
              :oauth-window-width="(provider.oauthWindow) ? provider.oauthWindow.width : null"
              :via-key="provider.viaKey || false"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>
  .providers .el-tabs__item {
    height: 50px;
  }
  .providers .provider-choose-logo {
    height: 24px;
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
  import providers from '../../config/providers'

  export default {
    components: {ProviderAccount},
    computed: mapState({
      selectedProvider: state => state.provider.name || CRYPTOSERVERS_KEY,
      apikey: state => state.provider.config.apikey || '',
    }),
    data () {
      return {
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
