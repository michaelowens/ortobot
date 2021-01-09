<template>
  <div class="relative bg-gray-800 text-white mb-8">
    <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6">
      <div class="flex justify-between items-center">
        <span class="text-xl sm:text-2xl">ortoBot</span>
        <div v-if="user">
          {{ user.display_name }}
          <a href="#" class="italic" @click.prevent="$store.commit('clear')"
            >(Logout)</a
          >
        </div>
        <div v-else>
          <a href="/api/auth/twitch" class="bg-indigo-700 p-2 rounded-md">
            Login with Twitch
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'TheHeader',
  computed: mapState(['user']),
}
</script>
