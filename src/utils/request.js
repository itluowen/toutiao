// 调用 axios.create() 方法，创建 axios 的实例对象
/* eslint-disable */
import axios from 'axios'

// 从 vant 中按需导入 Toast 组件
import { Toast } from 'vant'

// 按需导入换取 token 的 API
import { exchangeTokenAPI } from '@/api/userAPI.js'

// 导入 vuex 的模块

import store from '@/store'

// 导入路由模块

import router from '@/router/index.js'

const instance = axios.create({
  baseURL: 'http://www.liulongbin.top:8000' // 请求根路径
})

// 基于 Vant 的 Toast 轻提示 组件，可以方便的展示 loading 效果

// 请求拦截器
// 注意：在我们的项目中，是基于 instance 实例来发起 ajax 请求的，因此一定要为 instance 实例绑定请求拦截器
// 基于拦截器添加 token 认证
instance.interceptors.request.use(
  (config) => {
    // 1. 获取 token 值
    const tokenStr = store.state.tokenInfo.token
    // 2. 判断 tokenStr 的值是否为空
    if (tokenStr) {
      // 3. 添加身份认证字段
      config.headers.Authorization = `Bearer ${tokenStr}`
    }
    // 展示 loading 效果
    // alert('开始')
    Toast.loading({
      message: '加载中...', // 文本内容
      duration: 0 // 展示时长(ms)，值为 0 时，toast 不会消失
    })
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器（注意：响应拦截器也应该绑定给 instance 实例）
// 方案 1：强制跳转到登录页
//  在响应拦截器中监听 Token 过期的情况
instance.interceptors.response.use(
  (response) => {
    // 隐藏 loading 效果
    // alert('结束')
    Toast.clear()
    return response

    // TODO1：清空 vuex 和 localStorage 中的数据
    // TODO2：强制跳转到登录页，并通过路由的 query 查询参数，把当前用户访问未遂的路由地址带给登录页
  },
  async (error) => {
    // 在请求失败的时候，关闭 loading 提示效果
    Toast.clear()
    // return Promise.reject(error)
    // 如果有响应的结果，并且响应的状态码是 401，则证明 Token 过期了
    // if (error.response && error.response.status === 401) {
    //   console.log('token 过期啦')
    // TODO1：清空 vuex 和 localStorage 中的数据
    // 只需要调用 vuex 模块中提供的 cleanState 这个 Mutation 方法，即可清空 vuex 和 localStorage 中的数据
    // 在 response 响应拦截器中，只要监听到 token 过期，就立即调用 store 中名为 cleanState 的 Mutation 方法
    // store.commit('cleanState')
    // TODO2：强制跳转到登录页，并通过路由的 query 查询参数，把当前用户访问未遂的路由地址带给登录页
    // router.replace('/login?pre=' + router.currentRoute.fullPath)

    // }

    // 方案 2：无感知刷新 Token
    // 1. 从 vuex 中获取 tokenInfo 对象，格式为： { token, refresh_token }
    const tokenInfo = store.state.tokenInfo
    // 2. 判断是否为 token 过期
    if (error.response && error.response.status === 401) {
      // token 过期
      console.log('token过期啦')
      try {
        // 3.1 TODO: 发起请求，根据 refresh_token 重新请求一个有效的新 token

        // 在请求新 Token 时，不要基于 /src/utils/request.js 模块中的 instance 发起请求，
        // 因为 instance 发起请求时，默认携带的 Authorization 值为 tokenInfo.token 属性！！！

        const { data: res } = exchangeTokenAPI(tokenInfo.refresh_token)
        console.log(res)

        // 3.2 TODO: 更新 Store 中的 Token
        store.commit('updateTokenInfo', {
          token: res.data.token,
          refresh_token: tokenInfo.refresh_token
        })

        // 3.3 重新调用刚才“请求未遂”的接口
        // 3.3.1 如果在响应拦截器中 return 一个新的 Promise 异步请求，则会把这次请求的结果，当作上次请求的返回值
        return instance(error.config)
      } catch {
        //  token 和 refresh_token 都失效了
        // 4.1 清空 vuex 和 localStorage
        store.commit('cleanState')
        // 4.2 强制跳转到登录页
        router.replace('/login?pre' + router.currentRoute.fullPath)
      }
    }
    return Promise.reject(error)
  }
)

export default instance
