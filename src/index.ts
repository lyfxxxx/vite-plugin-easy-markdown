import MarkDownIt from 'markdown-it'
import { TransformResult } from 'rollup'
import { Plugin } from 'vite'
import { createFilter } from 'rollup-pluginutils'
import FrontMatter from 'front-matter'
import * as htmlParser from 'htmlparser2'
import { Element, Document } from 'domhandler'
import { filter, textContent, findOne } from 'domutils'

export enum contentEnum {
  TITLE = 'title',
  DESCRIPTION = 'description',
  CREATE_TIME = 'createTime',
  IMAGE = 'image',
  FILE_NAME = 'fileName',
  ATTRIBUTES = 'attributes',
  HTML = 'html'
}

declare type FilterType = Array<string | RegExp> | string | RegExp | null

declare interface Attributes {
  [contentEnum.TITLE]?: string,
  [contentEnum.DESCRIPTION]?: string,
  [contentEnum.CREATE_TIME]?: string,
  [contentEnum.IMAGE]?: string,
}

type MetaOptions = contentEnum.TITLE | 
  contentEnum.CREATE_TIME | 
  contentEnum.DESCRIPTION | 
  contentEnum.IMAGE | 
  contentEnum.ATTRIBUTES |
  contentEnum.FILE_NAME

type OutputOptions = contentEnum.HTML

export interface TotalOptions {
  metaOptions?: MetaOptions[],
  outputOptions?: OutputOptions[],
  markdownItOptions?: MarkDownIt.Options,
  include?: FilterType,
  exclude?: FilterType,
}

/**
 * try to get the highest level node of <h*> tagm return its text content as the title of markdown file.
 * @param rootNode root node of transformed html file
 * @returns the text of the highest level <h*>tag node
 */
const getTitle = (rootNode: Document): string => {
  const resTitle = {
    level: 999,
    value: '',
  }
  const titleList = filter((ele) => ele instanceof Element && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(ele.tagName), rootNode) as Element[]

  // Find the highest level and the first <h*> tag
  titleList.forEach((ele) => {
    const curLevel = Number(ele.tagName.replace('h', ''))
    resTitle.value = curLevel > resTitle.level ? resTitle.value : textContent(ele)
    resTitle.level = curLevel > resTitle.level ? resTitle.level : curLevel
  })
  return resTitle.value
}

/**
 * get all p tag nodes, collect their text content as markdown file's description.
 * @param rootNode root node of transformed html file
 * @param desLength max length of descrption
 * @returns description
 */
const getDesc = (rootNode: Document, desLength: number = 100): string => {
  let res = ''
  const pList = filter((ele) => ele instanceof Element && ['p'].includes(ele.tagName), rootNode) as Element[]

  pList.forEach((ele) => {
    const curText = textContent(ele) || ''
    if (res.length + curText.length <= desLength) {
      res = `${res}${curText}`
    }
  })
  return `${res}...`
}

/**
 * get src of the first img tag
 * @param rootNode root node of transformed html file
 * @returns image url
 */
const getImgUrl = (rootNode: Document): string => {
  const imageNode = findOne((ele) => ele instanceof Element && ['img'].includes(ele.tagName), rootNode.childNodes)
  return imageNode?.attribs.src || ''
}

/**
 * 
 * @param id 
 * @returns 
 */
const getFileName = (id: string): string => {
  const fileNameReg = /(?<=\/)\w+(?=\.)/g
  const fileName = (id.match(fileNameReg) || [])[0] || ''
  return fileName
}

class RecoderFactory {
  allowKeys: string[]
  usedKeys: string[]
  result: string

  constructor(metaOptions: MetaOptions[], outputOptions: OutputOptions[]) {
    this.allowKeys = [...metaOptions, ...outputOptions]
    this.usedKeys = []
    this.result = ''
  }
  add(key: string, value: string) {
    if (this.allowKeys.includes(key)) {
      this.result = `${this.result}export const ${key} = ${JSON.stringify(value)}\n`
      this.usedKeys.push(key)
    }
  }
  addTotal(data: {[x: string]: string}) {
    for (const key in data) {
      this.add(key, data[key])
    }
  }
  export() {
    return `${this.result}export default {${this.usedKeys.join(',')}}`
  }
}

const transformFunc = (code: string, id: string, options?: TotalOptions): TransformResult => {
  const { metaOptions = [], outputOptions = [], markdownItOptions = {}, include = /\.md$/, exclude = null } = options || {}
  const filter = createFilter(include, exclude)
  // judge if need to transform
  if (!filter(id)) {
    return null
  }
  const recorder = new RecoderFactory(metaOptions, outputOptions)
  const fm = FrontMatter<Attributes>(code)
  const { attributes = {} } = fm;
  
  const html = MarkDownIt(markdownItOptions).render(fm.body)
  recorder.add(contentEnum.HTML, html)
  const { title = '', description = '', image = '', createTime = '' } = fm.attributes
  const root = htmlParser.parseDocument(html)
  recorder.addTotal({
    [contentEnum.ATTRIBUTES]: JSON.stringify(attributes),
    [contentEnum.IMAGE]: image || getImgUrl(root),
    [contentEnum.TITLE]: title || getTitle(root),
    [contentEnum.DESCRIPTION]: description || getDesc(root),
    [contentEnum.CREATE_TIME]: createTime,
    [contentEnum.FILE_NAME]: getFileName(id),
  })
  return {
    code: recorder.export()
  }
}

export default function plugin(options: TotalOptions): Plugin {
  return {
    name: 'rollup-plugin-easy-markdown',
    transform(code: string, id: string) {
      return transformFunc(code, id, options)
    }
  }
}