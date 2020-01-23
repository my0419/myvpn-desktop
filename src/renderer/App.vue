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

  const isBrowser = process.browser
  let electron = null

  if (!isBrowser) {
    const { remote } = require('electron')
    electron = { remote }
  }

  export default {
    name: 'vpn',
    created: function () {      
      const menuElements = [
        { label: this.$root.$t('Copy'), role: 'copy' },
        { label: this.$root.$t('Paste'), role: 'paste' }
      ]
      window.addEventListener('contextmenu', (e) => {
        if (!isBrowser) {
          const { Menu, getCurrentWindow } = electron.remote
          Menu.buildFromTemplate(menuElements).popup(getCurrentWindow())
          e.preventDefault()          
        }
      }, false)
    },
    components: {Offline}
  }
</script>

<style>
@import "assets/css/app.scss";
</style>
