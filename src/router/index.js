import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login/LoginGo.vue'

Vue.use(VueRouter)

const routes = [{ path: '/login', component: Login, name: 'login' }]

const router = new VueRouter({
  routes
})

export default router
