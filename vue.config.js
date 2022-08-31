const path = require("path")

module.exports = {
     //生产环境是否要生成 sourceMap
     productionSourceMap: false,
     //部署应用包时的基本 URL,用法和 webpack 本身的 output.publicPath 一致
     //可以通过三元运算去配置dev和prod环境, publicPath: process.env.NODE_ENV === 'production' ? '/prod/' : './'
     publicPath:'./',
     //build 时输出的文件目录
     outputDir:'dist',
     lintOnSave:false,
     //放置静态文件目录
     //assertsDir:'./src/assets',
     //dev环境下，webpack-dev-server相关配置
     devServer:{
         port:6300,
         host:'0.0.0.0',
         https:false,
         open:true
     },
    //  alias: {
    //     '@': path.resolve(__dirname, 'src')
    //  },
     css: {
        loaderOptions: {
            sass: {
                // 全局sass变量	
                //sass-loader 8.0.0以前版本（包含）
                // additionalData: `@import "@/assets/scss/_variable.scss";`
                // additionalData: `@import "/@/style/init.scss"; @import "/@/assets/scss/index.scss";`
            }
        }
    },
 
}