const fs = require('fs')
const extend = require('extend')

let options = {}
let defaults = {
  bot: {
    name: process.env.TWITCH_USERNAME || 'xikbot',
    oauth: process.env.TWITCH_OAUTH || 'oauth:',
    channel: process.env.TWITCH_CHANNEL || 'xikeon',
  },
  modules: ['ibai', 'play'],
}

let optionsFile = {}
try {
  optionsFile = JSON.parse(fs.readFileSync('settings.json'))
} catch (e) {
  console.log('Could not find or open settings.json file')
}

options = extend(true, {}, defaults, optionsFile)

module.exports = options
