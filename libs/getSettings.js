const { readFileSync } = require('fs')

const config = readFileSync('./settings.conf', 'utf8').split('\n')

const settings = {}
for (let i = 0; i < config.length; i++) {
  const key = config[i]
    .split('=')[0]
    .toLowerCase()
    .replace(/_([a-z])/g, g => g[1].toUpperCase())
  settings[key] = config[i].split('=')[1].replace('\r', '')
}

module.exports = settings