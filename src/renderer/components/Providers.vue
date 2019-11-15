<template>
  <el-tabs :value="selectedProvider" class="providers" type="border-card">
    <el-tab-pane name="cryptoservers">
      <span slot="label">
        <img class="provider-choose-logo" src="static/img/providers/cryptoservers.svg" />
      </span>
      <ProviderAccountCryptoServers />
    </el-tab-pane>
    <el-tab-pane name="digitalocean">
      <span slot="label">
        <img class="provider-choose-logo" src="static/img/providers/digitalocean.svg" />
      </span>
      <ProviderAccountDigitalOcean />
    </el-tab-pane>
    <el-tab-pane name="linode">
      <span slot="label">
        <img class="provider-choose-logo" src="static/img/providers/linode.svg" />
      </span>
      <ProviderAccountLinode />
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
  import ProviderAccountDigitalOcean from './ProviderAccountDigitalOcean'
  import ProviderAccountCryptoServers from './ProviderAccountCryptoServers'
  import ProviderAccountLinode from './ProviderAccountLinode'

  export default {
    components: {ProviderAccountLinode, ProviderAccountCryptoServers, ProviderAccountDigitalOcean},
    computed: mapState({
      selectedProvider: state => state.provider.name || CRYPTOSERVERS_KEY,
    }),
    mounted () {

    },
    methods: {

    }
  }
</script>
