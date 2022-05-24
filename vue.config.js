// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true,
//   lintOnSave: false
// })
// 配置后台服务
const serverURL = 'https://netease-cloud-music-lp4woj961-wangrujian0321.vercel.app'
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'view': '@/views',
        'plugins': '@/plugins',
      }
    },
    // lintOnSave: false
  },
  devServer: {
    proxy: {
      '/api':{
        target: serverURL,
        changeOrigin: true,
        ws: true,
        pathRewrite:{
          '^/api': ''
        },
        'm7': {
          target: 'http://m7.music.126.net',
          changeOrigin: true,
          ws: true,
          pathRewrite: {
            '^/m7': ''
          }
        },
        'm701': {
          target: 'http://m701.music.126.net',
          changeOrigin: true,
          ws: true,
          pathRewrite: {
            '^/m701': ''
          }
        },
        'm8': {
          target: 'http://m8.music.126.net',
          changeOrigin: true,
          ws: true,
          pathRewrite: {
            '^/m8': ''
          }
        },
        'm801': {
          target: 'http://m801.music.126.net',
          changeOrigin: true,
          ws: true,
          pathRewrite: {
            '^/m801': ''
          }
        }
      }
    }
  }
}
