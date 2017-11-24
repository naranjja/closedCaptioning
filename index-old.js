const settings = require('./libs/getSettings')

const getAudio = require('./libs/getAudio')
const storeAudio = require('./libs/storeAudio')
const getTranscription = require('./libs/getTranscription')
const saveTranscription = require('./libs/saveTranscription')

const path = require('path')

try {

  const params = {
    input: './input/input.mp4',
    output: './output/output.wav',
  }

  Promise.resolve(params)
    .then(paths => {
      console.log(
        `Converting ${path.basename(paths.input)} to ${path.basename(
          paths.output)}...`)
      return getAudio(paths.input, paths.output)
    })
    .then(wavFile => {
      console.log(`Storing ${path.basename(wavFile)}...`)
      return storeAudio(wavFile)
    })
    .then(storageFile => {
      console.log(`Transcribing ${storageFile.name}...`)
      return getTranscription(`gs://${settings.bucketName}/${storageFile.name}`)
    })
    .then(transcription => saveTranscription(transcription))
    .then(result => console.log(result))
    .catch(err => console.error(err))

} catch (err) {
  console.error(err)
}