<script setup>
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/layouts/NavBar.vue'

onMounted(() => {
  console.log(JSON.parse(localStorage.getItem('loggedUser')))
})

</script>

<template>
  <NavBar></NavBar>

  <div class="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
    <RouterView />
  </div>
</template>

<style scoped>
</style>
