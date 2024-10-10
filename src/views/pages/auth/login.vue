<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center">Login</h2>
      <form @submit.prevent="login">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Username:</label>
            <input
              type="text"
              v-model="username"
              required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              v-model="password"
              required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            />
          </div>
          <button
            type="submit"
            class="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring focus:ring-blue-300"
          >
            Login
          </button>
          <p v-if="errorMessage" class="mt-2 text-sm text-red-600">{{ errorMessage }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')

const login = async () => {
  errorMessage.value = ''
  try {
    const response = await axios.post('/api/login', {
      username: username.value,
      password: password.value
    })

    // store user & token
    localStorage.setItem('loggedUser', JSON.stringify(response.data.user))
    localStorage.setItem('token', response.data.token)

    // redirect
    window.location = '/'
  } catch (error) {
    errorMessage.value = error.response?.data.message || 'Login failed'
  }
}
</script>

<style scoped>
/* You can add additional styles here if needed */
</style>
