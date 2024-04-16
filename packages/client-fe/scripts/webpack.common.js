/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const fs = require('fs');

const entrys = fs.readdirSync(path.join(__dirname, '../src'));
console.log('entrys: ', entrys);
const entry = {};
entrys.forEach((k) => {
  entry[k] = './src/' + k + '/index.ts';
});

module.exports = {
  context: path.resolve('__dirname', '../'),
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
  },
  entry,
  plugins: [new CleanWebpackPlugin()],
  output: {
    filename: '[name].js',
    path: path.join(__dirname + '../../../server/views/static/js'),
  },
  module: {
    rules: [
      // {
      //   test: /\.css$/,
      //   use: ['css-loader'],
      // },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },
};
