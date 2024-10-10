import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from '@/axios'

export const useUserStore = defineStore('user', () => {
  // states
  const users = ref([])

  // getters
  const getUsers = computed(() => users.value)

  // actions
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users')
      users.value = response.data
    } catch (error) {
      console.error('Error fetching all users:', error)
    }
  }

  return {
    getUsers,
    fetchUsers,
  }
})
