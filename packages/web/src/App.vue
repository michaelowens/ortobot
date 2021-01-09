<template>
  <TheHeader />
  <div class="text-center">
    <MainPage v-if="user" />
  </div>
</template>

<script>
import { getUser } from '@/api/auth'
import TheHeader from './components/TheHeader.vue'
import MainPage from './components/MainPage.vue'
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {
    TheHeader,
    MainPage,
  },
  computed: mapState(['user']),
  async beforeCreate() {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token') || localStorage.getItem('token')
    this.$store.commit('setToken', token)

    if (token) {
      const user = await getUser()
      if ('error' in user) {
        return
      }
      this.$store.commit('setUser', user)
      window.history.replaceState({}, document.title, '/')
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
}
</style>
