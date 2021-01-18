// This will take care of preparing modules
// TODO: handle configuration changes (redis PUB/SUB)

const { Lifetime } = require('awilix')

module.exports = class ModulesService {
  constructor({ settings, di, events, db, pubsub }) {
    this.events = events
    this.settings = settings
    this.container = di
    this.db = db
    this.pubsub = pubsub
    this.boundModules = []

    this.loadModules()
    this.initPubSub()
  }

  initPubSub() {
    this.pubsub.subscribe('modules')
    this.pubsub.on('message', this.onPubSubMessage.bind(this))
  }

  onPubSubMessage(channel, msg) {
    if (channel !== 'modules') return
    const data = JSON.parse(msg)
    if (!data || !('name' in data)) return

    const modName = data.name + 'Module'
    try {
      const mod = this.container.resolve(modName)
      if (data.enabled) {
        this.enableModule(mod)
      } else {
        this.disableModule(mod)
      }
    } catch (e) {
      console.error(e)
    }
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
      let shortName = name.slice(0, -6)
      this.db.hget('module:status', shortName, (err, status) => {
        const mod = this.container.resolve(name)
        if (status && status === 'true') {
          this.enableModule(mod)
        } else {
          this.db.hmset('module:status', [shortName, false])
        }
      })
    }
  }

  has(name) {
    return this.container.has(name)
  }

  enableModule(mod) {
    if (mod.enabled) return
    // Bind each event to the current class instance
    // This will allow us to add event handlers without .bind(this)
    for (let event in mod.events) {
      if (!this.boundModules.includes(mod.constructor.name)) {
        mod.events[event] = mod.events[event].bind(mod)
        this.boundModules.push(mod.constructor.name)
      }
      this.events.on(event, mod.events[event])
    }

    mod.enabled = true
    console.log(mod.constructor.name, 'enabled')
  }

  disableModule(mod) {
    if (!mod.enabled) return
    for (let event in mod.events) {
      this.events.off(event, mod.events[event])
    }

    mod.enabled = false
    console.log(mod.constructor.name, 'disabled')
  }
}
