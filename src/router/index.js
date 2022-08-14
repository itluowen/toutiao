import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginGo from '@/views/Login/LoginGo.vue'

Vue.use(VueRouter)

const routes = [
  // 带有 name 名称的路由规则，叫做“命名路由”
  { path: '/login', component: LoginGo, name: 'LoginGo' }
]

const router = new VueRouter({
  routes
})

export default router
