# vite-plugin-easy-markdown
A vite project plugin to import Markdown file and automaticlly get its abbreviated info for list display.
## Setup
```
npm i -D vite-plugin-easy-markdown
```
## Config Options
I divide transform results into two categories: meta result and complete result. The previous one is for list display, such as title, description, createTime, etc.
```ts
type MetaOptions = contentEnum.TITLE | 
  contentEnum.CREATE_TIME | 
  contentEnum.DESCRIPTION | 
  contentEnum.IMAGE | 
  contentEnum.ATTRIBUTES |
  contentEnum.FILE_NAME
```
The complete result is for display the whole markdown file. For now it's only support HTML.

```ts
type OutputOptions = contentEnum.HTML
```
## Usage
There is an example you could refer in /example fold.

The most simple way is using its default config by not config anything. It will provide everything which is mentioned in Options.
```js
import mdPlugin from 'vite-plugin-easy-markdown'

export default defineConfig({
  plugins: [ mdPlugin() ],
})
```

Of course you could customise your output. For example, we may don't need anything but title.
```js
import mdPlugin, { contentEnum } from 'vite-plugin-easy-markdown'

export default defineConfig({
  plugins: [ mdPlugin({
    metaOptions: [contentEnum.TITLE]
  }) ],
})
```
The plugin uses markdown-it as its markdown parser, so you also can add markdown-it config.
```js
import mdPlugin, { contentEnum } from 'vite-plugin-easy-markdown'
import hljs from 'highlight.js'

export default defineConfig({
  plugins: [ mdPlugin({
    metaOptions: [contentEnum.TITLE],
    markdownItOptions: {
      highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(str, { language: lang }).value
          } catch (e) {
            console.log(e)
          }
        }
        return '' // use external default escaping
      }
    }
  }) ],
})
```

## TypeScript Support
For TS project, you need to add below typedefs to your `d.ts` file.
```typescript
declare module "*.md" {
  const html: string
  const attributes: string
  const title: string
  const description: string
  const createTime: string
  const fileName: string
  const image: string
  export default { html, attributes, title, description, createTime, fileName, image };
}
```

## License
MIT