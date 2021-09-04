const CompressionPlugin = require('compression-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const IsProduction = process.env.NODE_ENV === 'production'

module.exports = {
  chainWebpack: (config) => {
    if (IsProduction) {
      config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin)
    }
  },
  // publicPath: IsProduction ? './' : '/',
  publicPath:'/',
  outputDir: 'dist',
  lintOnSave: true,
  runtimeCompiler: true,
  productionSourceMap: false,
  devServer: {
    port: 8088,
    https: false,
    disableHostCheck: true,
    proxy: {
      '/api': {
        // target: 'http://xrpyzs.com',
        target:'http://r277997w90.zicp.vip',
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  configureWebpack: (config) => {
    if (IsProduction) {
      return {
        resolve: {
          extensions: ['.html', '.css', '.js', '.json'],
          alias: {},
        },
        module: {
          rules: [],
        },
        plugins: [
          new CompressionPlugin({
            test: /\.js$|\.html$|.\css/,
            threshold: 10240,
            deleteOriginalAssets: false,
          }),
        ],
      }
    } else {
      return {
        resolve: {
          extensions: ['.html', '.css', '.js', '.json'],
          alias: {
            '@': '/src',
          },
        },
        module: {
          rules: [],
        },
        plugins: [],
      }
    }
  },
}
