// 100% of the code in this file was written by us. 0% was imported.

const webpack = require('webpack');
const path = require('path');

const config = {
  entry: './app.js',
  output: { path: __dirname, filename: 'bundle.js' },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
          plugins: ['transform-class-properties']
        }
      },
       {
         test: /\.css$/, loader: "style-loader!css-loader"
       }
    ]
  },
  devServer: {
   proxy: {
     '/api/**': {
       target: 'http://localhost:3000',
       secure: false
     }
   }
 }
};

module.exports = config;
