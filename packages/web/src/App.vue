<template>
  <TheHeader />
  <div class="text-center">
    <img alt="Vue logo" src="./assets/logo.png" class="m-auto" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import TheHeader from './components/TheHeader.vue'
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    TheHeader,
    HelloWorld,
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
