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
      .on('ready', () => console.log('Successfully connected to chat'))
      .on('PRIVMSG', (msg) => {
        if (msg.senderUsername === this.settings.bot.name.toLowerCase()) {
          return
        }
        this.handleMessage(msg)
      })
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
      user: msg.senderUsername,
      displayName: msg.displayName, // new User()
    }
    this.events.emit('message', data)

    // TODO: add event for commands? Will we support commands?
  }
}
