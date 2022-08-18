const { defineConfig } = require('@vue/cli-service')

const path = require('path')
const themePath = path.join(__dirname, './src/theme.less')

module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  publicPath: './',
  // 增强 vue-cli 的 webpack 配置项
  configureWebpack: {
    // 打包优化
    externals: {
      // import 时的包名称: window 全局的成员名称
      // 打包优化

      // import 时的包名称: window 全局的成员名称
      'highlight.js': 'hljs',
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      axios: 'axios',
      vant: 'vant',
      dayjs: 'dayjs',
      'socket.io-client': 'io',
      popmotion: 'popmotion'
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            // 直接覆盖变量
            // 'nav-bar-background-color': 'orange'
            // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
            //  ../    ./    theme.less
            // 从盘符开始的路径，叫做绝对路径   C:\\Users\liulongbin\\theme.less
            hack: `true; @import "${themePath}";`
          }
        }
      }
    }
  }
}
