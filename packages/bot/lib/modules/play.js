module.exports = class PlayModule {
  constructor({ chat }) {
    this.chat = chat
    this.events = {
      message: this.onMessage,
    }
  }

  async onMessage(data) {
    if (data.message.match(/^!play/i)) {
      this.chat.client.privmsg(data.channel, '/delete ' + data.messageID)
      return
    }
  }
}
