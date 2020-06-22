const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssTextPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'production',
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'static/js/[name].[chunkhash:8].js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      { test: /\.pug$/, use: ['pug-plain-loader'] },
      { test: /\.vue$/, use: ['vue-loader'] },
      { test: /\.less$/, use: ['vue-style-loader', 'css-loader', 'less-loader'] },
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.js$/, loader: 'babel-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: './static/img',
            publicPath: '/static/img'
          }
        }]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: './static/fonts',
            publicPath: '/static/fonts'
          }
        }]
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        }
      })
    ],
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssTextPlugin({
      filename: 'static/css/[name].[contenthash].css'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    // 用于生成html文件，可定义多个
    new HtmlWebpackPlugin({
      title: 'datav-easy',
      filename: 'index.html',
      template: 'index.html'
    })
  ]
}
