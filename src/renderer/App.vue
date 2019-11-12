<template>
  <div id="app">
    <!--<div class="logo">
      <img class="logo__image" src="/static/img/logo.svg" />
    </div>-->
    <Offline>
      <div slot="offline">
        <el-alert :title="$t('Connect to the network!')" type="error" effect="dark">{{ $t('To work with the application you need to connect to the Internet.') }}</el-alert>
      </div>
    </Offline>
    <router-view></router-view>
  </div>
</template>

<script>
  import Offline from 'v-offline'
  export default {
    name: 'vpn',
    created: function () {
      const { Menu } = require('electron').remote
      const menuElements = [
        { label: this.$root.$t('Copy'), role: 'copy' },
        { label: this.$root.$t('Paste'), role: 'paste' }
      ]
      window.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        const window = require('electron').remote.getCurrentWindow()
        Menu.buildFromTemplate(menuElements).popup(window)
      }, false)
    },
    components: {Offline}
  }
</script>

<style>
@import "assets/css/app.scss";
</style>
