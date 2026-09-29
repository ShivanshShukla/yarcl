const path = require('node:path');
const yarcl = require('@yarcl/react/webpack');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: { path: path.resolve(__dirname, 'dist/webpack'), clean: true },
  experiments: { css: true },
  module: { rules: [{ test: /\.css$/i, type: 'css' }] },
  plugins: [yarcl()],
};
