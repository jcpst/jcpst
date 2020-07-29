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
 *   isDir: boolean,
 *   isHidden: boolean,
 *   isPug: boolean,
 *   isMd: boolean,
 *   isOrg: boolean,
 *   pugFileExists: boolean
 * }}
 */
const PathAttrs = {
  init(fullpath) {
    Object.assign(this, path.parse(fullpath))
    this.fullPath = fullpath
    this.isDir = fs.lstatSync(this.fullPath).isDirectory()
    this.isHidden = this.name[0] === '_'
    this.isPug = this.ext.match(/\.(jade|pug)/) !== null
    this.isMd = this.ext.match(/\.(md|markdown)/) !== null
    this.isOrg = this.ext.match(/\.(org)/) !== null
    this.pugFileExists = fs.existsSync(path.join(this.dir, this.name + '.pug'))
    return this
  }
}

module.exports = PathAttrs
