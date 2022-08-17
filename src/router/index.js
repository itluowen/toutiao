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

export default router
