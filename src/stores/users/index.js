import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from '@/axios'

export const useUserStore = defineStore('user', () => {
  // states
  const users = ref([])
  const userTypes = ref([])

  // getters
  const getUsers = computed(() => users.value)
  const getUserTypes = computed(() => userTypes.value)

  // actions
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users')
      users.value = response.data
    } catch (error) {
      console.error('Error fetching all users:', error)
    }
  }

  const fetchUserTypes = async () => {
    try {
      const response = await axios.get('/api/user-types')
      userTypes.value = response.data
    } catch (error) {
      console.error('Error fetching user types:', error)
    }
  }

  const storeUser = async (payload) => {
    let succResponse = null
    let errResponse = null

    try {
      const response = await axios.post('/api/users', payload)
      users.value.push(response.data)

      succResponse = response.data
    } catch (error) {
      console.error('Error creating user:', error)
      const errMessage = 'Error creating user: ' + error.response.data.message
      errResponse = errMessage
    }

    return { succResponse, errResponse }
  }

  const updateUser = async (payload) => {
    let succResponse = null
    let errResponse = null

    try {
      const response = await axios.put(`/api/users/${payload.id}`, {
        name: payload.name,
        username: payload.username,
        password: payload.password,
        user_type_id: payload.user_type_id,
      })

      // Update the user in the list
      const index = users.value.findIndex(user => user.id === payload.id)
      if (index !== -1) {
        users.value.splice(index, 1, response.data)
      }

      succResponse = response.data
    } catch (error) {
      console.error('Error updating user:', error)
      errResponse = error.response?.data?.message || 'An unknown error occurred.'
    }

    return { succResponse, errResponse }
  }

  const deleteUser = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${id}`)
        users.value = users.value.filter(user => user.id !== id)
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  return {
    getUsers,
    getUserTypes,
    fetchUsers,
    fetchUserTypes,
    storeUser,
    updateUser,
    deleteUser
  }
})
