import { describe, expect, it, expectTypeOf } from "vitest";
import FrontMatter from 'front-matter'
import MarkDownIt from 'markdown-it'
import * as htmlParser from 'htmlparser2'
import testCode from './assets/test.md?raw' // only can run by vitest
import fileUrl from './assets/test.md?url' // only can run by vitest
import { getTitle, getDesc, getImgUrl, Attributes, getFileName } from '../src/index'

const fm = FrontMatter<Attributes>(testCode)
const { attributes = {} } = fm
const html = MarkDownIt({}).render(fm.body)
const root = htmlParser.parseDocument(html)

describe('test md func', () => {

  it('test md import', () => {
    expectTypeOf(testCode).toBeString()
  })
  it('test title', () => {
    const title = getTitle(root)
    expect(title).toContain('vuejs/core')
  })
  it('test desc', () => {
    const desc = getDesc(root)
    expect(desc).toContain('Please follow the documentation at')
    expect(desc).toContain('Vue.js is an MIT-licensed open source project')
  })
  it('test img', () => {
    const imgUrl = getImgUrl(root)
    expect(imgUrl).toEqual('https://img.shields.io/npm/v/vue.svg')
  })
  it('test fileName', () => {
    const fileName = getFileName(fileUrl)
    expect(fileName).toEqual('test')
  })
})

describe('test md metaData', () => {
  it('test meta title', () => {
    expect(attributes.title).toEqual('user define title')
  })
  it('test meta desc', () => {
    expect(attributes.description).toEqual('user define desc')
  })
  it('test meta imgUrl', () => {
    expect(attributes.image).toEqual('user define imgUrl')
  })
  it('test meta createTime', () => {
    expect(attributes.createTime).toEqual('2023-08-20')
  })
})