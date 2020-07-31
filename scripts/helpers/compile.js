'use strict'

const fs = require('fs')
const path = require('path')
const os = require('os')
const pug = require('pug')

const source = path.join(__dirname, '..', '..', 'src')

/**
 * @param {PathAttrs} file
 * @returns {string}
 */
function getTransformer(file) {
  if (file.isOrg) {
    return ':org(headerOffset=1 exportFromLineNumber=false suppressSubScriptHandling=false suppressAutoLink=false)'
  } else if (file.isMd) {
    return ':marked(gfm=true headerIds=true mangle=true)'
  } else if (file.isPug) {
    return ''
  }
}

/**
 * @param fileName {string}
 * @returns {string}
 */
function read(fileName) {
  return fs.readFileSync(fileName, 'utf-8')
}

/**
 * @param {number} i
 * @returns {function(*): string}
 */
function indent(i) {
  return (line) => line.padStart(line.length + i)
}

/**
 *
 * @param {PathAttrs} file
 * @param {string} transformer
 * @returns {*}
 */
function jsTransform(file, transformer) {
  return pug.render(
    [
      'extends /_layout.pug',
      'block content',
      '  ' + transformer,
      ...read(file.fullPath).split(os.EOL).map(indent(4)),
    ].join(os.EOL),
    {
      basedir: source,
      filename: file.name + file.ext,
    }
  )
}

/**
 * @param {PathAttrs} file
 * @returns {string}
 */
function compile(file) {
  const transformer = getTransformer(file)

  if (transformer === undefined) {
    return fs.readFileSync(file.fullPath, 'utf-8')
  } else {
    return jsTransform(file, transformer)
  }
}

module.exports = {
  compile,
}
