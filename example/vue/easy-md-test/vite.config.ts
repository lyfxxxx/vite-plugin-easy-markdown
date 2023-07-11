import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mdPlugin, { contentEnum } from 'rollup-plugin-easy-markdown'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), mdPlugin({
    metaOptions: [contentEnum.ATTRIBUTES, contentEnum.CREATE_TIME, 
      contentEnum.DESCRIPTION, contentEnum.TITLE, contentEnum.IMAGE],
    outputOptions: [contentEnum.HTML]
  })],
})
