<template>
  <div
    class="flex flex-col bg-white shadow-lg rounded-md text-center p-4 min-h-48"
    :class="'mod-' + name"
  >
    <h2
      class="text-xl"
      :class="{ 'text-green-600': enabled, 'text-red-600': !enabled }"
    >
      {{ title }}
    </h2>
    <p class="flex-1 mt-2 text-gray-700">{{ description }}</p>
    <div>
      <button
        class="bg-gray-600 hover:bg-gray-500 active:bg-gray-800 text-white px-6 py-2 rounded-md mt-4"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['name', 'title', 'description'],
  data: () => ({
    enabled: false,
  }),
  computed: {
    buttonText() {
      return this.enabled ? 'Disable' : 'Enable'
    },
  },
}
</script>

<style>
.mod-ibai {
  background-image: url('https://www.pngkit.com/png/full/185-1854142_consuela-family-guy-family-guy-no-no-no.png');
  background-size: cover;
}

.mod-ibai p {
  text-shadow: -1px -1px 2px #fff, -1px 1px 2px #fff, 1px -1px 2px #fff,
    1px 1px 2px #fff;
}
</style>
