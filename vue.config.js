require('dotenv').config()

const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const webpack = require('webpack')

module.exports = defineConfig({
  publicPath: './',
  runtimeCompiler: true,
  transpileDependencies: true,
  productionSourceMap: false,
  pluginOptions: {
    electronBuilder: {
      productName: 'MyVPN',
      appId: 'com.myvpn.app',
      directories: {
        output: 'build',
      },
      dmg: {
        contents: [
          {
            x: 410,
            y: 150,
            type: 'link',
            path: '/Applications',
          },
          {
            x: 130,
            y: 150,
            type: 'file',
          },
        ],
        publish: ['github'],
      },
      mac: {
        publish: ['github'],
      },
      win: {
        publish: ['github'],
      },
      linux: {
        publish: ['github'],
      },
      nodeIntegration: true,
      enableRemoteModule: true,
      outputDir: path.resolve(__dirname, 'build'),
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __static: process.env.BASE_URL,
      }),
    ],
    resolve: {
      fallback: {
        fs: false,
        dns: false,
        tls: false,
        net: false,
        path: false,
        zlib: false,
        child_process: false,
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        os: require.resolve('os-browserify/browser'),
        url: require.resolve('url'),
        assert: require.resolve('assert'),
        'crypto-browserify': require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify
      },
      extensions: ['.ts', '.js', '.json', '.node'],
      alias: {
        '@': path.resolve(__dirname, 'src/'),
        './fonts': path.join(__dirname, 'src/assets/css/fonts'),
        sassMixins: path.join(__dirname, 'src/assets/css/mixins'),
        vue$: 'vue/dist/vue.esm.js',
      },
    },
  },
})
