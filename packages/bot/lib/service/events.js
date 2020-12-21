const { EventEmitter } = require('events')

// Extend is required to ignore registry passed on by dependency injection
class EventsService extends EventEmitter {
  constructor(_) {
    super({ captureRejections: true }) // Make sure we catch errors in async callbacks
    this.on('error', console.log) // Show errors from async callbacks
  }
}

module.exports = EventsService
