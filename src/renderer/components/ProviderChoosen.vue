<template>
  <div>
    <el-tabs v-if="mq.type !== 'xs'" v-model="activeTab" :value="selectedProvider" @tab-click="handleChangeProvider" class="providers" type="border-card">
      <el-tab-pane v-for="provider in providers" :key="provider.name" type="card" :name="provider.name" :disabled="apikey.length > 0 && activeProvider() !== provider.name">
        <span slot="label">
          <img class="provider-choose-logo" :src="staticPath + provider.logo" v-if="provider.logo" />
          <span class="provider-choose-title" v-if="provider.name === 'custom'">{{ $t(provider.title) }}</span>
        </span>
        <div v-if="activeProvider() === provider.name" class="provider-choose-content">
          <slot v-bind:provider="provider" name="providerItem"></slot>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div v-else>
      <el-select v-model="activeTab" placeholder="Choose a provider" :disabled="apikey.length > 0">
          <el-option v-for="provider in providers" :key="provider.name" :label="provider.title" :value="provider.name">
            <div class="provider-choose-option">
              <img class="provider-choose-logo" :src="staticPath + provider.logo" v-if="provider.logo" />
              <span class="provider-choose-title" v-if="provider.name === 'custom'">{{ $t(provider.title) }}</span>
            </div>
          </el-option>
      </el-select>
      <div v-for="provider in providers" :key="provider.name">
        <div v-if="activeProvider() === provider.name" class="provider-choose-content">
          <slot v-bind:provider="provider" name="providerItem"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '~mixins';
  .providers .provider-choose-title {
    font-weight: 400;
    font-size: 1rem;
    color: #ffffff;
    opacity: 0.8;
  }
  .providers .provider-choose-logo {
    height: 21px;
    position: relative;
    top: 6px;
    opacity: 0.8;
  }
  .provider-choose-option {
    display: flex;
    align-items: center;
    height: 100%;
  }
  .provider-choose-option .provider-choose-logo {
    display: flex;
    flex: 0 0 auto;
    margin-right: 6px;
    height: 20px;
    object-fit: contain;
  }
  .provider-choose-content {
    @include mqMAX($XS) {
      margin-top: 20px;
    }
  }
</style>
<style>
  .providers {
    box-shadow: none !important;
  }
  .el-tabs__item.is-disabled {
    display: none;
  }
  .el-tabs__item {
    height: 50px;
    padding: 0 10px !important;
    border-right: 1px solid #ddd;
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
  import { useBreakpoints } from '../../lib/utils'
  import { CRYPTOSERVERS_KEY } from '../../lib/providers'
  import providers from '../../config/providers'

  const default_provider = providers[process.browser ? 'web' : 'desktop'][0].name

   export default {
    computed: mapState({
      selectedProvider: state => state.provider.name || CRYPTOSERVERS_KEY,
      apikey: state => state.provider.config.apikey || '',
    }),
    created() {
      window.addEventListener('resize', this.handleResize)
      this.handleResize()
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize)
    },
    data () {
      return {
        staticPath: process.browser || process.env.NODE_ENV === 'development' ? 'static' :  __static,
        activeTab: default_provider,
        providers: providers[process.browser ? 'web' : 'desktop'],
        mq: null,
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
      },
      handleResize() {
        this.mq = useBreakpoints()
      }
    }
  }
</script>