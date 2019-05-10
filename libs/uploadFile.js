const settings = require('./getSettings')
const {Storage} = require('@google-cloud/storage');

const gcs = new Storage({
  projectId: settings.projectId,
  keyFilename: './service-account.json',
})

const bucket = gcs.bucket(settings.bucketName)

module.exports = filePath => new Promise((resolve, reject) =>
  bucket.upload(filePath, (err, file) => {
    if (err) reject(err)
    else resolve(file)
  })
)