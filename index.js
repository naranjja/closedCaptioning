const fs = require('fs')

const settings = require('./libs/getSettings')

const demux = require('./libs/demuxVideo')
const upload = require('./libs/uploadFile')
const transcribe = require('./libs/transcribeAudio')
const save = require('./libs/saveTranscription')

const inputFolder = './input'
const outputFolder = './output'

fs.readdirAsync = dirname => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, (err, filenames) => {
      if (err) reject(err)
      else resolve(filenames)
    })
  })
}

const makeParams = filename => {
  return {
    video: `${inputFolder}/${filename}`,
    audio: `${outputFolder}/${filename.replace(/\.(.+)/g, '.wav')}`,
    transcript: `${outputFolder}/${filename.replace(/\.(.+)/g, '.txt')}`
  }
}

const isVideo = filename => filename.match(/.+\.mp4/g)

fs.readdirAsync(inputFolder)
  .then(filenames => {
    filenames = filenames.filter(isVideo)
    return Promise.all(filenames.map(makeParams))
  })
  .then(paramsList => {
    paramsList.forEach(params => {
      Promise.resolve(params)
        .then(() => {
          console.log(params.video)
        })
        .then(() => {
          console.log('Extracting audio...')
          return demux(params.video, params.audio)
        })
        .then(audioFile => {
          console.log('Uploading audio...')
          return upload(audioFile)
        })
        .then(object => {
          console.log('Transcribing audio...')
          return transcribe(`gs://${settings.bucketName}/${object.name}`)
        })
        .then(transcription => {
          console.log('Saving transcription...')
          return save(params.transcript, transcription)
        })
        .then(result => console.log(result))
        .catch(err => console.error(err))
    })
  })
  .catch(err => console.error(err))

