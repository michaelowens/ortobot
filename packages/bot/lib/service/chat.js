const { ChatClient, PrivmsgMessage } = require('dank-twitch-irc')

module.exports = class ChatService {
  constructor({ db, settings, events }) {
    this.db = db
    this.settings = settings
    this.events = events
    this.client = null
  }

  /**
   * Connect to Twitch chat servers
   */
  connect() {
    console.log('Connecting to Twitch Chat... Hold on tight!')
    // return
    this.client = new ChatClient(
      this.settings.bot.name
        ? {
            username: this.settings.bot.name,
            password: this.settings.bot.oauth,
          }
        : {}
    )

    this.client.connect()
    this.client.join(this.settings.bot.channel)

    this.client
      .on('ready', () => {
        console.log('Successfully connected to chat')
        this.updateMods()
      })
      .on('PRIVMSG', (msg) => {
        if (msg.senderUsername === this.settings.bot.name.toLowerCase()) {
          return
        }
        this.handleMessage(msg)
      })
  }

  async updateMods(timer = true) {
    const mods = await this.client.getMods(this.settings.bot.channel)
    mods.push(this.settings.bot.channel)

    // TODO: clear the modlist
    const multi = this.db.multi()
    multi.del('mods')
    mods.forEach(mod => multi.rpush('mods', mod))

    multi.exec((err, res) => {
      if (err) {
        return console.log('Error while updating mods:', err)
      }

      console.log('Updated mod list')
    })


    if (timer) {
      setTimeout(() => this.updateMods(), 12 * 60 * 60 * 1000)
    }
  }

  /**
   * Handle incoming chat messages from twitch
   *
   * @param {PrivmsgMessage} msg
   */
  handleMessage(msg) {
    // console.log(msg.displayName, msg.messageText)

    const data = {
      command: null,
      channel: msg.channelName,
      message: msg.messageText,
      messageID: msg.messageID,
      user: msg.senderUsername,
      displayName: msg.displayName, // new User()
      isMod: msg.isMod,
    }
    this.events.emit('message', data)

    // TODO: add event for commands? Will we support commands?
  }
}
