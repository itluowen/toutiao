// 调用 axios.create() 方法，创建 axios 的实例对象
import axios from 'axios'

// 从 vant 中按需导入 Toast 组件
import { Toast } from 'vant'

const instance = axios.create({
  baseURL: 'http://www.liulongbin.top:8000' // 请求根路径
})

// 基于 Vant 的 Toast 轻提示 组件，可以方便的展示 loading 效果

// 请求拦截器
// 注意：在我们的项目中，是基于 instance 实例来发起 ajax 请求的，因此一定要为 instance 实例绑定请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 展示 loading 效果
    alert('开始')
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

instance.interceptors.response.use(
  (response) => {
    // 隐藏 loading 效果
    alert('结束')
    Toast.clear()
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance
