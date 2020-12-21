const fs = require('fs')
const extend = require('extend')

let options = {}
let defaults = {
  bot: {
    name: 'xikbot',
    oauth: 'oauth:',
    channel: 'xikeon',
  },
  modules: ['ibai'],
}

let optionsFile = {}
try {
  optionsFile = JSON.parse(fs.readFileSync('settings.json'))
} catch (e) {
  console.log('Could not find or open settings.json file')
}

options = extend(true, {}, defaults, optionsFile)

module.exports = options
