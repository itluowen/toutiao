import axios from 'axios'
// 调用 axios.create() 方法，创建 axios 的实例对象
const instance = axios.create({
  baseURL: 'http://www.liulongbin.top:8000' // 请求根路径
})

export default instance
