<template>
  <nav class="bg-blue-600">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <span @click="this.$router.push('/')" class="cursor-pointer text-white text-lg font-semibold">My Todo App</span>
        </div>
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <router-link
              to="/todos"
              class="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Todos
            </router-link>
            <router-link
              v-if="loggedUser && loggedUser.user_type_id === 1"
              to="/admin"
              class="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Admin
            </router-link>
            <button
              v-if="loggedUser"
              @click="logout()"
              class="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
              Logout
            </button>
            <router-link
              v-else
              to="/auth/login"
              class="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import axios from '@/axios'
import { storeToRefs } from 'pinia'

const loggedUser = JSON.parse(localStorage.getItem('loggedUser'))

const logout = async () => {
  try {
    await axios.post('/api/logout');
    localStorage.removeItem('token'); // Remove token from local storage
    localStorage.removeItem('loggedUser'); // Remove loggedUser from local storage
    window.location = '/auth/login' // redirect ot login page
  } catch (error) {
    console.error('Error logging out:', error);
  }
}
</script>

<style scoped>
/* Additional styles can go here if needed */
</style>
