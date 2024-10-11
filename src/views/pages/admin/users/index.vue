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
              <button @click="editUser(user)" class="btn btn-circle btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>
              <button @click="deleteUser(user.id)" class="text-white btn btn-circle btn-error btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
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
          @keypress.enter="_updateUser"
          v-model="currentUser.name"
          type="text"
          placeholder="User Name"
          class="input input-bordered w-full mb-4"
        />
        <input
          @keypress.enter="_updateUser"
          v-model="currentUser.username"
          type="text"
          placeholder="Username"
          class="input input-bordered w-full mb-4"
        />
        <input
          @keypress.enter="_updateUser"
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
          <button
            @click="_updateUser"
            class="text-white btn btn-success"
            :disabled="updateLoading"
          >{{ updateLoading ? 'Updating...' : 'Update User' }}</button>
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
const updateLoading = ref(false)

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
  updateLoading.value = true

  const { succResponse, errResponse } = await updateUser(currentUser.value)
  if (succResponse) {
    isEditing.value = false
    updateErrorMessage.value = ''
  }

  // error response
  if (errResponse) updateErrorMessage.value = errResponse

  updateLoading.value = false
}

onMounted(async () => {
  await fetchUsers()
  await fetchUserTypes()
})
</script>

<style scoped>
/* Add any additional styles for your users page here */
</style>
