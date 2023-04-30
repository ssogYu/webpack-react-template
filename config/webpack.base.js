const path=require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const isDev=process.env.NODE_ENV === 'development';
/**
 * 路径处理
 * @param {*} pathName 
 * @returns 
 */
const resolvePath=(pathName)=>{
    return path.resolve(__dirname, pathName)
}
/**
 * 样式预处理
 */
const syleLoaders=(loader)=>{
    const loaderArr=[
        isDev ? 'style-loader': MiniCssExtractPlugin.loader,
        {
            loader:'css-loader',
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
               'postcss-preset-env'
              ]
            }
          }
        }
    ]
    if(loader){
        loaderArr.push(loader);
    }
    return loaderArr
}
module.exports ={
    entry: resolvePath('../src/index.tsx'),//入口文件
    output:{
        path: resolvePath('../dist'),//打包输出路径
        filename:'js/[name].[chunkhash:8].js',//输出的js文件名称
        clean: true,//清除缓存
        // publicPath:'/',//打包后的文件公共前缀
    },
    module: {
        rules: [
          {
            oneOf:[
              {
                test: /\.(tsx?|jsx?)$/i, // 匹配.ts, tsx文件
                exclude: /node_modules/,//排除 node_modules
                use: {
                  loader: 'babel-loader',
                  options: {
                    cacheDirectory:true,// 开启babel编译缓存
                  }
                }
              },
              {
                test:/\.css$/i,
                use: syleLoaders()
              },
              {
                test:/\.less$/i,
                use:syleLoaders('less-loader')
              },
              {
                test:/\.s[ac]ss$/i,
                use:syleLoaders('sass-loader')
    
              },
              {
                test:/.(png|jpg|jpeg|gif|svg|webp)$/, // 匹配图片文件
                type: "asset", // type选择asset
                parser: {
                  dataUrlCondition: {
                    maxSize: 10 * 1024, // 小于10kb转base64位
                  }
                },
                generator:{ 
                  filename:'static/images/[name].[contenthash:8][ext]', // 文件输出目录和命名
                },
              },
              {
                test:/.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
                type: "asset", // type选择asset
                parser: {
                  dataUrlCondition: {
                    maxSize: 10 * 1024, // 小于10kb转base64位
                  }
                },
                generator:{ 
                  filename:'static/fonts/[name].[contenthash:8][ext]', // 文件输出目录和命名
                },
              },
              {
                test:/.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
                type: "asset", // type选择asset
                parser: {
                  dataUrlCondition: {
                    maxSize: 10 * 1024, // 小于10kb转base64位
                  }
                },
                generator:{ 
                  filename:'static/media/[name].[contenthash:8][ext]', // 文件输出目录和命名
                },
              },
            ]
          } 
        ] 

    },
    resolve:{
        extensions:['.js','.tsx','.ts','.jsx'],
        alias:{
          '@':path.join(__dirname,'../src'),
        },
        modules: [path.resolve(__dirname, '../node_modules')],//查找第三方模块只在本项目的node_modules中查找
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: resolvePath('../public/index.html'), // 模板取定义root节点的模板
          inject: true, // 自动注入静态资源
        }),
        new webpack.DefinePlugin({
            "process.env.BASE_ENV":JSON.stringify(process.env.BASE_ENV),//自定义环境变量注入到业务代码中
        }),
        new ESLintPlugin({
          // 指定检查文件的根目录
          context: 'src/',
          extensions: ['js', 'jsx', 'ts', 'tsx'],
          cache: true,
          // quiet: true,
        }),
    ],
    cache: {//开启持久化存储缓存
      // 将缓存类型设置为文件系统,默认是memory
      type: 'filesystem',
      buildDependencies: {
        // 更改配置文件时，重新缓存
        config: [__filename]
      }
    },
}