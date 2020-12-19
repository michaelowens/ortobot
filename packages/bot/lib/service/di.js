const { createContainer, asClass, asFunction, asValue } = require('awilix')
const Chat = require('./chat')
const Database = require('./database')
const Settings = require('./settings')

module.exports = () => {
  return new Promise((resolve, reject) => {
    const container = createContainer()
    container.register({
      chat: asClass(Chat).singleton(),
      db: asClass(Database).singleton(),
      settings: asValue(Settings),
    })

    container
      .resolve('db')
      .on('connect', () => {
        console.log('Successfully connected to database')
        resolve(container)
      })
      .on('error', () => {
        reject(e)
      })
  })
}
