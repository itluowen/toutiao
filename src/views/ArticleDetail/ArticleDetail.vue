<template>
  <div class="Articlede-container" v-if="article !== null">
    <!-- 通过路由渲染文章详情组件 -->
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />

    <!-- 文章信息区域 -->
    <!-- 组件刚加载时，如果网速较慢，则 data 中的 article 等于 null。为了防止 DOM 闪烁的问题，可以为文章信息区域的 div 应用 v-if 指令： -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{article.title}}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="article.aut_name" :label="article.pubdate | dateFormat">
        <template #icon>
          <!-- 头像 -->
          <img :src="article.aut_photo" alt="" class="avatar">
        </template>
        <template #default>
          <div>
            <!-- 是否关注了作者 -->
            <!-- 实现关注功能 -->
            <van-button type="info" size="mini" v-if="article.is_followed" @click="setUnfollow">已关注</van-button>
            <van-button icon="plus" type="info" v-else size="mini" plain @click="setFollow">关注</van-button>
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="article.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button icon="good-job" type="danger" size="small" v-if="article.attitude === 1" @click="setDislike">已点赞</van-button>
        <van-button icon="good-job-o" type="danger" v-else plain size="small" @click="setLike">点赞</van-button>
      </div>
    </div>
    <!-- 文章的评论组件 -->
    <art-cmt :art-id="id"></art-cmt>
  </div>
</template>

<script>
/* eslint-disable */
// 按需导入 API 接口
import { getArticleDetailAPI, followUserAPI, unfollowUserAPI, addLikeAPI, delLikeAPI } from '@/api/articleAPI.js'
// 导入文章的评论组件
import ArtCmt from '@/components/ArtCmt/ArtCmt.vue'
// 基于 highlight.js 美化详情页的代码片段
import hljs from 'highlight.js'

export default {
  name: 'article-detail',
  // props 中的 id 是文章的 id（已经调用了大数的 .toString() 方法）
  props: ['id'],
  watch: {
    id() {
      // 只要 id 值发生了变化，就清空旧的文章信息
      this.article = null
      // 并重新获取文章的详情数据
      this.initArticle()
    }
  },
  created() {
    this.initArticle()
  },
  data() {
    return {
      // 文章的信息对象
      article: null
    }
  },
  methods: {
    // 初始化文章的数据
    async initArticle() {
      const { data: res } = await getArticleDetailAPI(this.id)
      if (res.message === 'OK') {
        // 2. 转存数据
        this.article = res.data
      }
    },
    // 关注作者
    async setFollow() {
      const { data: res } = await followUserAPI(this.article.aut_id.toString())
      if (res.message === 'OK') {
        // 提示用户成功
        this.$toast.success('关注成功！')
        // 手动更改关注的状态
        this.article.is_followed = true
      }
    },
    // 取关作者
    async setUnfollow() {
      const res = await unfollowUserAPI(this.article.aut_id.toString())
      // 2. 判断响应的状态码
      if (res.status === 204) {
        // 2.1 提示用户
        this.$toast.success('取关成功')
        // 2.2 手动更改关注的状态
        this.article.is_followed = false
      }
      // console.log(res)
    },
    // 文章点赞
    async setLike() {
      const { data: res } = await addLikeAPI(this.id)
      if (res.message === 'OK') {
        // 提示用户
        this.$toast.success('点赞成功！')
        // 手动变更点赞的状态
        this.article.attitude = 1
        // console.log(res)
      }
    },
    // 取消点赞
    async setDislike() {
      const res = await delLikeAPI(this.id)
      // 提示用户
      if (res.status === 204) {
        this.$toast.success('取消点赞成功！')
        // 手动变更点赞的状态
        this.article.attitude = -1

        // console.log(res)
      }
    }
  },
  components: {
    ArtCmt
  },
  beforeRouteLeave(to, from, next) {
    from.meta.top = window.scrollY
    next()
  },
  // 1. 当组件的 DOM 更新完毕之后
  updated() {
    // 2. 判断是否有文章的内容
    if (this.article) {
      // 3. 对文章的内容进行高亮处理
      hljs.highlightAll()
    }
  }
}
</script>

<style lang="less" scoped>
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
</style>
