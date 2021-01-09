import ky from 'ky'
import store from '@/store'

export default ky.extend({
  prefixUrl: '/api',
  throwHttpErrors: false,
  hooks: {
    beforeRequest: [
      (req) => {
        if (store.state.token)
          req.headers.set('Authorization', 'Bearer ' + store.state.token)
      },
    ],
    afterResponse: [
      (req, options, res) => {
        if (res.status === 401 || res.status === 403) {
          store.commit('setToken')
          store.commit('setUser')
          localStorage.clear()
        }
      },
    ],
  },
})
