const path=require('path');
const baseConfig = require('./webpack.base');
const { merge }=require('webpack-merge');
module.exports = merge(baseConfig,{
    mode: 'development', 
    devServer: {
        port: 3000, // 服务端口号
        compress: false, // gzip压缩,开发环境不开启,提升热更新速度
        hot: true, // 开启热更新
        historyApiFallback: true, // 解决history路由404问题
        static: {
          directory: path.join(__dirname, "../public"), //托管静态资源public文件夹
        },
        open: true,
        client: {
          overlay: {//Shows a full-screen overlay in the browser when there are compiler errors or warnings.
            errors: true,
            warnings: false,
          },
          progress: true,//Prints compilation progress in percentage in the browser
        },
    },
    devtool: 'eval-cheap-module-source-map', // 源码调试模式,sourceMap
    
})