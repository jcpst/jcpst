'use strict'

const fs = require('fs-extra')
const path = require('path')

require('./helpers/colors')
const PathAttrs = require('./helpers/path-attrs')
const { markdownFileToHtml, pugFileToHtml } = require('./helpers/compile')

const projectRoot = path.join(__dirname, '..')
const source = path.join(projectRoot, 'src')
const destination = path.join(projectRoot, 'build')

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
  if (file.isHidden) return

  const outFile = path.join(dest, file.name + '.html')
  const outDir = path.parse(outFile).dir

  fs.ensureDirSync(outDir)

  if (file.isPug) {
    fs.writeFileSync(outFile, pugFileToHtml(file))
  } else if (file.isMd && !file.pugFileExists) {
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

    if (file.isDir) {
      compileFiles(fullPath, path.join(dest, file.name))
    } else {
      convertToStaticResource(file, dest)
    }
  }
}

//=============================================================================
// Copy Files
//=============================================================================
fs.copy(path.join(projectRoot, 'CNAME'), path.join(destination, 'CNAME'))
  .then(() => console.log('>>> copied CNAME'.green))
  .catch(err => console.log('fuck. CNAME copy failed'.red, err))

//=============================================================================
// HTML Build
//=============================================================================

compileFiles(source, destination)
console.log('>>> html files compiled'.green)
