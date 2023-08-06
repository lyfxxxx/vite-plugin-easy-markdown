/// <reference types="vite/client" />

declare module '*.vue' {
  import { defineComponent } from 'vue'
  const Component: ReturnType<typeof defineComponent>
  export default Component
}

declare module "*.md" {
  const html: string
  const attributes: string
  const title: string
  const description: string
  const createTime: string
  const fileName: string
  export default { html, attributes, title, description, createTime, fileName };
}