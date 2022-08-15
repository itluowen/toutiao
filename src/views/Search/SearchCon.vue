<template>
  <div class="search-con">
    <!-- Header 头部区域 -->
    <div class="search-header">
      <!-- 后退图标 -->
      <!-- 点击搜索页的后退图标，通过编程式导航 API 实现后退操作： -->
      <van-icon name="arrow-left" color="white" size="45" class="goback" @click="$router.back()" />
      <!-- 搜索组件 -->
      <!-- 搜索框自动获得焦点
      在 Search.vue 组件的 mounted 生命周期函数中，并通过 DOM 操作查找到 input 输入框，使其获得焦点 -->
      <!-- 实现输入框的防抖
      节流：单位时间内，重复的操作只会触发 1 次
      防抖：频繁触发某个操作时，仅触发最后 1 次 -->
      <!-- 1.在 Search.vue 组件的 data 节点下，声明 timerId，用来存储延时器的 id： -->
      <!-- 2.监听搜索组件的 input 输入事件： -->
      <!-- 3.在 Search.vue 组件的 methods 中声明 onInput 方法： -->
      <!-- 4.在 onInput 方法中，将 console.log(this.kw) 放到延时器中： -->
      <!-- 5.在触发 onInput 方法时，立即清除掉上次的延时器，从而实现输入框的防抖操作： -->
      <!-- 6.如果触发 onInput 事件时 this.kw 的值为空字符串，则不开启延时器： -->

      <van-search v-model.trim="kw" class="inputHei" placeholder="请输入搜索关键词" background="#007BFF" shape="round" @input="onInput" />

    </div>

    <!-- 渲染搜索建议的 DOM 结构
    在 Search.vue 组件中，和 Header 头部区域平级，基于 v-for 指令循环渲染出搜索建议的 DOM 结构 -->

    <!-- 高亮搜索关键词
    要想实现搜索关键词的高亮效果，需要用到字符串的 replace 方法以及正则表达式 -->

    <!-- 搜索建议 -->
    <div class="sugg-list" v-if="kw.length!=0">
      <!-- 循环渲染搜索的建议列表时，将 插值表达式替换为 v-html 指令，从而渲染出带标签和样式的内容： -->
      <!-- 搜索结果
      #7.7.1 跳转到搜索结果页
      在 Search.vue 组件中，为搜索建议项绑定 click 点击事件处理函数： -->
      <div class="sugg-item" v-for="(item, i) in suggestList" :key="i" v-html="item" @click="gotoSearchResult"></div>
    </div>

    <!-- 搜索历史 -->
    <!-- 根据搜索关键字 kw 的 length 是否为 0，再结合 v-if 和 v-else 指令，实现搜索建议和搜索历史的按需展示： -->
    <!-- 将搜索关键词存为搜索历史 -->
    <!-- data 节点下的 history 数组清空： -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <!-- 在带点击事件处理函数中，直接将 history 数组清空即可 -->
          <van-icon name="delete" class="search-icon" @click="history = []" />
        </template>
      </van-cell>

      <!-- 历史列表 -->

      <div class="history-list">
        <span class="history-item" v-for="(tag, i) in history" @click="gotoSearchResult" :key="i">{{tag}}</span>
      </div>
    </div>
  </div>
</template>

<script>
// 请求搜索建议的列表数据
// 在 /src/api/ 目录下，新建 searchAPI.js 模块，并定义请求搜索建议的 API 接口
import { getSuggestListAPI } from '@/api/searchAPI.js'
export default {
  name: 'SearchCon',
  data() {
    return {
      // 搜索关键词
      kw: '',
      // 延时器的 Id
      timer: null,
      // 搜索建议列表
      suggestList: [],
      // 搜索历史
      // history: ['API', 'java', 'css', '前端', '后台接口', 'python']
      // 修改 initSuggestList 方法，把搜索关键词存储到 history 数组中：
      // 当 Search.vue 组件首次被加载时，读取 localStorage 中的历史记录，并赋值给 data 中的 history：
      history: JSON.parse(localStorage.getItem('history') || '[]')
    }
  },
  mounted() {
    // mounted 生命周期函数中，并通过 DOM 操作查找到 input 输入框，使其获得焦点：
    const ipt = document.querySelector('input[type="search"]')
    ipt && ipt.focus()
  },
  created() {
    this.initSuggestList()
  },
  methods: {
    // 高亮搜索关键词的方法，形参中的 arr 是搜索建议的数组
    hlightKeywords(arr) {
      // 1. 根据用户输入的 kw，动态创建正则表达式
      const reg = new RegExp(this.kw, 'ig')
      if (this.kw === '') return // 输入框为空
      // 循环数组中的每一项
      arr.forEach((item, index) => {
        // 2. TODO：调用字符串的 replace 方法，进行关键词的高亮处理
        arr[index] = item.replace(reg, val => {
          return `<span style="color: red; font-weight: bold;">${val}</span>`
        })
        // arr[index] = `索引:${index};Item : ${item}`
      })
      // 当请求到搜索建议的列表数据之后，先调用 hlightKeywords 方法进行关键词的高亮，再把数据赋值给 suggestList：
    },
    onInput() {
      // 每次触发，都会打印 kw 的值

      // 2. 清除上次的延时器
      clearTimeout(this.timer)

      // 3. 如果输入的内容为空，则 return 出去，不开启延时器
      // 修改 Search.vue 组件 methods 节点下的 onInput 方法，
      // 当搜索关键词变成空字符串的时候，清空 data 中的 suggestList 数组：
      if (this.kw.length === 0) {
        // 清空搜索建议的列表数据
        this.suggestList = []
        // alert('没有找到')
        return
      }

      // 1. 开启延时器，将延时器的 id 存储到 this.timerId 中
      this.timer = setTimeout(() => {
        // 在搜索组件的 @input 事件处理函数中，调用 initSuggestList 方法：
        this.initSuggestList()
        // console.log(this.kw)
      }, 500)
    },
    async initSuggestList() {
      if (this.kw !== '') {
        const { data: res } = await getSuggestListAPI(this.kw)
        if (res.message === 'OK') {
          console.log(res.data.options.length)
          if (res.data.options.length === 0) {
            return alert('查无此人')
          }
          // 1. 调用 hlightKeywords 方法，对关键词进行高亮处理
          this.hlightKeywords(res.data.options)
          // 2. 将高亮的结果，赋值给 suggestList
          this.suggestList = res.data.options
          // 把搜索关键词加入到搜索历史中
          const newHistory = this.history.filter(item => item !== this.kw)
          newHistory.unshift(this.kw)
          this.history = newHistory // 持久化存储搜索历史   定义 watch 侦听器，监视 history 数组的变化，并把它持久化存储到 localStorage 中：
        }
      }
    },
    // 跳转到搜索结果页
    // 跳转到搜索结果页
    gotoSearchResult(e) {
      // e.currentTarget 是当正在触发事件的那个元素
      // console.log(e.currentTarget.innerText)

      // 1. 获取用户当前点击的搜索建议项的内容
      const kw = e.currentTarget.innerText

      // 2. 通过编程式导航 API，跳转到搜索结果页
      this.$router.push('/search/' + kw)
    }
  },
  watch: {
    // 监视历史记录的变化
    history(newVal) {
      // 持久化存储到本地
      localStorage.setItem('history', JSON.stringify(newVal))
      // 当 Search.vue 组件首次被加载时，读取 localStorage 中的历史记录，并赋值给 data 中的 history：
    }
  }
}
</script>

<style lang="less" scoped>
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.van-search .van-cell {
  padding: 3.5px 0;
}
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  // 后退按钮
  .goback {
    padding-left: 14px;
  }
  // 搜索组件
  .van-search {
    flex: 1;
  }
}
</style>
