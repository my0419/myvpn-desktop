<template>
  <div id="app" class="root-app">
    <Header />
    <Offline>
      <div slot="offline">
        <el-alert :title="$t('Connect to the network!')" type="error" effect="dark">{{ $t('To work with the application you need to connect to the Internet.') }}</el-alert>
      </div>
    </Offline>
    <router-view></router-view>
    <PWAPopup
      :icon="'static/img/logo-small.png'"
      :text="$t('Add to home screen this app?')"
    />
    <PWAInstruction
      :manual="manual"
    />
  </div>
</template>

<script>
  import Offline from 'v-offline'
  import Header from './components/Header'
  import PWAPopup from './components/PWAPopup'
  import PWAInstruction from './components/PWAInstruction'
  import swLauncher from '../../src/lib/sw-launcher'
  import manuals from '../lib/manuals'
  import { getBrowserName } from '../lib/utils'

  const isBrowser = process.browser
  let electron = null

  if (!isBrowser) {
    const { remote } = require('electron')
    electron = { remote }
  }

  swLauncher(isBrowser, document)

  const checkBrowsers = [
    'Safari', 'Firefox', 'Opera'
  ]

  export default {
    name: 'vpn',
    components: { Offline, Header, PWAPopup, PWAInstruction },
    data () {
      return {
        staticPath: process.browser || process.env.NODE_ENV === 'development' ? 'static' :  __static,
        manual: manuals[getBrowserName()] || manuals['Other']
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
