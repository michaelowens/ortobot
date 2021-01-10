<template>
  <div
    class="bg-white shadow-lg rounded-md text-center p-4"
    :class="'mod-' + name"
  >
    <h2 class="text-red-600 text-xl">{{ title }}</h2>
    <p class="mt-2 text-gray-700">{{ description }}</p>
    <button class="bg-gray-600 text-white px-4 py-2 rounded-md mt-4">
      Enable
    </button>
  </div>
</template>

<script>
export default {
  props: ['name', 'title', 'description'],
}
</script>

<style>
.mod-ibai {
  background-image: url('https://www.pngkit.com/png/full/185-1854142_consuela-family-guy-family-guy-no-no-no.png');
  background-size: cover;
}
</style>
