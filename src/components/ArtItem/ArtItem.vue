<template>
  <div class="artliem-container">
    <!-- 文章的信息 -->
    <van-row class="padding16">
      <van-col span="15">
        <h5 class="h5mar">{{article.title}}</h5>
      </van-col>
      <van-col span="9" v-if="article.cover.type===1">
        <van-col class="img-con" href="javascript:;" tag="a">
          <img :src="article.cover.images[0]" alt="">
        </van-col>
      </van-col>
      <van-col tag="ul" v-else class="listImg" span="24">
        <van-col tag="li" v-for="(item,i) in article.cover.images" :key="i" span="8">
          <img v-lazy="item" alt="">
        </van-col>
      </van-col>
      <van-col span="24" class="text-fontcolor spanmartop">
        <span>作者:{{article.aut_name}}&nbsp;&nbsp;({{article.comm_count}})评论&nbsp;&nbsp;发布日期&nbsp;&nbsp;{{article.pubdate | dateFormat}}</span>
        <!-- <van-icon name="cross" size="10" color="#ccc" /> -->
        <!-- 关闭按钮 -->
        <!-- 通过 .stop 事件修饰符，阻止点击事件的冒泡 -->
        <van-icon name="cross" color="#ccc" size="15" @click.stop="show = true" />
      </van-col>
    </van-row>

    <!-- 反馈的动作面板 -->
    <!-- 默认情况下，我们是在 ArtItem.vue 组件中使用的 <van-action-sheet> 组件，因此动作面板的 DOM 结构会被渲染到 List 列表组件 内部
    导致的问题：动作面板中的内容上下滑动时，会导致 List 列表组件的 下拉刷新
    解决方案：把 ActionList 组件，通过 get-container 属性，挂载到 body 元素下： -->
    <!-- 监听 <van-action-sheet> 的 @closed 事件，当动作面板完全关闭且结束动画以后，将 isFirst 设置为 true。保证下次打开动作面板时，默认展示第一个反馈面板： -->
    <van-action-sheet v-model="show" cancel-text="取消" :closeable="false" @closed="isFirst = true" get-container="body">
      <!-- 第一级反馈面板 -->
      <div v-if="isFirst">
        <!-- 循环渲染可选项 -->
        <!-- 为一级选项绑定名为 onCellClick 的点击事件处理函数，同时把当前选项的 name 作为参数，传递给事件处理函数： -->
        <van-cell :title="item.name" v-for="item in actions" :key="item.name" clickable class="center-title" @click="onCellClick(item.name)" />
      </div>
      <!-- 第二级反馈面板 -->
      <div v-else>
        <!-- 当点击二级反馈面板中的返回时，将 isFirst 设置为 true，从而展示一级反馈面板： -->
        <van-cell title="返回" clickable title-class="center-title" @click="isFirst = true" />
        <!-- 循环渲染二级反馈面板的可选项列表： -->
        <van-cell v-for="item in reports" :key="item.type" clickable title-class="center-title" :title="item.label" @click="reportArticle(item.type)"></van-cell>
      </div>
    </van-action-sheet>

  </div>
</template>

<script>
// 并将导入得到的 reports 数组挂载为 ArtItem.vue 组件的 data 数据，供模板结构进行 v-for 循环的渲染：
// 导入 /src/api/reports.js 模块
import reports from '@/api/reports.js'
// 从 /src/api/homeAPI.js 模块中按需导入 getArtListAPI 接口：
// 按需导入 API 接口
import { dislikeArticleAPI, reportArticleAPI } from '@/api/homeAPI.js'

// 基于 props 中的 article 文章对象，定义名为 artId 的计算属性：
export default {
  name: 'ArtItem',
  props: {
    // 文章信息对象
    article: {
      type: Object,
      required: true // 必填项
    }
  },
  computed: {
    // 文章 Id 的计算属性
    // 注意：文章对象的 art_id 是大数对象，需要调用 .toString() 方法转换为字符串形式
    artId() {
      return this.article.art_id.toString()
    }
  },
  data() {
    return {
      // 是否展示反馈面板
      show: false,
      //  组件中的反馈动作面板中，结合 v-if 与 v-else 指令，按需展示对应的反馈面板：
      // 是否展示第一个反馈面板
      isFirst: true,
      // 第一个面板的可选项列表
      actions: [
        { name: '不感兴趣' },
        { name: '反馈垃圾内容' },
        { name: '拉黑作者' }
      ],
      // 第二个面板的可选项列表，数组中每一项的格式 { type, label }
      reports
    }
  },
  methods: {
    // 在 onCellClick 处理函数中，调用 API 接口，将指定 Id 的文章设置不感兴趣：
    // 一级选项的点击事件处理函数
    async onCellClick(name) {
      if (name === '不感兴趣') {
        // console.log(this.artId)
        // 调用 API 接口，将文章设置为不感兴趣
        const { data: res } = await dislikeArticleAPI(this.artId)
        if (res.message === 'OK') {
          // TODO：炸楼的操作 触发自定义的事件，将文章 id 发送给父组件
          this.$emit('remove-article', this.artId)

          // console.log(res)
        }
        this.show = false
      } else if (name === '拉黑作者') {
        console.log('拉黑作者')
        this.show = false
      } else {
        // TODO：展示二级反馈面板
        // 点击一级反馈面板中的反馈垃圾内容选项时，将 isFirst 设置为 false，从而展示二级反馈面板：
        this.isFirst = false
      }
    },

    // 举报文章（形参 type 是举报的类型值）
    async reportArticle(type) {
      const { data: res } = await reportArticleAPI(this.artId, type)
      if (res.message === 'OK') {
        // 2. 炸楼操作，触发自定义事件，把文章 Id 发送给父组件
        this.$emit('remove-article', this.artId)
      }
      // 3. 关闭动作面板
      this.show = false
      // console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
.artliem-container {
  padding: 0.26rem 0.39rem;
  border-bottom: 1px solid rgb(238, 237, 237);
  .h5mar {
    margin-bottom: 10px;
    font-size: 0.37333rem;
  }
  .center-title {
    text-align: center;
  }
  .spanmartop {
    margin-top: 10px;
  }
  .img-con img,
  .listImg img {
    width: 113px;
    height: 70px;
    object-fit: cover;
  }
  .text-fontcolor {
    span {
      color: rgb(191, 191, 191);
      font-size: 0.32rem;
      margin: 0 5px;
    }
  }
  .text-fontcolor {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
