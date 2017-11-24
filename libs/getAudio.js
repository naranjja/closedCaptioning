const ffmpeg = require('fluent-ffmpeg')
const mime = require('mime')
const fs = require('fs')

module.exports = (filePathIn, filePathOut) => new Promise((resolve, reject) => {
  if (!filePathIn || !filePathOut) {
    throw new Error('You must specify a path for both input and output files.')
  }
  if (!fs.existsSync(filePathIn)) {
    throw new Error('Input file must exist.')
  }
  try {
    ffmpeg()
      .input(filePathIn)
      .outputOptions([
        // '-f s16le',
        '-acodec pcm_s16le',
        '-vn',
        '-ac 1',
        '-ar 16k',
        '-map_metadata -1',
      ])
      .save(filePathOut)
      .on('end', () => resolve(filePathOut))
      .on('error', (err) => reject(err))

  } catch (e) {
    reject(e)
  }

})