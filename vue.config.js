require('dotenv').config()

const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  publicPath: './',
  runtimeCompiler: true,
  transpileDependencies: true,
  productionSourceMap: false,
  pluginOptions: {
    cordovaPath: 'cordova',
    electronBuilder: {
      nodeIntegration: true,
      outputDir: path.resolve(__dirname, 'dist'),
      icon: path.resolve(__dirname, 'build/icons/icon.png'),
      productName: 'MyVPN',
      appId: 'com.myvpn.app',
      directories: {
        output: 'build',
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: [path.resolve(__dirname, 'node_modules')],
        },
        additionalData: `
          @import "@/assets/element-ui/theme-myvpn/index.scss";
          @import "@/assets/css/app.scss";
        `,
      },
    },
  },
  configureWebpack: {
    plugins: [new NodePolyfillPlugin({ excludeAliases: ['process'] })],
    resolve: {
      fallback: {
        fs: false,
        dns: false,
        tls: false,
        net: false,
        path: false,
        zlib: false,
        child_process: false,
        process: require.resolve('process'),
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
        'sass-mixins': path.resolve(__dirname, 'src/assets/css/mixins'),
        vue$: 'vue/dist/vue.esm.js',
      },
    },
  },
})
