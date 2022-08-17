import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginGo from '@/views/Login/LoginGo.vue'
import MainCon from '@/views/Main/MainCon.vue'
import UserCon from '@/views/User/UserCon.vue'
import HomeCon from '@/views/Home/HomeCon.vue'
// 导入搜索组件：
import SearchCon from '@/views/Search/SearchCon.vue'
// 导入搜索结果页
import SearchResult from '@/views/SearchResult/SearchResult.vue'
// 导入文章详情组件
import ArticleDetail from '@/views/ArticleDetail/ArticleDetail.vue'
// 编辑个人资料
import UserEdit from '@/views/UserEdit/UserEdit.vue'
// 导入小思同学的组件页面
import ChatCon from '@/views//Chat/ChatCon.vue'
// vuex 访问有权限页面时判断是否登录
// 在导航守卫中，从 store 中获取 token 的值，并在用户访问有权限的页面时，判断 token 的值是否存在：
import store from '@/store/index.js'

Vue.use(VueRouter)

const routes = [
  // 带有 name 名称的路由规则，叫做“命名路由”
  { path: '/login', component: LoginGo, name: 'LoginGo' },
  // 搜索结果页
  {
    path: '/search/:kw',
    component: SearchResult,
    name: 'search-result',
    props: true
  },
  // 文章详情的路由规则
  {
    path: '/article/:id',
    component: ArticleDetail,
    name: 'article-detail',
    props: true
  },
  // 搜索组件的路由规则
  {
    path: '/search',
    component: SearchCon,
    name: 'SearchCon'
  },
  // 编辑用户资料的路由规则
  { path: '/user/edi', component: UserEdit, name: 'user-edit' },
  // 小思聊天的路由规则
  { path: '/chat', component: ChatCon, name: 'char-con' },
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

// 访问有权限页面时判断是否登录
// 在 /src/router/index.js 路由模块的头部导入 vuex 模块：

// 所有有权限页面的路径，都在这个数组之中
const pagePathArr = ['/user', '/user/edit']

// 2. 为路由的实例对象挂载全局前置守卫
router.beforeEach((to, from, next) => {
  if (pagePathArr.indexOf(to.path) !== -1) {
    // 2.1 访问的是有权限的页面，需要判断用户是否登录
    // 1. 从 store 中获取 token 的值
    //    注意：store.state.tokenInfo 要么是 {} 空对象，要么是包含 {token, refresh_token} 的对象
    const tokenStr = store.state.tokenInfo.tokenInfo
    if (tokenStr) {
      // 1.1 token 有值，已登录过（操作：直接放行）
      next()
    } else {
      // 1.2 token 不存在，没有登录（操作：强制跳转到登录页）
      // now：没有登录，强制跳转到登录页，并携带路由的 "query 查询参数"
      // 记录上次访问未遂的路由地址
      // 如果用户没有登录，要访问 /user 地址，则会强制跳转到 /login 登录页
      // 当用户登录成功之后，应该自动跳转到用户刚才访问未遂的路由地址，即：登录成功之后，跳转到 /user
      next(`/login?pre=${to.fullPath}`)
    }
  } else {
    // 2.2 访问的是没有权限的页面
    next()
  }
})

// 解决 vue-router 内部的报错的问题：
// 1. 将 VueRouter 本身提供的 $router.push 方法转存到常量中
const originalPush = VueRouter.prototype.push
// 2. 自定义 $router.push 方法，在内部调用原生的 originalPush 方法进行路由跳转；并通过 .catch 捕获错误
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  // 通过 .catch 捕获错误
  return originalPush.call(this, location).catch((err) => err)
}

export default router
