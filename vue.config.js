const { defineConfig } = require('@vue/cli-service')

const path = require('path')
const themePath = path.join(__dirname, './src/theme.less')

module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  transpileDependencies: true,
  publicPath: './',
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
