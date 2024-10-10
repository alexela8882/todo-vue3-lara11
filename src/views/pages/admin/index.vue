<template>
  <div class="flex h-screen">
    <aside class="w-64 bg-white-500 p-4 shadow-lg">
      <h2 class="text-lg font-bold mb-4 text-gray-800">Admin Dashboard</h2>
      <ul>
        <li>
          <router-link
            to="/admin"
            class="block py-2 text-gray-700 hover:text-indigo-500 transition duration-200"
            :class="{ 'font-bold text-indigo-400': isActive('admin') }">
            Dashboard
          </router-link>
        </li>
        <li>
          <router-link
            to="/admin/users"
            class="block py-2 text-gray-700 hover:text-indigo-500 transition duration-200"
            :class="{ 'font-bold text-indigo-400': isActive('adminUsers') }">
            Users
          </router-link>
        </li>
        <li>
          <router-link
            to="/admin/userdetails"
            class="block py-2 text-gray-700 hover:text-indigo-500 transition duration-200"
            :class="{ 'font-bold text-indigo-400': isActive('adminUserDetails') }">
            User Details
          </router-link>
        </li>
      </ul>
    </aside>
    <main class="flex-1 p-6">
      <div v-if="isActive('admin')">
        <header class="mb-4">
          <h1 class="text-2xl font-bold text-gray-800">Welcome to the Admin Dashboard</h1>
          <p class="text-gray-600">Here you can manage users and their details.</p>
        </header>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="(group, status) in getAllTodos" :key="status" class="bg-white shadow rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-700">{{ status }}</h3>
            <p class="text-2xl font-bold text-blue-600">{{ group.count }}</p> <!-- Example value -->
          </div>
        </div>
      </div>
      <div v-else>
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// stores
import { useTodoStore } from '@/stores/todos'
const todoStore = useTodoStore()
const { getAllTodos } = storeToRefs(todoStore)
const { fetchAllTodos } = todoStore

const route = useRoute()

const isActive = (routeName) => {
  return route.name === routeName
}

onMounted(async () => {
  await fetchAllTodos()
  await fetchUsers()
})
</script>

<style scoped>
/* Add any specific styles for your layout here */
</style>
