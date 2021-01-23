const got = require('got')

module.exports = class CapsModule {
  constructor({ chat }) {
    this.chat = chat
    this.events = {
      message: this.onMessage,
    }
    this.timeouts = {} // TODO: move to database
    this.externalEmotes = []
    this.loadEmotes()
  }

  async loadEmotes() {
    this.externalEmotes = await this.getExternalEmotes()
  }

  async getExternalEmotes() {
    let globalEmotes = await got(
      'https://api.betterttv.net/3/cached/emotes/global'
    ).json()

    let allChannelEmotes = await got(
      'https://api.betterttv.net/3/cached/users/twitch/8793847'
    ).json()

    let channelEmotes = allChannelEmotes.channelEmotes
    let sharedEmotes = allChannelEmotes.sharedEmotes

    return globalEmotes.concat(channelEmotes).concat(sharedEmotes)
  }

  escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  async onMessage(data) {
    if (data.isMod) return

    const emotes = this.externalEmotes
      .concat(data.emotes)
      .map((e) => this.escapeRegExp(e.code)) // Find emote code
    const uniqueEmotesSet = new Set(emotes) // Merge identical emotes
    const uniqueEmotes = [...uniqueEmotesSet]

    // Replace the emotes with NOTHING
    const emoteRegex = new RegExp(`(${uniqueEmotes.join('|')}|<3)`, 'g')
    let newMsg = data.message
      .replace(emoteRegex, '')
      .replace(/(,|\.|\\|\/|_|-|\?|!|:|\(|\)|\^|")/g, '')
      .replace(/@[A-z0-9_]+/g, '') // Filters out tagged usernames
      .replace(
        /([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g,
        ''
      ) // Emojis
      .trim()

    const msgLength = newMsg.length
    newMsg = newMsg.replace(/\s+/g, '')

    let caps = 0
    for (let i = 0; i < newMsg.length; i++) {
      const up = newMsg[i].toUpperCase()
      if (up === newMsg[i]) {
        caps++
      }
    }
    if (newMsg.length < 1) {
      return
    }

    const capsRatio = caps / newMsg.length

    // Exponentially increase the timeout duration everytime the same user spams
    if (msgLength >= 25 && capsRatio >= 0.6) {
      if (typeof this.timeouts[data.user] === 'undefined') {
        this.timeouts[data.user] = 1
      } else {
        this.timeouts[data.user] *= 4
      }

      const timeoutCount = 1 + Math.log(this.timeouts[data.user]) / Math.log(4)
      const timeout = 60 * this.timeouts[data.user]

      console.log(
        'Timed out:',
        data.user,
        `(${timeoutCount}x)`,
        `(${data.message})`,
        `(${caps} of ${newMsg.length} ratio of: ${capsRatio.toFixed(2)})`
      )

      await this.chat.client
        .timeout(data.channel, data.user, timeout)
        .catch((e) => console.log('oopsie, could not timeout'))
    }
  }
}
