const { ChatClient } = require('dank-twitch-irc')

module.exports = class ChatService {
  constructor({ db, settings }) {
    this.db = db
    this.settings = settings
    this.client = null
  }

  connect() {
    console.log('Connecting to Twitch Chat... Hold on tight!')
    this.client = new ChatClient({
      // username: this.settings.bot.name,
      // password: this.settings.bot.oauth,
    })

    this.client.connect()
    this.client.join(this.settings.bot.channel)

    this.client
      .on('ready', () => console.log('Successfully connected to chat'))
      .on('PRIVMSG', (msg) => {
        console.log(msg.displayName, msg.messageText)
      })
  }
}
