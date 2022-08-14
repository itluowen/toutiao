import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 初始的 state 对象
let initState = {
  // token 的信息对象
  tokenInfo: {}
}

const satesStr = localStorage.getItem('state')

if (satesStr) {
  // alert('我有缓存')
  initState = JSON.parse(satesStr)
  // console.log(initState)
}
export default new Vuex.Store({
  // 用来存储 token 信息的对象，将来这个对象中会包含两个属性 { token, refresh_token }
  state: initState,
  getters: {},
  mutations: {
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
    saveStateToStorage(state) {
      localStorage.setItem('state', JSON.stringify(state))
    }
  },
  actions: {},
  modules: {}
})
