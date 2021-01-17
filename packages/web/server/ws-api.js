const redis = require('redis')
const subscriber = redis.createClient({ url: process.env.REDIS_URL || null });

module.exports = (io) => {
  subscriber.on('message', (channel, msg) => {
    if (channel !== 'modules') return
    const data = JSON.parse(msg)
    io.emit('module:status', data)
  })
  subscriber.subscribe('modules')

  // TODO: add auth token verification
  io.on('connection', socket => {
    console.log('got socket connection')
  })
}