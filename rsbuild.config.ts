import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

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
    assetPrefix: process.env.NODE_ENV === 'production'
      ? 'https://trade-4b3.pages.dev/'
      : undefined
  },
});
