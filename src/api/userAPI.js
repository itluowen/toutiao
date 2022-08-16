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

// 请求用户基本信息的 API
// 在 vuex 中请求用户的基本信息
// 在 vuex 模块的 actions 节点下，定义名为 initUserInfo 的 Action 方法：
export const getUserInfoAPI = () => {
  return request.get('/v1_0/user')
}

// 请求用户简介信息的 API
export const getUserProfileAPI = () => {
  return request.get('/v1_0/user/profile')
}

// 修改用户简介信息的 API（形参中的 obj 是对象格式的简介信息）
// 可能的格式有以下两种：
// { name: 'xxx' } 或 { birthday: '2012-12-12' }
export const updateUserProfileAPI = (obj) => {
  return request.patch('/v1_0/user/profile', obj)
}

// 实现修改头像的功能
// 在 userAPI.js 模块中，定义名为 updateUserAvatarAPI 的接口，用来更新用户的头像：

// 修改头像的 API（形参中的 fd 表示 FormData 格式的表单数据）
export const updateUserAvatarAPI = (fd) => {
  return request.patch('/v1_0/user/photo', fd)
}
