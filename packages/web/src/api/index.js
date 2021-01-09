import ky from 'ky'

export default ky.extend({
  hooks: {
    beforeRequest: [
      (request) => {
        if (this.token)
          request.headers.set('Authorization', 'Bearer ' + this.token)
      },
    ],
  },
})
