module.exports = class PlayModule {
  constructor({ chat }) {
    this.chat = chat
    this.events = {
      message: this.onMessage,
    }
    this.tmpEnabled = false
  }

  async onMessage(data) {
    if (data.isMod) {
      if (data.message === 'noplayon') {
        console.log('No !play allowed')
        this.tmpEnabled = true
      }
      if (data.message === 'noplayoff') {
        console.log('!play allowed')
        this.tmpEnabled = false
      }
    }

    if (!this.tmpEnabled) {
      return
    }

    if (data.message.match(/^!play/i)) {
      this.chat.client.privmsg(data.channel, '/delete ' + data.messageID)
      return
    }
  }
}
