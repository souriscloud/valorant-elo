import Vue from 'vue'
import html2canvas from 'html2canvas'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import i18n from './plugins/i18n'

Vue.config.productionTip = false

Vue.prototype.$html2canvas = html2canvas

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
