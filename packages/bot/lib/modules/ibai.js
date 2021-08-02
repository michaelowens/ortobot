module.exports = class IbaiModule {
  constructor({ chat }) {
    this.chat = chat
    this.events = {
      message: this.onMessage,
    }
  }

  async onMessage(data) {
    if (data.message.match(/^[l|i]ba+[l|i]+$/i)) {
      console.log('Banned:', data.user)

      await this.chat.client
        .ban(data.channel, data.user, 'Ibai spam')
        .catch((e) => console.log('oopsie, could not timeout'))
    }
  }
}
