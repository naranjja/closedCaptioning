const { get } = require('http')
const { Extract } = require('unzip')
const { spawn } = require('child_process')
const { join, resolve } = require('path')
const glob = require('glob')

const fs = require('fs')

const zipName = 'ffmpeg.zip'
const unzipName = 'release/'
const outputFolder = './ffmpeg/'

const updatePath = (path, callback) => {
  glob(join(path, '/*'), (er, matches) => {
    spawn('setx', [
      'FFMPEG_PATH',
      resolve(matches[0], 'bin', 'ffmpeg.exe'),
    ])
    spawn('setx', [
      'FFPROBE_PATH',
      resolve(matches[0], 'bin', 'ffprobe.exe'),
    ])
    callback()
  })
}

const downloadFile = (path, callback) => {
  const writeStream = fs.createWriteStream(path)
  get(
    'http://ffmpeg.zeranoe.com/builds/win64/static/ffmpeg-20171123-a60b242-win64-static.zip',
    response => {
      response.pipe(writeStream)
      response.on('end', () => callback())
    })
}

const unzipFile = (path, callback) => {
  fs.createReadStream(path)
    .pipe(Extract({ path: join(outputFolder, unzipName) }))
    .on('finish', () => callback())
}

if (fs.existsSync(join(outputFolder, zipName))) {
  console.log('Cached file found.')
  if (!fs.existsSync(join(outputFolder, unzipName))) {
    console.log('Installing...')
    unzipFile(join(outputFolder, zipName), () => {
      updatePath(resolve(__dirname, '..', outputFolder, unzipName), () => {
        console.log('FFMPEG correctly installed.')
      })
    })
  } else {
    updatePath(resolve(__dirname, '..', outputFolder, unzipName), () => {
        console.log('FFMPEG already installed.')
      })
  }
} else {
  console.log('No cache file found. Downloading...')
  downloadFile(join(outputFolder, zipName), () => {
    console.log('Finished downloading!')
    unzipFile(join(outputFolder, zipName), () => {
      updatePath(resolve(__dirname, '..', outputFolder, unzipName), () => {
        console.log('FFMPEG correctly installed.')
      })
    })
  })
}
