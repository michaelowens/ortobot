module.exports = class IbaiModule {
  constructor({ chat, modules }) {
    this.chat = chat
    this.modules = modules
    this.events = {
      message: this.onMessage,
    }
    this.timeouts = {} // TODO: move to database
    console.log('IbaiModule loaded!')
    // console.log('Has module?', modules.has('ibaiModule'))
    // console.log('Has module?', modules.has('something'))
  }

  async onMessage(data) {
    if (data.message.match(/^[l|i]ba+[l|i]+$/i)) {
      if (typeof this.timeouts[data.user] === 'undefined') {
        this.timeouts[data.user] = 1
      } else {
        this.timeouts[data.user] *= 8
      }

      console.log(
        'Timed out:',
        data.user,
        `(${1 + Math.log(this.timeouts[data.user]) / Math.log(8)}x)`
      )

      await this.chat.client
        .timeout(data.channel, data.user, 60 * this.timeouts[data.user])
        .catch((e) => console.log('oopsie, could not timeout'))
    }
  }
}
