<template>
  <div class="SearchResult-container">
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar title="搜索结果" left-arrow @click-left="$router.back()" fixed />
    </div>
    <ArtItem v-for="item in searchList" :key="item.art_id.toString()" :article="item"></ArtItem>
  </div>
</template>

<script>
// 导入文章的 Item 项组件
import ArtItem from '@/components/ArtItem/ArtItem.vue'
// 按需导入 API 方法
import { getSearchResultAPI } from '@/api/searchAPI.js'
export default {
  name: 'SearchResult',
  data() {
    return {
      // 页码值
      page: 1,
      // 搜索的结果
      searchList: []
    }
  },
  created() {
    this.initSearchList()
  },
  methods: {
    // 获取搜索的结果
    async initSearchList() {
      console.log(this)
      // 调用 API 接口
      // if (this.kw === '') return
      const { data: res } = await getSearchResultAPI(this.$route.params.kw, this.page)
      if (res.message === 'OK') {
        this.searchList = res.data.results
      }
      console.log(res)
    }
  },
  components: {
    // 注册组件
    ArtItem
  }

}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
