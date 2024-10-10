<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">User Details</h1>

    <table class="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th class="border border-gray-300 px-2 py-1 text-left text-sm">First Name</th>
          <th class="border border-gray-300 px-2 py-1 text-left text-sm">Last Name</th>
          <th class="border border-gray-300 px-2 py-1 text-left text-sm">Email</th>
          <th class="border border-gray-300 px-2 py-1 text-left text-sm">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="detail in userDetails" :key="detail.id">
          <td class="border border-gray-300 px-2 py-1 text-sm">{{ detail.first_name }}</td>
          <td class="border border-gray-300 px-2 py-1 text-sm">{{ detail.last_name }}</td>
          <td class="border border-gray-300 px-2 py-1 text-sm">{{ detail.email }}</td>
          <td class="border border-gray-300 px-2 py-1 text-sm">
            <button @click="editUserDetail(detail)" class="bg-yellow-500 text-white rounded text-xs px-2 py-1 mr-1">
              Edit
            </button>
            <button @click="deleteUserDetail(detail.id)" class="bg-red-500 text-white rounded text-xs px-2 py-1">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="isEditing" class="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div class="bg-white p-4 rounded shadow-md w-2/5">
        <h2 class="text-xl font-bold mb-2">Edit User Detail</h2>
        <input
          v-model="currentUserDetail.first_name"
          type="text"
          placeholder="First Name"
          class="border rounded p-2 w-full mb-2"
        />
        <input
          v-model="currentUserDetail.last_name"
          type="text"
          placeholder="Last Name"
          class="border rounded p-2 w-full mb-2"
        />
        <input
          v-model="currentUserDetail.email"
          type="email"
          placeholder="Email"
          class="border rounded p-2 w-full mb-2"
        />
        <select
          v-model="currentUserDetail.user_id"
          class="border rounded p-2 w-full mb-2"
        >
          <option disabled value="">Select User</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
        <button @click="updateUserDetail" class="bg-green-500 text-white rounded p-2">
          Update User Detail
        </button>
        <button @click="isEditing = false" class="bg-gray-400 text-white rounded p-2 ml-2">
          Cancel
        </button>
        <div v-if="updateErrorMessage" class="text-red-500 mt-2">{{ updateErrorMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios'
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const userDetails = ref([])
    const users = ref([]) // To store all users
    const newUserDetail = ref({ first_name: '', last_name: '', email: '', user_id: null })
    const currentUserDetail = ref(null)
    const isEditing = ref(false)
    const errorMessage = ref('')
    const updateErrorMessage = ref('')

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('/api/user-details') // Fetch user details
        userDetails.value = response.data
      } catch (error) {
        console.error('Error fetching user details:', error)
      }
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users') // Fetch users for dropdown
        users.value = response.data
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    const createUserDetail = async () => {
      try {
        await axios.post('/api/user-details', newUserDetail.value)
        await fetchUserDetails() // Refresh the user details list
        newUserDetail.value = { first_name: '', last_name: '', email: '', user_id: null } // Reset the form
        errorMessage.value = ''
      } catch (error) {
        console.error('Error creating user detail:', error)
        errorMessage.value = error.response.data.message
      }
    }

    const editUserDetail = (detail) => {
      currentUserDetail.value = { ...detail }
      isEditing.value = true
    }

    const updateUserDetail = async () => {
      try {
        await axios.put(`/api/user-details/${currentUserDetail.value.id}`, currentUserDetail.value)
        await fetchUserDetails() // Refresh the user details list
        isEditing.value = false
        updateErrorMessage.value = ''
      } catch (error) {
        console.error('Error updating user detail:', error)
        updateErrorMessage.value = error.response.data.message
      }
    }

    const deleteUserDetail = async (id) => {
      if (confirm('Are you sure you want to delete this user detail?')) {
        try {
          await axios.delete(`/api/user-details/${id}`)
          await fetchUserDetails() // Refresh the user details list
        } catch (error) {
          console.error('Error deleting user detail:', error)
        }
      }
    }

    onMounted(() => {
      fetchUserDetails()
      fetchUsers()
    })

    return {
      userDetails,
      users,
      newUserDetail,
      currentUserDetail,
      isEditing,
      errorMessage,
      updateErrorMessage,
      createUserDetail,
      editUserDetail,
      updateUserDetail,
      deleteUserDetail,
    }
  },
}
</script>

<style scoped>
/* Add any additional styling you want for your component here */
</style>
