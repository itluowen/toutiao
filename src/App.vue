<template>
  <div id="app">
    <!-- 路由占位符 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

  </div>
</template>
<script>
export default {
  name: 'app'
}
</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
}
</style>
