const redis = require('redis')

module.exports = class Database {
  constructor() {
    console.log('Connecting to database (pubsub)')
    return redis.createClient({ url: process.env.REDIS_URL || null })
  }
}
