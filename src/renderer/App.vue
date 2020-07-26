<template>
  <div id="app" v-bind:style="{ 'background-image': 'url(' + staticPath + '/img/background.svg' + ')' }">
    <Header />
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
  import Header from "./components/Header";

  const isBrowser = process.browser
  let electron = null

  if (!isBrowser) {
    const { remote } = require('electron')
    electron = { remote }
  }

  export default {
    name: 'vpn',
    components: { Offline, Header },
    data () {
      return {
        staticPath: process.browser || process.env.NODE_ENV === 'development' ? 'static' :  __static,
      }
    },
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
    }
  }
</script>

<style>
@import "assets/css/app.scss";
</style>
