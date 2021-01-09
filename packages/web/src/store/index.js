import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      token: null,
      user: null,
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      if (state.token) {
        localStorage.setItem('token', state.token)
      } else {
        localStorage.removeItem('token')
      }
    },

    setUser(state, user) {
      state.user = user
    },

    clear(state) {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
    },
  },
})
