const settings = require('./getSettings')
const speech = require('@google-cloud/speech')

const client = new speech.SpeechClient({
  projectId: settings.projectId,
  keyFilename: './service-account.json',
})

const config = {
  encoding: 'LINEAR16',
  sampleRateHertz: 16000,
  languageCode: 'es-ES',  // TODO: Prompt for language
}

module.exports = fileName =>
  new Promise((resolve, reject) => {
      const request = {
        config,
        audio: { uri: fileName }
      }
      client
        .longRunningRecognize(request)
        .then(data => {
          const operation = data[0]
          return operation.promise()
        })
        .then(data => {
          const response = data[0]
          const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n')
          resolve(transcription)
        })
        .catch(err => reject(err))
    }
  )