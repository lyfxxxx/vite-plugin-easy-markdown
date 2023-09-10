# vite-plugin-easy-markdown
本vite插件是一个支持引入markdown格式文件并且能够自动获取列表展示所需的信息的插件。
## 安装
```
npm i -D vite-plugin-easy-markdown
```
## 配置选项
我将插件的转化结果分为了两种：元结果和完整结果。元结果用于列表展示，包括标题、描述、创建时间等等。
```ts
type MetaOptions = contentEnum.TITLE | 
  contentEnum.CREATE_TIME | 
  contentEnum.DESCRIPTION | 
  contentEnum.IMAGE | 
  contentEnum.ATTRIBUTES |
  contentEnum.FILE_NAME
```
完整结果是用于展示整个markdown文件的。目前只支持转化为HTML。
```ts
type OutputOptions = contentEnum.HTML
```
## 使用方式
在/example文件夹下有一个实例以供参考。

最简单的使用方式是不输入任何配置参数，直接调用。这样插件会将所有信息都提供出来，也就是配置选项中的那些。
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
你会得到以下内容：
```js
import md from 'assets/test.md'

console.log(md.html) // <h1>my-title</h1>\n<h2>Install</h2>\n<p><a href=\"http://sindresorhus.com/github-markdown-css\">...
console.log(md.image) // https://lyfxxxx.github.io/syp.github.io/assets/DSCF6605-1.0b4ce2f0.jpg
console.log(md.description) //   Import the github-markdown.css file and add a markdown-body class to the container of your rendered...
```
Plugin will automaticlly get those infos by given logic，but you can assign them in front matter，it has higher priorities.
插件会根据给定的逻辑自动获取上述信息，但是你可以在front matter中指定它们，指定的内容会有更高的优先级。
```md
---
title: titleInFrontmatter
description: desc in front matter
---

# my-title

## Install

[<img src="https://lyfxxxx.github.io/syp.github.io/assets/DSCF6605-1.0b4ce2f0.jpg
" width="300">](http://sindresorhus.com/github-markdown-css)


## Usage

Import the `github-markdown.css` file and add a `markdown-body` class to the container of your rendered Markdown and set a width for it. GitHub uses `980px` width and `45px` padding, and `15px` padding for mobile.
```

你会得到：
```js
import md from 'assets/test.md'

console.log(md.title) // titleInFrontmatter
console.log(md.description) //   desc in front matter
```

当然你也可以自定义你的输入。比如我们可能只需要每个markdown文件的标题：
```js
import mdPlugin, { contentEnum } from 'vite-plugin-easy-markdown'

export default defineConfig({
  plugins: [ mdPlugin({
    metaOptions: [contentEnum.TITLE]
  }) ],
})
```
插件使用markdown-it作为markdown解析器，所以你也可以使用markdown-it的配置。
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

## TypeScript支持
如果是TS项目，你需要将以下内容添加到`d.ts`文件中。
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