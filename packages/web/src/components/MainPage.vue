<template>
  <!-- <a href="#" @click.prevent="apiTest">Test api call</a> -->
  <div class="flex flex-wrap px-8 mx-auto justify-center max-w-6xl">
    <div v-for="(mod, key) in modules" :key="key" class="w-64 p-4">
      <BotModule :key="key" :name="mod.name" :description="mod.description" />
    </div>
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
