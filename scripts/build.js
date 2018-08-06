'use strict'

const fs = require('fs-extra')
const path = require('path')
const purify = require('purify-css')

// Hack to require css. From here: https://stackoverflow.com/a/12753026/3957261
require.extensions['.css'] = (m, f) => { m.exports = fs.readFileSync(f, 'utf8') }
const w3Css = require('w3-css')

require('./helpers/colors')
const PathAttrs = require('./helpers/path-attrs')
const { markdownFileToHtml, pugFileToHtml } = require('./helpers/compile')

const source = path.join(__dirname, '..', 'src')
const destination = path.join(__dirname, '..', 'build')
const styleFile = path.join(destination, 'style.css')

/**
 * This function is reponsible for calling compilers and writing the results to
 * disc. It skips hidden files, which start with an underscore (_). If the file
 * is not a file we care about compiling, will copy it with no transformation.
 *
 * @function convertToStaticResource
 * @param file {PathAttrs} - Object that contains file metadata.
 * @param dest {string} - Path to the destination directory.
 */
function convertToStaticResource(file, dest) {
  if (file.isHidden()) return

  const outFile = path.join(dest, file.name + '.html')
  const outDir = path.parse(outFile).dir

  fs.ensureDirSync(outDir)

  if (file.isPug()) {
    fs.writeFileSync(outFile, pugFileToHtml(file))
  } else if (file.isMd() && !file.pugFileExists()) {
    fs.writeFileSync(outFile, markdownFileToHtml(file))
  } else {
    fs.copySync(file.fullPath, path.join(dest, file.base))
  }
}

/**
 * Recursively iterates through the contents of the source directory, calling
 * the function responsible for compiling/writing/coping files to the
 * destination directory.
 *
 * @function compileFiles
 * @param src {string} - Path to the source directory.
 * @param dest {string} - Path to the destination directory.
 */
function compileFiles(src, dest) {
  const srcDirFiles = fs.readdirSync(src)
  let i = srcDirFiles.length

  while (i--) {
    const fullPath = path.join(src, srcDirFiles[i])
    const file = Object.create(PathAttrs).init(fullPath)

    if (file.isDir()) {
      compileFiles(fullPath, path.join(dest, file.name))
    } else {
      convertToStaticResource(file, dest)
    }
  }
}

//=============================================================================
// HTML Build
//=============================================================================

compileFiles(source, destination)
console.log('>>> html files compiled'.green)

//=============================================================================
// CSS Build
//=============================================================================

purify(['./build/**/*.html'], w3Css, {
  minify: true,
  output: styleFile
})
console.log('>>> css purified'.green)
