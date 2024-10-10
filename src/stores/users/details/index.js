import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from '@/axios'

export const useUserDetailStore = defineStore('userDetail', () => {
  // states
  const userDetails = ref([])

  // getters
  const getUserDetails = computed(() => userDetails.value)

  // actions
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('/api/user-details')
      userDetails.value = response.data
    } catch (error) {
      console.error('Error fetching all user details:', error)
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

  const updateUserDetail = async (payload) => {
    let succResponse = null
    let errResponse = null

    try {
      const response = await axios.put(`/api/user-details/${payload.id}`, payload)

      // Update the user in the list
      const index = userDetails.value.findIndex(detail => detail.id === payload.id)
      if (index !== -1) {
        userDetails.value.splice(index, 1, response.data)
      }

      succResponse = response.data
    } catch (error) {
      console.error('Error updating user:', error)
      errResponse = error.response?.data?.message || 'An unknown error occurred.'
    }

    return { succResponse, errResponse }
  }

  return {
    getUserDetails,
    fetchUserDetails,
    updateUserDetail
  }
})
