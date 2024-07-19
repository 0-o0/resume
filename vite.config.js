import fs from 'fs';
import {
  extname,
  resolve,
} from 'path';
import { defineConfig } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import { viteSingleFile } from 'vite-plugin-singlefile';

import { TransformEjs } from './src/lib/vite-plugins';
import { getRenderData } from './src/themes/data';

const dataFilename = process.env.DATA_FILENAME || './resume.json'

const data = require(dataFilename)
const renderData = getRenderData(data)
renderData.theme = process.env.THEME || 'oo'
renderData.isProduction = process.env.NODE_ENV === 'production'
renderData.meta = {
  title: "o_O",
  description: "resume",
  url: "https://o-x.icu",
}

const pdfFiles = fs.readdirSync('public').filter(file => extname(file) === '.pdf')
renderData.pdfURL = '/' + pdfFiles[0]


export default defineConfig({
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      // remove the "Module "fs" has been externalized" warning for ejs
      'fs': './src/lib/fs-polyfill.js',
    },
  },
  plugins: [
    TransformEjs(),
    ViteEjsPlugin(
      renderData,
      {
        ejs: (viteConfig) => ({
          // ejs options goes here.
          views: [resolve(__dirname)],
        })
      }
    ),
    viteSingleFile(),
  ],
})
