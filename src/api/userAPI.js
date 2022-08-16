import request from '@/utils/request.js'

import axios from 'axios'

// 登录接口
export const loginAPI = (data) => {
  return request.post('/v1_0/authorizations', data)
}

// 换取 Token 的 API（形参中的 refreshToken 用来换取新 token）
// 4 调用换取 token 的 API
// 在 /src/utils/request.js 模块中，按需导入换取 token 的 API：

export const exchangeTokenAPI = (refreshToken) => {
  return axios({
    method: 'PUT',
    // 这里必须填写完整的请求 URL 地址
    url: 'http://www.liulongbin.top:8000/v1_0/authorizations',
    headers: {
      // 在请求头中携带 Authorization 身份认证字段
      Authorization: 'Bearer ' + refreshToken
    }
  })
}
