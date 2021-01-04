import Vue from 'vue'
import html2canvas from 'html2canvas'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

Vue.prototype.$html2canvas = html2canvas

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
