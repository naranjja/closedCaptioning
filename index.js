const linear16 = require('./libs/getAudio')
const cloudStore = require('./libs/storeAudio')
// const cloudSpeech = require('./libs/getTranscription')

const path = require('path')
const chalk = require('chalk')

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
      return linear16(paths.input, paths.output)
    })
    .then(wavFile => {
      console.log(`Storing ${path.basename(wavFile)}...`)
      return cloudStore(wavFile)
    })
//     .then(storageFile => {
//       countdown.message(`Transcribing ${storageFile.name}...`)
//       return cloudSpeech('gs://messages-audio/' + storageFile.name)
//     })
//     .then(transcription => {
//       countdown.stop()
//       console.log(chalk.green(transcription))
//     })
    .catch(err => console.error(err))
//
} catch (err) {
  console.log(chalk.red(err.message))
  console.error(err)
}