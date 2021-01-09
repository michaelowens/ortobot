<template>
  <h1>Hello World</h1>
  <a href="#" @click.prevent="apiTest">Test api call</a>
</template>

<script>
import { enable } from '@/api/module'

export default {
  name: 'MainPage',
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
