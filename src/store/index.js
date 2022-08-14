import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 初始的 state 对象
let initState = {
  // token 的信息对象
  tokenInfo: {}
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
  getters: {},
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
    // 将 state 持久化存储到本地
    saveStateToStorage(state) {
      localStorage.setItem('state', JSON.stringify(state))
    }
  },
  actions: {},
  modules: {}
})
