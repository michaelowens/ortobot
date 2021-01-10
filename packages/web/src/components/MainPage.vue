<template>
  <!-- <a href="#" @click.prevent="apiTest">Test api call</a> -->
  <div
    class="grid justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-8 mx-auto gap-4 max-w-6xl"
  >
    <BotModule
      v-for="(mod, key) in modules"
      :key="key"
      :name="key"
      :title="mod.title"
      :description="mod.description"
    />
  </div>
</template>

<script>
import { enable } from '@/api/module'
import BotModule from './BotModule.vue'
import modules from '@/config/modules'

export default {
  name: 'MainPage',
  components: { BotModule },
  data: () => ({
    modules,
  }),
  methods: {
    async apiTest() {
      const res = await enable('test')
      console.log('Api test response:')
      console.log(res)
    },
  },
}
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
