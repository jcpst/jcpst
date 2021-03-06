'use strict'

const fs = require('fs')
const path = require('path')
const os = require('os')
const pug = require('pug')
const marked = require('jstransformer-marked').render

const source = path.join(__dirname, '..', '..', 'src')


/**
 * @function fileLines
 * @param fileName {string}
 * @returns {string[]}
 */
function fileLines(fileName) {
  return fs.readFileSync(fileName, 'utf-8').split(os.EOL)
}

/**
 * @function pugFileToHtml
 * @param file {PathAttrs}
 * @returns {String}
 */
function pugFileToHtml(file) {
  return pug.renderFile(file.fullPath, {
    filename: file.name,
    filters: {
      marked
    }
  })
}

/**
 * @function markdownFileToHtml
 * @param file {PathAttrs}
 * @returns {String}
 */
function markdownFileToHtml(file) {
  const ext = 'md'
  const transformString = 'marked(gfm=true headerIds=true mangle=true)'
  return jsTransform(file, ext, transformString)
}

function orgFileToHtml(file) {
  const ext = 'org'
  const transformString = 'org'
  return jsTransform(file, ext, transformString)
}

function jsTransform(file, ext, transformString) {
  return pug.render(
    [
      'extends /_layout.pug',
      'block content',
	  '  :' + transformString,
      ...fileLines(file.fullPath).map(l => l.padStart(l.length + 4))
    ].join(os.EOL),
    {
      basedir: source,
      filename: file.name + ext,
      filters: {
        marked
      }
    }
  )
}

module.exports = {
  markdownFileToHtml,
  pugFileToHtml,
  orgFileToHtml
}
