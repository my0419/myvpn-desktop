<template>
    <el-row v-loading.lock=processing>
        <el-input :placeholder="$t('Insert the API key from your Linode account')" :value="token" @input="setToken" autofocus clearable></el-input>
        <p>
            <el-alert v-if="configuredError !== '' && token !== ''" :title="$t(configuredError)" type="error" show-icon :closable=false />
        </p>
        <a v-show="true !== configuredSuccess" v-on:click.prevent="handleOpenDocs" target="_blank" href="#">{{ $t('Open the setup manual')}}</a>
    </el-row>
</template>

<script>
  const { shell } = require('electron')
  import { mapState } from 'vuex'
  import { LINODE_KEY } from '../../lib/providers'

  export default {
    computed: mapState({
      processing: state => state.provider.processing,
      configuredError: state => state.provider.configuredError,
      configuredSuccess: state => state.provider.configuredSuccess,
      token: state => state.provider.config.linodekey,
    }),
    methods: {
      setToken (value) {
        this.$store.dispatch('updateConfig', {linodekey: value})
        this.$store.dispatch('configureProvider', {name: LINODE_KEY, config: {linodekey: value}})
      },
      handleOpenDocs () {
        shell.openExternal('https://myvpn.run/faq/setup/linode')
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
