<template>
  <div
    class="grid justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-8 mx-auto gap-6 max-w-6xl"
  >
    <BotModule
      v-for="(mod, key) in modules"
      :key="key"
      :name="key"
      :title="mod.title"
      :description="mod.description"
      :enabled="mod.enabled"
    />
  </div>
</template>

<script>
import io from 'socket.io-client'
import { all } from '@/api/module'
import BotModule from './BotModule.vue'

export default {
  name: 'MainPage',
  components: { BotModule },
  data: () => ({
    modules: [],
    socket: null
  }),
  async created() {
    this.modules = await all()

    this.socket = io()
    this.socket.on("connect", () => {
      console.log('Socket.io connected', this.socket.id);
    })
    this.socket.on('module:status', data => {
      this.modules[data.name].enabled = data.enabled
      console.log('module:status', data)
    })
  }
}
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
