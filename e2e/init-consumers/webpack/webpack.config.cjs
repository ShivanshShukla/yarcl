const path = require('node:path');

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: { path: path.resolve(__dirname, 'dist'), clean: true },
  experiments: { css: true },
  module: { rules: [{ test: /\.css$/i, type: 'css' }] },
  plugins: [],
};
