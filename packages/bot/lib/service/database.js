const bluebird = require('bluebird')
const redis = require('redis')

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

module.exports = class Database {
  constructor({ settings }) {
    console.log('Connecting to database')
    return redis.createClient(settings.redis || { url: process.env.REDIS_URL || null })
  }
}
