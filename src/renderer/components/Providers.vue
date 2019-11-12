<template>
  <el-tabs :value="selectedProvider" type="border-card">
    <el-tab-pane name="digitalocean">

      <span slot="label">
        <img class="provider-choose-logo" src="static/img/providers/digitalocean.svg" />
      </span>
      <h3>2. {{ $t('Connect your account') }}</h3>
      <ProviderAccountDigitalOcean />
    </el-tab-pane>
    <el-tab-pane name="cryptoservers">
      <span slot="label">
        <img class="provider-choose-logo" src="static/img/providers/cryptoservers.svg" />
      </span>
      <h3>2. {{ $t('Connect your account') }}</h3>
      <ProviderAccountCryptoServers />
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>
  .provider-choose-logo {
    height: 24px;
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
  import ProviderAccountDigitalOcean from './ProviderAccountDigitalOcean'
  import { mapState } from 'vuex'
  import ProviderAccountCryptoServers from './ProviderAccountCryptoServers'

  export default {
    components: {ProviderAccountCryptoServers, ProviderAccountDigitalOcean},
    computed: mapState({
      selectedProvider: state => state.provider.name || 'digitalocean',
    }),
    mounted () {

    },
    methods: {

    }
  }
</script>
