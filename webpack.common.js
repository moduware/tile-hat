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
    modules: [
      path.resolve(__dirname, 'node_modules')
      // path.resolve(__dirname, 'node_modules'),
      // path.resolve(__dirname, 'bower_components')
    ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
    }
  },
  module: {
    rules: [
      {
        // If you see a file that ends in .html, send it to these loaders.
        test: /\.html$/,
        // This is an example of chained loaders in Webpack.
        // Chained loaders run last to first. So it will run
        // polymer-webpack-loader, and hand the output to
        // babel-loader. This let's us transpile JS in our `<script>` elements.
        use: [
          { loader: 'babel-loader' },
          { loader: 'polymer-webpack-loader' }
        ]
      },
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
      template: './src/index.ejs',
      inject: false
    }),
    new CopyWebpackPlugin([
      { from: 'manifest.json', to: 'manifest.json' },
      { from: 'icon.svg', to: 'icon.svg' },
      { 
        from: 'node_modules/webview-tile-header/WebViewTileHeader.js', 
        to: 'node_modules/webview-tile-header/WebViewTileHeader.js'
      },
      { 
        from: 'bower_components/webcomponentsjs/custom-elements-es5-adapter.js', 
        to: 'bower_components/webcomponentsjs/custom-elements-es5-adapter.js'
      },
      { 
        from: 'bower_components/webcomponentsjs/webcomponents-loader.js', 
        to: 'bower_components/webcomponentsjs/webcomponents-loader.js'
      },
      { 
        from: 'bower_components/webcomponentsjs/webcomponents-hi.js', 
        to: 'bower_components/webcomponentsjs/webcomponents-hi.js'
      },
      { 
        from: 'bower_components/webcomponentsjs/webcomponents-hi.js.map', 
        to: 'bower_components/webcomponentsjs/webcomponents-hi.js.map'
      }
    ], {})
  ]
};