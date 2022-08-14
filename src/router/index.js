import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginGo from '@/views/Login/LoginGo.vue'
import MainCon from '@/views/Main/MainCon.vue'
import UserCon from '@/views/User/UserCon.vue'
import HomeCon from '@/views/Home/HomeCon.vue'

Vue.use(VueRouter)

const routes = [
  // 带有 name 名称的路由规则，叫做“命名路由”
  { path: '/login', component: LoginGo, name: 'LoginGo' },
  {
    // path 为"空字符串"的子路由规则，叫做"默认子路由"
    path: '/',
    component: MainCon,
    name: 'MainCon',
    children: [
      {
        path: '',
        component: HomeCon,
        name: 'HomeCon'
      },
      {
        path: 'user',
        component: UserCon,
        name: 'UserCon'
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
