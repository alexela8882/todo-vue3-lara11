<template>
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">User Details</h1>

    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="detail in getUserDetails" :key="detail.id">
            <td>{{ detail.user.name }}</td>
            <td>{{ detail.first_name }}</td>
            <td>{{ detail.last_name }}</td>
            <td>{{ detail.email }}</td>
            <td>
              <div class="flex gap-2">
                <button @click="editUserDetail(detail)" class="btn btn-circle btn-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
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
          @keypress.enter="_updateUserDetail"
          v-model="currentUserDetail.first_name"
          type="text"
          placeholder="First Name"
          class="input input-bordered w-full mb-4"
        />
        
        <!-- Last Name Input -->
        <input
          @keypress.enter="_updateUserDetail"
          v-model="currentUserDetail.last_name"
          type="text"
          placeholder="Last Name"
          class="input input-bordered w-full mb-4"
        />

        <!-- Email Input -->
        <input
          @keypress.enter="_updateUserDetail"
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
          <button
            @click="_updateUserDetail"
            class="text-white btn btn-success"
            :disabled="updateLoading"
          >{{ updateLoading ? 'Updating...' : 'Update User Detail' }}</button>
          <label for="edit_user_detail_modal" class="btn">Cancel</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import axios from '@/axios'

// stores
import { useUserDetailStore } from '@/stores/users/details'
const userDetailStore = useUserDetailStore()
const { getUserDetails } = storeToRefs(userDetailStore)
const {
  fetchUserDetails,
  updateUserDetail
} = userDetailStore

const userDetails = ref([])
const currentUserDetail = ref(null)
const isEditing = ref(false)
const updateErrorMessage = ref('')
const updateLoading = ref(false)

const editUserDetail = (detail) => {
  currentUserDetail.value = { ...detail }
  isEditing.value = true
}

const _updateUserDetail = async () => {
  updateLoading.value = true

  const { succResponse, errResponse } = await updateUserDetail(currentUserDetail.value)

  if (succResponse) {
    isEditing.value = false
    updateErrorMessage.value = ''
  }

  if (errResponse) updateErrorMessage.value = errResponse

  updateLoading.value = false
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
</script>

<style scoped>
/* Add any additional styling you want for your component here */
</style>
