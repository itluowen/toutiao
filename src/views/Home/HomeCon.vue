<template>
  <div class="home-container">
    <!-- 头部区域 -->
    <van-nav-bar fixed>
      <!-- 左侧的插槽 -->
      <template #left>
        <img src="@/assets/toutiaolog.png" alt="logo" class="logo" />
      </template>
      <!-- 右侧的插槽 -->
      <template #right>
        <van-icon name="search" color="white" size="18" />
      </template>
    </van-nav-bar>

    <!-- 频道列表的标签页 -->
    <!-- //为 van-tabs 组件添加 sticky 属性，即可在页面纵向滚动时，实现频道列表的吸顶效果
    //offset-top 属性，即可设置吸顶的距离：
    //375 px = 10 rem
    1 px = 10/375 rem
    46 px = 460/375 rem
    46 px ≈ 1.22666667rem -->

    <van-tabs v-model="active" sticky offset-top="1.22666667rem">
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">{{item.name}}</van-tab>
    </van-tabs>

    <!-- 频道管理的小图标 -->
    <van-icon name="plus" size="16" class="plus" />

  </div>
</template>

<script>
import { getUserChannelAPI } from '@/api/homeAPI.js'
export default {
  name: 'HomeCon',
  data() {
    return {
      // 标签页激活项的索引
      active: 0,
      // 用户的频道列表数组
      userChannel: []
    }
  },
  // created 生命周期函数中，调用 initUserChannel 方法请求用户的频道列表数据
  created() {
    this.getUserChannelAPI()
  },
  methods: {
    async getUserChannelAPI() {
      const { data: res } = await getUserChannelAPI()
      // console.log(res)
      // 判断接口是否请求成功
      if (res.message === 'OK') {
        this.userChannel = res.data.channels
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 组件外层容器的样式
.home-container {
  padding-top: 46px;
  padding-bottom: 50px;
  // 频道管理小图标的定位
  .plus {
    position: fixed;
    top: 58px;
    right: 10px;
    z-index: 999;
  }
}
/deep/ .van-tabs__wrap {
  padding-right: 36px;
  background-color: white;
}
// logo 样式
.logo {
  height: 80%;
}
</style>
