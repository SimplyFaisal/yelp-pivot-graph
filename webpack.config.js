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
      }
    ]
  },
  devServer: {
   proxy: {
     '/api/**': {
       target: 'http://localhost:3000',
       secure: false
    //    bypass: function(req, res, proxyOptions) {
    //      console.log(req);
    //       if (req.headers.accept.indexOf('html') !== -1) {
    //         console.log('Skipping proxy for browser request.');
    //         return '/index.html';
    //       }
    //     }
     }
   }
 }
};

module.exports = config;
