require('dotenv').config()
const initDI = require('./service/di')

module.exports = bot

async function bot(opts) {
  const container = await initDI()
  return container.resolve('chat')
}

if (require.main === module) {
  bot()
    .then((b) => b.connect())
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
}
