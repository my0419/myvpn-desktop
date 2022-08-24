import Vue, { PluginObject } from 'vue'

import VueI18n from 'vue-i18n'
import axios from 'axios'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/reset.css'
import './registerServiceWorker'

import App from './App.vue'
import router from './router'
import store from './store'
import translate from './i18n'
import Clipboard from 'v-clipboard'
import VOffline from 'v-offline'

Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueI18n)
Vue.use(Clipboard)
Vue.use(VOffline as unknown as PluginObject<typeof VOffline>)

const i18n = new VueI18n({
  locale: navigator.language
    ? navigator.language.split('-')[0] === 'ru'
      ? 'ru'
      : 'en'
    : 'en',
  messages: translate,
})

new Vue({
  components: { App },
  i18n,
  router,
  store,
  template: '<App/>',
}).$mount('#app')
