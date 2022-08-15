import request from '@/utils/request.js'
// 获取当前用户的频道列表
export const getUserChannelAPI = () => {
  return request.get('/v1_0/user/channels')
}
// 获取频道下的文章列表
// 根据频道 Id 请求频道下的文章列表数据
export const getArtListAPI = (id, time) => {
  return request.get('/v1_0/articles', {
    params: {
      channel_id: id, // 频道的 Id
      timestamp: time // 时间戳
    }
  })
}

// 将文章设置为不感兴趣
// 将文章设置为不感兴趣（形参 id 是文章的 id）
export const dislikeArticleAPI = (id) => {
  return request.post('/v1_0/article/dislikes', {
    target: id
  })
}
// 举报文章的 API
export const reportArticleAPI = (target, type) => {
  return request.post('/v1_0/article/reports', {
    target, // 文章的 Id
    type // 举报的类型
  })
}
