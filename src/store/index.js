import Vue from 'vue'
import Vuex from 'vuex'
// 按需导入 API 方法
import { getUserInfoAPI, getUserProfileAPI } from '@/api/userAPI.js'
Vue.use(Vuex)
// 初始的 state 对象
let initState = {
  // token 的信息对象
  tokenInfo: {},
  // 用户的基本信息
  userInfo: {},
  // 用户的简介信息
  userProfile: {}
}

// 在 new Vuex.Store() 之前，读取 localStorage 中本地存储的 state 字符串

const stateStr = localStorage.getItem('state')

if (stateStr) {
  // 加载本地的数据
  // alert('我有缓存啦')
  initState = JSON.parse(stateStr)
}

// 在 vuex 模块中声明如下的 state 数据节点，定义专门用来存储 token 信息的 tokenInfo 对象：
export default new Vuex.Store({
  state: initState,
  getters: {
    // 动态渲染用户头像
    // 用户头像的计算属性
    userAvatar(state) {
      // 默认的头像地址
      let imgSrc = 'https://img.yzcdn.cn/vant/cat.jpeg'

      // 如果用户信息对象中包含 photo 属性的值，则为 imgSrc 重新赋值
      if (state.userInfo.photo) {
        imgSrc = state.userInfo.photo
      }
      return imgSrc
    }
  },
  mutations: {
    // 在 mutations 节点下，定义名为 updateTokenInfo 的 Mutation 方法，专门用来更新 tokenInfo 的值：
    // 更新 tokenInfo 数据的方法
    updateTokenInfo(state, payload) {
      // 把提交过来的 payload 对象，作为 tokenInfo 的值
      state.tokenInfo = payload

      // 测试 state 中是否有数据
      // console.log(state)

      // 如果希望在 Mutation A 中调用 Mutation B，需要通过 this.commit() 方法来实现
      // this 表示当前的 new 出来的 store 实例对象
      this.commit('saveStateToStorage')
    },
    // 更新 userInfo 的方法
    updateUserInfo(state, payload) {
      // 1. 把用户信息转存到 state 中
      state.userInfo = payload
      // 2. 将最新的 state 对象持久化存储到本地
      this.commit('saveStateToStorage')
    },
    // 更新 userProfile 的方法
    updateUserProfile(state, payload) {
      state.userProfile = payload
      this.commit('saveStateToStorage')
    },
    // 清空 vuex 和本地的数据
    cleanState(state) {
      // 1. 清空 vuex 中的数据
      state.tokenInfo = {}
      state.userInfo = {}
      state.userProfile = {}
      // 2. 将清空后的 state 存储到本地
      this.commit('saveStateToStorage')
    },
    // 将 state 持久化存储到本地
    saveStateToStorage(state) {
      localStorage.setItem('state', JSON.stringify(state))
    }
  },
  actions: {
    // 初始化用户的基本信息
    async initUserInfo(ctx) {
      // 调用 API 接口
      const { data: res } = await getUserInfoAPI()
      if (res.message === 'OK') {
        // TODO：把数据转交给 Mutation 方法   ctx.commit('Mutation方法名')
        ctx.commit('updateUserInfo', res.data)
      }
    },
    // 初始化用户的简介信息
    async initUserProfile(ctx) {
      // 调用接口
      const { data: res } = await getUserProfileAPI()
      if (res.message === 'OK') {
        // TODO：把请求到的数据转交给 Mutation 方法   ctx.commit('Mutation方法名')
        ctx.commit('updateUserProfile', res.data)
      }
    }
  },
  modules: {}
})
