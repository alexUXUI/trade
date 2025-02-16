import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const isDev = import.meta.env.MODE === 'development'

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    favicon: './public/favicon.svg',
    title: 'Trade Simulator',
  },
  server: {
    open: false
  },
  output: {
    assetPrefix: isDev ? 'https://trade-4b3.pages.dev/assets/' : ''
  },
});
