import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vat from 'vant'
import 'vant/lib/index.less'
import 'amfe-flexible'

Vue.use(Vat)

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
