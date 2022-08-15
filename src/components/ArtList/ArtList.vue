<template>
  <div class="artlist-container">
    <!-- ArtList.vue 组件的模板结构中，在 <van-list> 之外包裹实现下拉刷新的 <van-pull-refresh> 组件 -->
    <!-- 组件绑定 :immediate-check="false" 属性，即可防止首次加载时触发 load 事件 -->
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :disabled="finished">
      <van-list v-model="loading" :finished="finished" :immediate-check="false" finished-text="没有更多了" @load="onLoad">
        <ArtItem v-for="item in artlist" :article="item" :key="item.art_id" @remove-article="removeArticle"></ArtItem>
      </van-list>
    </van-pull-refresh>

  </div>
</template>

<script>
// 按需导入 API 接口
import { getArtListAPI } from '@/api/homeAPI'
// 在 ArtList.vue 组件中导入、注册、并使用 ArtItem.vue 组件：
import ArtItem from '@/components/ArtItem/ArtItem.vue'
export default {
  // 大驼峰命名法：每个单词的首字母大写
  name: 'ArtList',
  props: {
    channelId: {
      type: Number,
      required: true // 必填
    }
  },
  data() {
    return {
      artlist: [],
      timestamp: new Date(),
      // loading 表示是否正在进行上拉加载的请求
      //   每当触发 List 组件的上拉加载更多时，List 组件会自动把 loading 设为 true
      //   每当下一页的数据请求回来以后，需要程序员手动的把 loading 设为 false，
      //   否则：再次触发上拉加载更多时，不会发起请求！！
      loading: false,

      // finished 表示所有数据是否加载完毕
      //    false 表示还有下一页的数据
      //    true  表示所有数据都已加载完毕
      finished: false,
      // 是否正在进行下拉刷新的请求
      isLoading: false
    }
  },
  created() {
    this.initArtList()
  },
  methods: {
    // 初始化文章的列表数据
    async initArtList(isRefresh) {
      // 请求 API 接口
      const { data: res } = await getArtListAPI(this.channelId, this.timestamp)
      // console.log(res)
      if (res.message === 'OK') {
        // 为时间戳重新赋值
        this.timestamp = res.data.pre_timestamp
        if (isRefresh) {
          // 1. 下拉加载更多时，应该是“旧数据”在后，“新数据”在前
          this.artlist = [...res.data.results, ...this.artlist]
          // 2. 重置 isLoading 为 false
          this.isLoading = false
        } else {
          // 1. 上拉加载更多时，应该是“旧数据”在前，“新数据”在后
          this.artlist = [...this.artlist, ...res.data.results]
          // 2. 重置 loading 为 false
          this.loading = false
        }

        // 3. 判断所有的数据是否已加载完毕
        if (res.data.pre_timestamp === null) {
          this.finished = true
          // alert('已经没有了')
        }
      }
    },

    // 从文章列表中移除指定 id 的文章
    removeArticle(id) {
      // 对原数组进行 filter 方法的过滤
      this.artlist = this.artlist.filter(item => item.art_id.toString() !== id)
      // 问题描述：炸楼之后，如果文章列表的数据不足以撑满整个屏幕，会导致上拉加载和下拉刷新不生效的问题
      // 解决方案：每次炸楼之后，判断剩余数据的文章数量是否小于 10，如果小于 10，则主动请求下一页的数据
      // 2. 判断剩余数据的文章数量是否小于 10
      if (this.artlist.length < 10) {
        // 主动请求下一页的数据
        this.initArtList()
      }
    },

    // 上拉刷新
    onLoad() {
      this.initArtList()
      // console.log('执行了上拉')
    },
    // 下拉刷新{
    onRefresh() {
      this.initArtList(true)
      // console.log('执行了下拉')
    }
  },
  components: {
    ArtItem
  }
}
</script>

<style lang="less" scoped>
</style>
