<template>
  <div class="home-container">
    <!-- 头部区域 -->
    <van-nav-bar fixed>
      <!-- 左侧的插槽 -->
      <template #left>
        <img src="@/assets/toutiaolog.png" alt="logo" class="logo" />
      </template>
      <!-- 右侧的插槽 -->
      <!-- 为搜索的小图标绑定点击事件处理函数，通过编程式导航 API 跳转到搜索页： -->
      <template #right>
        <van-icon name="search" @click="$router.push('/search')" color="white" size="30" />
      </template>
    </van-nav-bar>

    <!-- 频道列表的标签页 -->
    <!-- //为 van-tabs 组件添加 sticky 属性，即可在页面纵向滚动时，实现频道列表的吸顶效果
    //offset-top 属性，即可设置吸顶的距离：
    //375 px = 10 rem
    1 px = 10/375 rem
    46 px = 460/375 rem
    46 px ≈ 1.22666667rem -->
    <!-- 记录每个 tabs 的滚动位置
    当 Home.vue 组件中的频道选中项发生变化的时候，需要记录每个频道下列表的滚动位置。 -->
    <van-tabs v-model="active" sticky offset-top="1.22666667rem" :before-change="beforeTabsChange" @change="onTabsChange">
      <!-- 循环渲染用户的频道 -->
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">
        <!-- 在每一个用户频道下，渲染出对应的“文章列表组件” -->
        <!-- 注意：Vue 官方建议在绑定 props 时，把“小驼峰”的属性名，改造成“短横线”的形式使用 -->
        <art-list :channel-id="item.id"></art-list>
      </van-tab>
    </van-tabs>

    <!-- 频道管理的小图标 -->
    <!-- 在点击频道管理的小图标时，将 show 设置为 true，从而展示出频道管理的弹出层： -->
    <van-icon name="plus" size="20" class="plus" @click="show = true" />

    <!-- 频道管理的弹出层 -->
    <!-- 为 <van-popup> 组件绑定 :close-on-click-overlay="false" 属性，从而防止点击遮罩层时，弹出层自动关闭的效果： -->
    <!-- 弹出层关闭时重置编辑的状态
    监听 <van-popup> 弹出层关闭完成时的 closed 事件，直接将 isDel 设置为 false 即可： -->
    <van-popup v-model="show" :close-on-click-overlay="false" @closed="isDel = false">
      <!-- 实现频道管理的基础布局 -->
      <!-- 弹出层的头部区域 -->
      <van-nav-bar title="频道管理">
        <template #right>
          <van-icon name="cross" size="30" color="white" @click="show = false" />
        </template>
      </van-nav-bar>
      <!-- 弹出层的主体区域 -->
      <div class="pop-body">
        <!-- 我的频道 -->
        <div class="my-channel-box">
          <div class="channel-title">
            <div>
              <span class="title-bold">已添加频道：</span>
              <!-- 根据 isDel 的状态，动态渲染按钮的文本和提示的文本： -->
              <span class="title-gray">{{isDel ? '点击移除频道' : '点击进入频道' }}</span>
            </div>

            <!-- 实现删除频道的功能 -->
            <!-- 点击编辑按钮的时候，切换 isDel 的状态： -->
            <span class="btn-edit" @click="isDel = !isDel">编辑</span>

          </div>
          <!-- 我的频道列表 -->
          <!-- 实现频道的点击联动效果
          在点击用户频道的 Item 项时，把索引值传递到点击事件的处理函数中 -->
          <van-row type="flex">
            <!-- 1. 在进行 v-for 循环时，接收索引 index -->
            <!-- 2. 点击用户频道的 Item 项时，将索引 index 作为参数，传递给 onUserChannelClick 方法 -->
            <van-col span="6" v-for="(item,index) in userChannel" :key="item.id">
              <!-- 用户的频道 Item 项 -->
              <!-- 实现删除的功能
              注意：
              “推荐”这个频道不允许被删除
              用户的频道列表中，至少要包含两个频道
              为用户的频道 Item 项绑定点击事件处理函数，命名为 onUserChannelClick -->
              <div class="channel-item van-hairline--surround" @click="onUserChannelClick(item,index)">
                {{item.name}}
                <!-- 删除的图标 -->
                <!-- 使用 v-if 控制图标的显示与隐藏： -->
                <!-- 如果频道的名字是“推荐”，则不渲染删除的小图标： -->
                <!-- 如果 userChannel 数组中仅剩下两个频道，则不渲染删除的小图标 -->
                <van-badge color="transparent" v-if="isDel && item.name !=='推荐' &&   userChannel.length > 2 " class="cross-badge">
                  <template #content>
                    <van-icon name="cross" class="badge-icon" color="#cfcfcf" size="14" />
                  </template>
                </van-badge>
              </div>
            </van-col>
          </van-row>
        </div>

        <!-- 分隔线 -->
        <div class="van-hairline--top sp-line"></div>

        <!-- 更多频道 -->
        <!-- 动态计算更多频道的列表数据 -->
        <!-- 后台没有提供直接获取更多频道的 API 接口，需要程序员动态地进行计算：更多频道 = 所有频道 - 我的频道
        此时，需要先获取到所有频道地列表数据，再使用计算属性动态地进行筛选即可
        #6.2.1 请求所有频道的列表数据 -->

        <div class="more-channel-box">
          <div class="channel-title">
            <div>
              <span class="title-bold">可添加频道：</span>
              <span class="title-gray">点击添加频道</span>
            </div>
          </div>
          <!-- 更多频道列表 -->
          <van-row type="flex">
            <van-col span="6" v-for="item in moreChannels" :key="item.id">
              <!-- 初步实现新增频道的功能
            为“更多频道”下的 item 项绑定点击事件处理函数，将当前的频道信息作为参数，传递给 addChannel 方法： -->
              <!-- methods 节点下，声明 addChannel 处理函数： -->
              <div class="channel-item van-hairline--surround" @click="addChannel(item)">{{item.name}}</div>
            </van-col>
          </van-row>
        </div>
      </div>

    </van-popup>

  </div>
</template>

<script>
/* eslint-disable */
// 获取当前用户的频道列表接口API // 请求所有频道的列表数据 // 更新用户频道列表数据的 API
import { getUserChannelAPI, getAllChannelAPI, updateUserChannelAPI } from '@/api/homeAPI.js'
// 导入 ArtList.vue 组件：
import ArtList from '@/components/ArtList/ArtList.vue'

const nameToTop = {}

export default {
  name: 'HomeCon',
  data() {
    return {
      // 标签页激活项的索引
      active: 0,
      // 用户的频道列表数组
      userChannel: [],
      // 所有的频道列表数据
      allChannel: [],
      // 控制频道管理弹出层的展示与隐藏
      show: false,
      // 频道数据是否处于删除的状态
      isDel: false
    }
  },
  // created 生命周期函数中，调用 initUserChannel 方法请求用户的频道列表数据
  created() {
    // 请求用户的频道列表数据
    this.getUserChannelAPI()
    // 请求所有的频道列表数据
    this.initAllChannel()
  },
  methods: {
    // 获取当前用户的频道列表数据
    async getUserChannelAPI() {
      const { data: res } = await getUserChannelAPI()
      // console.log(res)
      // 判断接口是否请求成功
      if (res.message === 'OK') {
        this.userChannel = res.data.channels
      }
    },
    // 获取所有频道的列表数据
    async initAllChannel() {
      const { data: res } = await getAllChannelAPI()
      if (res.message === 'OK') {
        // 将请求到的数据，转存到 allChannel 中
        this.allChannel = res.data.channels
        // console.log(res)
        // console.log(res.data)
        // console.log(res.data.channels)
      }
    },

    async addChannel(item) {
      // 新增频道（形参 item 就是当前用户点击的频道信息对象）
      // 格式：{ id, name }
      // 将用户点击的频道，添加到“用户频道”列表中
      this.userChannel.push(item)
      // TODO：调用 API 接口，将最新的用户频道，存储到后台数据库中
      // 将频道数据存储到数据库
      // 在 /src/api/homeAPI.js 模块中，声明如下的 API 接口，用来将用户的频道列表数据提交到服务器保存

      // 调用 updateChannel 方法，把最新的频道列表数据提交到后端保存
      this.updateChannel()

    },
    async updateChannel() {
      // 把用户的频道列表数据提交到后端保存
      // 1. 准备要提交到服务器的数据
      const channels = this.userChannel.filter(item => item.name !== '推荐') // 将“推荐”从频道列表中过滤出去
        .map((item, index) => {   // 调用数组的 map 循环，最终返回一个处理好的新数组
          return {
            id: item.id,
            seq: index + 1
          }
        })
      // 2. 调用 API 接口
      const { data: res } = await updateUserChannelAPI(channels)
      // console.log(res)

      //  提示用户更新成功
      // 基于 Vant 的 Notify 消息提示组件，可以实现顶部的消息通知

      if (res.message === '更新用户频道成功') {
        // 3. 通过 notify 弹框提示用户更新成功
        this.$notify({ type: 'success', message: '更新成功', duration: 1000 })
      }

    },
    // tabs 发生切换之前，触发此方法
    beforeTabsChange() {
      // 把当前"频道名称"对应的"滚动条位置"记录到 nameToTop 对象中
      const name = this.userChannel[this.active].name
      nameToTop[name] = window.scrollY

      // return true 表示允许进行标签页的切换
      return true
    },
    // 当 tabs 切换完毕之后，触发此方法
    onTabsChange() {
      // 等 DOM 更新完毕之后，根据记录的"滚动条位置"，调用 window.scrollTo() 方法进行滚动
      this.$nextTick(() => {
        const name = this.userChannel[this.active].name
        window.scrollTo(0, nameToTop[name] || 0)
      })
    },
    onUserChannelClick(channel, index) {
      // 从用户频道列表中，移除指定 id 的频道
      //如果频道的名字是“推荐”，则点击频道的时候不执行删除的操作：
      if (this.isDel) {
        // 处于删除状态
        // TODO1：从 userChannel 中移除指定的频道
        if (channel.name === '推荐' || this.userChannel.length === 2) return   // 判断用户点击的是否为“推荐”
        this.userChannel = this.userChannel.filter(item => item.id !== channel.id)
        // TODO2：将更改过后的用户频道数据，提交到服务器保存
        this.updateChannel()
      } else {
        //不处于删除状态
        // 1. 修改 Tabs 的激活项的索引值
        this.active = index
        // 2. 关闭 popup 弹出层
        this.show = false
      }
    }

  },
  computed: {
    // 更多频道的数据
    moreChannels() {
      // 1. 对数组进行 filter 过滤，返回的是符合条件的新数组
      return this.allChannel.filter((item) => {
        // 判断当前循环项，是否在 “我的频道” 列表之中
        const index = this.userChannel.findIndex(x => x.id === item.id)

        if (index === -1) return true
      })

      // 如果不在，则 return true，表示需要把这一项存储到返回的新数组之中
    }
  },

  // 导航离开该组件的对应路由时调用
  // 可以访问组件实例 `this`
  // 用来记录当前组件在纵向上滚动的距离
  // 组件内的导航守卫
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    // 在通过路由导航的方式，离开 Home.vue 组件的时候
    // 把滚动条的位置，记录到当前路由规则的 meta 元信息中
    this.$route.meta.top = window.scrollY
    next()
  },
  components: {
    ArtList
  },
}
// 导航离开该组件的对应路由时调用
// 可以访问组件实例 `this`

</script>

<style lang="less" scoped>
// 组件外层容器的样式
.home-container {
  padding-top: 46px;
  padding-bottom: 50px;
  // 频道管理小图标的定位
  .plus {
    position: fixed;
    top: 61px;
    right: 10px;
    z-index: 999;
  }
  .van-popup,
  .popup-container {
    background-color: transparent;
    height: 100%;
    width: 100%;
  }

  .popup-container {
    display: flex;
    flex-direction: column;
  }

  .pop-body {
    flex: 1;
    overflow: scroll;
    padding: 8px;
    background-color: white;
  }

  .my-channel-box,
  .more-channel-box {
    .channel-title {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      line-height: 28px;
      padding: 0 6px;
      .title-bold {
        font-weight: bold;
      }
      .title-gray {
        color: gray;
        font-size: 12px;
      }
    }
  }

  .btn-edit {
    border: 1px solid #a3a2a2;
    padding: 0 10px;
    line-height: 20px;
    height: 20px;
    border-radius: 6px;
    font-size: 12px;
  }

  .channel-item {
    font-size: 12px;
    text-align: center;
    line-height: 36px;
    background-color: #fafafa;
    margin: 6px;
  }

  .cross-badge {
    position: absolute;
    right: -1px;
    top: -1px;
    border: none;
  }

  .sp-line {
    margin: 10px 0 20px 0;
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
