import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mdPlugin, { contentEnum } from 'rollup-plugin-easy-markdown'
import Inspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ Inspect(), mdPlugin({
    metaOptions: [contentEnum.ATTRIBUTES, contentEnum.CREATE_TIME, 
      contentEnum.DESCRIPTION, contentEnum.TITLE, contentEnum.IMAGE],
    outputOptions: [contentEnum.HTML]
  }), vue()],
})
