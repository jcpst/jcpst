'use strict'

const fs = require('fs-extra')
const path = require('path')

/**
 * @name PathAttrs
 * @type {{
 *   init(string): PathAttrs,
 *   fullPath: string
 *   root: string,
 *   dir: string,
 *   base: string,
 *   ext: string,
 *   name: string,
 *   isDir(): boolean,
 *   isHidden(): boolean,
 *   isPug(): boolean,
 *   isMd(): boolean,
 *   pugFileExists(): boolean
 * }}
 */
const PathAttrs = {
  init(fullpath) {
    this.fullPath = fullpath
    Object.assign(this, path.parse(fullpath))
    return this
  },
  isDir() {
    return fs.lstatSync(this.fullPath).isDirectory()
  },
  isHidden() {
    return this.name[0] === '_'
  },
  isPug() {
    return this.ext.match(/\.(jade|pug)/) !== null
  },
  isMd() {
    return this.ext.match(/\.(md|markdown)/) !== null
  },
  pugFileExists() {
    return fs.existsSync(path.join(this.dir, this.name + '.pug'))
  }
}

module.exports = PathAttrs
