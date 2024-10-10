<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md p-8 space-y-6 bg-base-100 rounded-lg shadow-xl">
      <h2 class="text-3xl font-bold text-center text-primary">Login</h2>
      <form @submit.prevent="login">
        <div class="space-y-4">
          <div class="form-control">
            <label for="username" class="label">
              <span class="label-text">Username:</span>
            </label>
            <input
              type="text"
              v-model="username"
              required
              class="input input-bordered w-full"
              :disabled="loginLoading"
            />
          </div>
          <div class="form-control">
            <label for="password" class="label">
              <span class="label-text">Password:</span>
            </label>
            <input
              type="password"
              v-model="password"
              required
              class="input input-bordered w-full"
              :disabled="loginLoading"
            />
          </div>
          <button
            type="submit"
            class="btn btn-primary w-full"
            :class="loginLoading && 'btn-disabled'">
            <span v-if="loginLoading" class="loading loading-spinner"></span>
            {{ loginLoading ? 'Logging in...' : 'Login' }}
          </button>
          <p v-if="errorMessage" class="text-error text-sm mt-2">{{ errorMessage }}</p>
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
const loginLoading = ref(false)

const login = async () => {
  loginLoading.value = true
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
  } finally {
    loginLoading.value = false
  }
}
</script>

<style scoped>
/* You can add additional styles here if needed */
</style>
