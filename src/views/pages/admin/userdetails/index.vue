<template>
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">User Details</h1>

    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="detail in userDetails" :key="detail.id">
            <td>{{ detail.first_name }}</td>
            <td>{{ detail.last_name }}</td>
            <td>{{ detail.email }}</td>
            <td>
              <div class="flex gap-2">
                <button @click="editUserDetail(detail)" class="text-white btn btn-primary btn-xs">
                  Edit
                </button>
                <button @click="deleteUserDetail(detail.id)" class="text-white btn btn-error btn-xs">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Checkbox Control -->
    <input type="checkbox" id="edit_user_detail_modal" class="modal-toggle" v-model="isEditing" />

    <!-- Modal Structure -->
    <div v-if="currentUserDetail" class="modal">
      <div class="modal-box">
        <h2 class="text-xl font-bold mb-4">Edit User Detail</h2>

        <!-- First Name Input -->
        <input
          v-model="currentUserDetail.first_name"
          type="text"
          placeholder="First Name"
          class="input input-bordered w-full mb-4"
        />
        
        <!-- Last Name Input -->
        <input
          v-model="currentUserDetail.last_name"
          type="text"
          placeholder="Last Name"
          class="input input-bordered w-full mb-4"
        />

        <!-- Email Input -->
        <input
          v-model="currentUserDetail.email"
          type="email"
          placeholder="Email"
          class="input input-bordered w-full mb-4"
        />

        <!-- Error Message Display -->
        <div v-if="updateErrorMessage" class="text-red-600 mb-4">
          {{ updateErrorMessage }}
        </div>

        <!-- Modal Actions -->
        <div class="modal-action">
          <button @click="updateUserDetail" class="btn btn-success">Update User Detail</button>
          <label for="edit_user_detail_modal" class="btn">Cancel</label>
        </div>
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

    onMounted(async () => {
      await fetchUserDetails()
    })

    return {
      userDetails,
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
