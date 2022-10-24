const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    library: 'UtilLibrary',
    path: path.resolve(__dirname, 'dist'),
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
 }
};