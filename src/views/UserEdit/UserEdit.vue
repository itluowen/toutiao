<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <!-- 用户的头像 -->
          <van-image round class="avatar" :src="userProfile.photo" @click="$refs.fileRef.click()" />
          <!-- 文件选择框 -->
          <!-- 实现选择图片的功能
          在 class="avatar" 的 <van-image> 之后，渲染图片的文件选择框： -->
          <input type="file" accept="image/*" @change="onFileChange" v-show="false" ref="fileRef" />
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="userProfile.name" @click="onNameCellClick" />
      <van-cell title="生日" is-link :value="userProfile.birthday" @click="onBirthCellClick" />
    </van-cell-group>

    <!-- 修改用户名称的对话框 -->
    <!-- 为 <van-dialog> 组件绑定 before-close 属性，并指定对应的处理函数： -->
    <van-dialog v-model="showNameDialog" title="修改名称" show-cancel-button :before-close="beforeClose">
      <!-- input-align 文本横向的对其方式 -->
      <van-field v-model.trim="name" placeholder="请输入用户名" ref="nameRef" input-align="center" maxlength="7" />
    </van-dialog>

    <!-- 修改生日的动作面板 -->
    <van-action-sheet v-model="showBirthSheet">
      <!-- 点击取消按钮时，关闭选择生日的动作面板：@cancel -->
      <!-- 点击确认按钮时，会触发日期组件的 confirm 事件 -->
      <van-datetime-picker v-model="currentDate" type="date" title="选择出生日期" :min-date="minDate" @cancel="showBirthSheet = false" :max-date="maxDate" @confirm="updateBirthday" />
    </van-action-sheet>
  </div>
</template>

<script>
// 按需导入辅助函数
import { mapActions, mapState } from 'vuex'
// 按需导入 API 接口
import { updateUserProfileAPI, updateUserAvatarAPI } from '@/api/userAPI.js'
// 导入 dayjs
import dayjs from 'dayjs'
export default {
  name: 'UserEdit',
  data() {
    return {
      // 是否展示修改姓名的对话框
      showNameDialog: false,
      // 用户填写的姓名
      name: '',
      // 是否展示修改生日的对话框
      showBirthSheet: false,
      // 最小可选日期（0 表示 1月份）
      // 渲染 DatetimePicker 组件
      minDate: new Date(1900, 0, 1),
      // 最大可选日期（11 表示 12月份）
      maxDate: new Date(2050, 11, 31),
      // 当前日期
      currentDate: new Date()
    }
  },
  methods: {
    // 从 vuex 中把指定名称的 Action 方法映射到组件中使用
    ...mapActions(['initUserProfile']),
    // 点击了修改名称的 cell
    onNameCellClick() {
      // 把用户的名称赋值给 data 中的 name
      this.name = this.userProfile.name
      // 展示对话框
      this.showNameDialog = true
      // DOM 更新完毕之后，让文本框自动获得焦点
      this.$nextTick(() => {
        this.$refs.nameRef.focus()
      })
    },
    // 选中的文件发生了变化
    async onFileChange(e) {
      // 获取到用户选择的文件列表
      const files = e.currentTarget.files
      // 如果没有选择任何文件，则不执行后续的业务逻辑
      if (files.length === 0) return

      // 1.1 创建 FormData 的对象
      const fd = new FormData()
      // 1.2 向 fd 中追加数据项
      fd.append('photo', files[0])

      // 2. 调用 API 接口，更新头像
      const { data: res } = await updateUserAvatarAPI(fd)
      if (res.message === 'OK') {
        // 2.1 更新用户的简介信息
        this.initUserProfile()
        // 2.2 提示用户更新成功
        this.$notify({ type: 'success', message: '更新头像成功！', duration: 2000 })
      }
      // 打印用户选择的第一个文件
      // console.log(res)
    },
    // 点击了修改生日的 cell
    onBirthCellClick() {
      // 如果用户生日的值存在，则初始值为用户的生日；否则为当前日期
      this.currentDate = this.userProfile.birthday ? new Date(this.userProfile.birthday) : new Date()

      // 展示动作面板
      this.showBirthSheet = true
    },
    // 更新用户的简介信息
    async updateName(done) {
      // 如果请求接口失败，且报错的消息是409 (CONFLICT)，则证明当前提交的名称被占用了，需要进行 try...catch 的处理：
      try {
        const { data: res } = await updateUserProfileAPI({ name: this.name })
        if (res.message === 'OK') {
          // 1. 关闭对话框
          done()
          // 2. 重新请求用户的简介信息
          this.initUserProfile()
          // 3. 提示用户更新成功
          this.$notify({ type: 'success', message: '名称更新成功！', duration: 2000 })
        }
      } catch (e) {
        if (e.response.status === 409) {
          // 提示用户名称被占用
          this.$notify({ type: 'warning', message: '名称被占用，请更换后重试！', duration: 2000 })
          // 阻止关闭对话框
          done(false)
          // 让文本框持续获得焦点
          this.$refs.nameRef.focus()
        } else {
          // 关闭对话框
          done()
          // 提示用户名称被占用
          this.$notify({ type: 'danger', message: '名称更新失败！', duration: 2000 })
        }
      }
    },
    // 更新用户的生日
    async updateBirthday(value) {
      // 关闭动作面板
      this.showBirthSheet = false
      // 调用 .format() 方法对时间进行格式化
      const dateStr = dayjs(value).format('YYYY-MM-DD')
      // 调用 API 接口，修改用户的生日
      const { data: res } = await updateUserProfileAPI({ birthday: dateStr })
      if (res.message === 'OK') {
        // 重新获取用户的简介信息
        this.initUserProfile()
        // 提示用户更新成功
        this.$notify({ type: 'success', message: '生日修改成功！', duration: 2000 })
      }
      // 打印用户选择的日期
      // console.log(res)
    },
    // Dialog 关闭前的处理函数
    beforeClose(action, done) {
      // 点击了“取消”按钮
      if (action === 'cancel') return done()

      // 判断名称的长度是否不合法
      if (this.name === '' || this.name.length > 7) {
        // 1. 提示用户“名称的长度为1-7个字符”
        this.$notify({ type: 'warning', message: '名称的长度为1-7个字符', duration: 2000 })
        // 2. 让文本框持续获得焦点
        this.$refs.nameRef.focus()
        // 3. 阻止对话框关闭
        return done(false)
      }
      // action 可能的值有两个：cancel 和 confirm

      // TODO：发起修改名称的请求：
      // A. 如果请求成功，则调用 done() 关闭对话框
      // B. 如果请求失败，则提示用户失败的信息，并调用 done(false) 阻止对话框关闭

      // 调用 done() 时会关闭对话框；调用 done(false) 时会阻止对话框关闭
      this.updateName(done)
    }
  },
  created() {
    this.initUserProfile()
  },
  computed: {
    // 从 vuex 中把指定名称的 State 数据映射到组件中使用
    ...mapState(['userProfile'])
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
}

.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
</style>
