// TODO: Update to latest API syntax

const settings = require('./getSettings')
const speech = require('@google-cloud/speech')

const client = new speech.SpeechClient({
  projectId: settings.projectId,
  keyFilename: './service-account.json',
})

const options = {
  'languageCode': 'en-PE',
  'sampleRate': 16600,
  'encoding': 'LINEAR16',
}

module.exports = fileName =>
  new Promise((resolve, reject) => {
      speechClient.startRecognition(fileName, options, (err, operation) => {
        if (err) return reject(err)
        operation
          .on('error', err => reject(err))
          .on('complete', results => resolve(results))
      })
    },
  )