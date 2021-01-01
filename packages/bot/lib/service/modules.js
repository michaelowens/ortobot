// This will take care of preparing modules
// TODO: handle configuration changes (redis PUB/SUB)

const { Lifetime } = require('awilix')

module.exports = class ModulesService {
  constructor({ settings, di, events }) {
    this.events = events
    this.settings = settings
    this.container = di

    this.loadModules()
  }

  async loadModules() {
    console.log(`Loading modules: ${this.settings.modules}`)

    await this.container.loadModules(
      [['./lib/modules/*.js', Lifetime.SCOPED]],
      {
        resolverOptions: {
          lifetime: Lifetime.SINGLETON,
        },
        formatName: (name) => {
          return name + 'Module'
        },
      }
    )

    // TODO: Find a nicer way to initialize modules
    for (let name of this.container.cradle) {
      if (!name.endsWith('Module')) continue
      const mod = this.container.resolve(name)
      this.enableModule(mod)
      console.log(mod.constructor.name, 'loaded!')
    }
  }

  has(name) {
    return this.container.has(name)
  }

  enableModule(mod) {
    // Bind each event to the current class instance
    // This will allow us to add event handlers without .bind(this)
    // TODO: should not do this again when re-enabling modules
    for (let event in mod.events) {
      mod.events[event] = mod.events[event].bind(mod)
      this.events.on(event, mod.events[event])
    }

    mod.enabled = true
  }

  disableModule(mod) {
    for (let event in mod.events) {
      this.events.off(event, mod.events[event])
    }

    mod.enabled = false
  }
}
