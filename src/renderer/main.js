import Vue from 'vue'
import VueI18n from 'vue-i18n'
import axios from 'axios'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/reset.css'
import './assets/element-ui/theme-myvpn/index.scss'

import App from './App'
import router from './router'
import store from './store'
import translate from './../i18n'
import Clipboard from 'v-clipboard'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueI18n)
Vue.use(Clipboard)

const i18n = new VueI18n({
  locale: navigator.language ? (navigator.language.split('-')[0] === 'ru' ? 'ru' : 'en') : 'en',
  messages: translate
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  i18n,
  router,
  store,
  template: '<App/>'
}).$mount('#app')
