import { rspack } from '@rspack/core';
import yarcl from '@yarcl/react/rspack';
import { fileURLToPath, URL } from 'node:url';

export default {
  mode: 'production',
  entry: './src/index.js',
  output: { path: fileURLToPath(new URL('./dist/rspack', import.meta.url)), clean: true },
  experiments: { css: true },
  module: { rules: [{ test: /\.css$/i, type: 'css' }] },
  plugins: [yarcl(), new rspack.HtmlRspackPlugin()],
};
