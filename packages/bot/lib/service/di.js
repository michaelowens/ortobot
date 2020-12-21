const { createContainer, asClass, asFunction, asValue } = require('awilix')
const Chat = require('./chat')
const Database = require('./database')
const Settings = require('./settings')
const Events = require('./events')
const Modules = require('./modules')

module.exports = () => {
  return new Promise((resolve, reject) => {
    const container = createContainer()
    container.register({
      chat: asClass(Chat).singleton(),
      db: asClass(Database).singleton(),
      settings: asValue(Settings),
      events: asClass(Events).singleton(),
      modules: asClass(Modules).singleton(),
      di: asValue(container),
    })

    // TODO: move this initialization somewhere else?
    container
      .resolve('db')
      .on('connect', async () => {
        console.log('Successfully connected to database')
        await container.resolve('modules')
        resolve(container)
      })
      .on('error', () => {
        reject(e)
      })
  })
}
