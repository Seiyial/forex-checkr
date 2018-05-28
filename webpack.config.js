const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const outputDir = 'dist'
module.exports = {
  entry: './src/client/index.js',
  output: {
    path: path.resolve(__dirname, outputDir),
    filename: 'bundle.js' // html-webpack-plugin depends on this
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    port: 5000,
    open: true,
    proxy: {
      '/api': 'http://localhost:5001'
    }
  },
  plugins: [
    new CleanWebpackPlugin([outputDir]),
    new HtmlWebpackPlugin({
      template: './public/index.html'
      // favicon: './public/favicon.ico'
    })
  ],
  node: {
    fs: 'empty'
  }
};
