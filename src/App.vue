<template>
  <div id="app" :data-target="target" class="root-app">
    <Header />
    <v-offline>
      <div slot="offline">
        <el-alert :title="$t('Connect to the network!')" type="error" effect="dark">{{
          $t('To work with the application you need to connect to the Internet.')
        }}</el-alert>
      </div>
    </v-offline>
    <router-view></router-view>
    <PWAPopup
      :icon="imgPath + 'logo-small.png'"
      :text="$t('Add to home screen this app?')"
    />
    <PWAInstruction :manual="manual" />
  </div>
</template>

<script>
import Header from './components/Header'
import PWAPopup from './components/PWAPopup'
import PWAInstruction from './components/PWAInstruction'
import launcherServiceWorker from './launcherServiceWorker'
import manuals from '@/lib/manuals'
import { getBrowserName } from '@/lib/utils'

const isWeb = JSON.parse(process.env.VUE_APP_WEB || 'false')
const isElectron = process.env.IS_ELECTRON
let electron = null

if (isElectron) {
  const remote = require('@electron/remote')
  electron = { remote }
}

launcherServiceWorker(!isElectron, document)

export default {
  name: 'vpn',
  components: { Header, PWAPopup, PWAInstruction },
  data() {
    return {
      target: isWeb ? 'web' : 'any',
      imgPath: `${process.env.BASE_URL}/img/`,
      manual: manuals[getBrowserName()] || manuals['Other'],
    }
  },
  created: function () {
    const menuElements = [
      { label: this.$root.$t('Copy'), role: 'copy' },
      { label: this.$root.$t('Paste'), role: 'paste' },
    ]
    window.addEventListener(
      'contextmenu',
      e => {
        if (isElectron) {
          const { Menu, getCurrentWindow } = electron.remote
          Menu.buildFromTemplate(menuElements).popup(getCurrentWindow())
          e.preventDefault()
        }
      },
      false,
    )
  },
}
</script>
Footer
