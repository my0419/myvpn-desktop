require('dotenv').config()

const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const webpack = require('webpack')

const staticPath = [path.resolve(__dirname, 'public')]

module.exports = defineConfig({
  publicPath: '',
  runtimeCompiler: true,
  transpileDependencies: true,
  productionSourceMap: false,
  pluginOptions: {
    cordovaPath: 'cordova',
    electronBuilder: {
      nodeIntegration: true,
      outputDir: path.resolve(__dirname, 'dist'),
      productName: 'MyVPN',
      appId: 'com.myvpn.app',
      icon: path.resolve(__dirname, 'public/512x512.png'),
      publish: ['github'],
      directories: {
        output: 'dist',
      },
      nsis: {
        installerIcon: path.resolve(__dirname, 'public/512x512.png'),
        uninstallerIcon: path.resolve(__dirname, 'public/512x512.png'),
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
        `,
      },
    },
  },
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin({ excludeAliases: ['process'] }),
      new webpack.DefinePlugin({
        __static: staticPath,
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
        vue$: 'vue/dist/vue.esm.js',
        sassMixins: path.resolve(__dirname, 'src/assets/css/mixins'),
      },
    },
  },
})
