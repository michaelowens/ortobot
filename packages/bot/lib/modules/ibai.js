module.exports = class IbaiModule {
  constructor({ chat }) {
    this.chat = chat
    this.events = {
      message: this.onMessage,
    }
    this.timeouts = {}
  }

  async onMessage(data) {
    if (data.message.match(/^[l|i]ba+[l|i]+$/i)) {
      if (typeof this.timeouts[data.user] === 'undefined') {
        this.timeouts[data.user] = 1
      } else {
        this.timeouts[data.user] += 1
      }

      const ban = this.timeouts[data.user] > 2
      console.log(
        ban ? 'Banned:' : 'Timed out',
        data.user,
        `(${this.timeouts[data.user]}x)`
      )

      if (ban) {
        await this.chat.client
          .ban(data.channel, data.user, 'Ibai spam')
          .catch((e) => console.log('oopsie, could not ban'))

        delete this.timeouts[data.user]
      } else {
        await this.chat.client
          .timeout(data.channel, data.user, 60 * this.timeouts[data.user])
          .catch((e) => console.log('oopsie, could not timeout'))
      }
    }
  }
}
