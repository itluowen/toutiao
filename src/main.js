import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vat from 'vant'
import store from './store'
import 'vant/lib/index.less'
import 'amfe-flexible'

Vue.use(Vat)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: (h) => h(App)
}).$mount('#app')
