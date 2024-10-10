<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Manage Users</h1>
    <div class="join mb-4">
      <div>
        <div>
          <input
            @keypress.enter="_storeUser"
            v-model="newUser.name"
            type="text"
            placeholder="Name"
            class="input input-bordered join-item"
          />
        </div>
      </div>
      <div>
        <div>
          <input
            @keypress.enter="_storeUser"
            v-model="newUser.username"
            type="username"
            placeholder="Username"
            class="input input-bordered join-item"
          />
        </div>
      </div>
      <select
        v-model="newUser.user_type_id"
        class="select select-bordered join-item">
        <option disabled :value="0">Select Type:</option>
        <option v-for="type in getUserTypes" :key="type.id" :value="type.id">
          {{ type.name }}
        </option>
      </select>
      <div class="indicator">
        <button
          @click="_storeUser"
          class="btn join-item"
          :class="(!newUser.name || !newUser.username) && 'bg-blue-400'"
          :disabled="!newUser.name || !newUser.username || createBtnLoading">
          <span v-if="createBtnLoading" class="loading loading-spinner"></span>
          {{ createBtnLoading ? 'Adding...' : 'Add User' }}
        </button>
      </div>
    </div>

    <!-- Error message display -->
    <div v-if="errorMessage" class="mb-4 text-red-600">
      {{ errorMessage }}
    </div>

    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
        <tr>
          <th>Name</th>
          <th>Username</th>
          <th>User Type</th>
          <th>Actions</th>
        </tr>
      </thead>
        <tbody>
          <tr v-for="user in getUsers" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.type.name }}</td>
          <td>
            <div class="flex gap-2">
              <button @click="editUser(user)" class="text-white btn btn-primary btn-xs">
                Edit
              </button>
              <button @click="deleteUser(user.id)" class="text-white btn btn-error btn-xs">
                Delete
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Checkbox Control -->
    <input type="checkbox" id="edit_user_modal" class="modal-toggle" v-model="isEditing" />

    <!-- Modal Structure -->
    <div class="modal">
      <div class="modal-box">
        <h2 class="text-xl font-bold mb-4">Edit User</h2>
        
        <!-- User Inputs -->
        <input
          v-model="currentUser.name"
          type="text"
          placeholder="User Name"
          class="input input-bordered w-full mb-4"
        />
        <input
          v-model="currentUser.username"
          type="text"
          placeholder="Username"
          class="input input-bordered w-full mb-4"
        />
        <input
          v-model="currentUser.password"
          type="password"
          placeholder="Password"
          class="input input-bordered w-full mb-4"
        />
        
        <!-- User Type Dropdown -->
        <select
          v-model="currentUser.user_type_id"
          id="user-type"
          class="select select-bordered w-full mb-4">
          <option v-for="type in getUserTypes" :key="type.id" :value="type.id">
            {{ type.name }}
          </option>
        </select>
        
        <!-- Error Message -->
        <div v-if="updateErrorMessage" class="text-red-600 mb-4">
          {{ updateErrorMessage }}
        </div>
        
        <!-- Modal Actions -->
        <div class="modal-action">
          <button @click="_updateUser" class="btn btn-success">Update User</button>
          <label for="edit_user_modal" class="btn">Cancel</label>
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
import { useUserStore } from '@/stores/users'
const userStore = useUserStore()
const { getUsers, getUserTypes } = storeToRefs(userStore)
const {
  fetchUsers,
  fetchUserTypes,
  storeUser,
  updateUser,
  deleteUser
} = userStore

const createBtnLoading = ref(false)
const newUser = ref({
  name: '',
  username: '',
  user_type_id: 2, // default: user
})
const isEditing = ref(false)
const currentUser = ref({})
const errorMessage = ref('')
const updateErrorMessage = ref('')

const _storeUser = async () => {
  createBtnLoading.value = true

  const { succResponse, errResponse } = await storeUser(newUser.value)
  if (succResponse) {
    // Reset newUser
    newUser.value.name = ''
    newUser.value.username = ''
    newUser.value.user_type_id = 2
    errorMessage.value = ''
  }

  // error response
  if (errResponse) errorMessage.value = errResponse

  // reset
  createBtnLoading.value = false
}

const editUser = (user) => {
  currentUser.value = { ...user }
  isEditing.value = true
}

const _updateUser = async () => {
  const { succResponse, errResponse } = await updateUser(currentUser.value)
  if (succResponse) {
    isEditing.value = false
    updateErrorMessage.value = ''
  }

  // error response
  if (errResponse) updateErrorMessage.value = errResponse
}

onMounted(async () => {
  await fetchUsers()
  await fetchUserTypes()
})
</script>

<style scoped>
/* Add any additional styles for your users page here */
</style>
