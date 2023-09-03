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

The most simple way is using its default config by not config anything. It will provide everything which is mentioned in Config Options chapter.
```js
import mdPlugin from 'vite-plugin-easy-markdown'

export default defineConfig({
  plugins: [ mdPlugin() ],
})
```

```markdown
# my-title

## Install

[<img src="https://lyfxxxx.github.io/syp.github.io/assets/DSCF6605-1.0b4ce2f0.jpg
" width="300">](http://sindresorhus.com/github-markdown-css)


## Usage

Import the `github-markdown.css` file and add a `markdown-body` class to the container of your rendered Markdown and set a width for it. GitHub uses `980px` width and `45px` padding, and `15px` padding for mobile.
```
you will get:
```js
import md from 'assets/test.md'

console.log(md.html) // <h1>my-title</h1>\n<h2>Install</h2>\n<p><a href=\"http://sindresorhus.com/github-markdown-css\">...
console.log(md.image) // https://lyfxxxx.github.io/syp.github.io/assets/DSCF6605-1.0b4ce2f0.jpg
console.log(md.description) //   Import the github-markdown.css file and add a markdown-body class to the container of your rendered...
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