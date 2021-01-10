<template>
  <div class="bg-white shadow-lg rounded-md text-center p-4">
    <h2 class="text-red-600 text-xl">{{ name }}</h2>
    <p class="mt-2 text-gray-700">{{ description }}</p>
    <button class="bg-gray-600 text-white px-4 py-2 rounded-md mt-4">
      Enable
    </button>
  </div>
</template>

<script>
export default {
  props: ['key', 'name', 'description'],
}
</script>

<style></style>
