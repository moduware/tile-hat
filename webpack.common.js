const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist')
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader", // translates CSS into CommonJS
            options: {
              sourceMap: true
            }
        }, {
            loader: "sass-loader", // compiles Sass to CSS
            options: {
              sourceMap: true
            }
        }]
      },
      {
        test: /\.css$/,
        use: [ 
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(jpg|png|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images'
            }
          }
        ]
      },
      {
        test: /\.(woff)$/,
        loader: 'file-loader?name=./fonts/[name].[ext]'
      },
      {
        test: /\.js$/, // Check for all js files
        exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
        loader: 'babel-loader',
        options: {
          presets: ['babel-preset-env']
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Temperature',
      template: './src/index.html'
    }),
    new CopyWebpackPlugin([
      { from: 'manifest.json', to: 'manifest.json' },
      { from: 'icon.svg', to: 'icon.svg' }
    ], {})
  ]
};