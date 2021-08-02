module.exports = class IbaiModule {
  constructor({ chat, modules }) {
    this.chat = chat
    this.modules = modules
    this.events = {
      message: this.onMessage,
    }
    this.timeouts = {}
  }

  async onMessage(data) {
    if (data.message.match(/^[l|i]ba+[l|i]+$/i)) {
      console.log(
        'Banned:',
        data.user,
        `(${1 + Math.log(this.timeouts[data.user]) / Math.log(8)}x)`
      )

      await this.chat.client
        .ban(data.channel, data.user, 'Ibai spam')
        .catch((e) => console.log('oopsie, could not timeout'))
    }
  }
}
