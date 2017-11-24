const fs = require('fs')

module.exports = (fileName, transcription) =>
  new Promise((resolve, reject) => {
      fs.writeFile(fileName, transcription, err => {
        if (err) reject(err)
        resolve('Saved transcription.')
      })
    }
  )
