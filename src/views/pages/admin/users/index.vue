<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Manage Users</h1>
    <div class="join mb-4">
      <div>
        <div>
          <input
            @keypress.enter="createUser"
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
            @keypress.enter="createUser"
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
        <option v-for="type in userTypes" :key="type.id" :value="type.id">
          {{ type.name }}
        </option>
      </select>
      <div class="indicator">
        <button
          @click="createUser"
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
          <tr v-for="user in users" :key="user.id">
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
          <option v-for="type in userTypes" :key="type.id" :value="type.id">
            {{ type.name }}
          </option>
        </select>
        
        <!-- Error Message -->
        <div v-if="updateErrorMessage" class="text-red-600 mb-4">
          {{ updateErrorMessage }}
        </div>
        
        <!-- Modal Actions -->
        <div class="modal-action">
          <button @click="updateUser" class="btn btn-success">Update User</button>
          <label for="edit_user_modal" class="btn">Cancel</label>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from '@/axios'

export default {
  name: 'AdminUsers',
  data() {
    return {
      // loading states
      createBtnLoading: false,
      users: [],
      userTypes: [],
      newUser: {
        name: '',
        username: '',
        user_type_id: 2, // default: user
      },
      isEditing: false,
      currentUser: {},
      errorMessage: '',
      updateErrorMessage: ''
    }
  },
  created() {
    this.fetchUsers()
    this.fetchUserTypes()
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('/api/users')
        this.users = response.data
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    },
    async fetchUserTypes () {
      try {
        const response = await axios.get('/api/user-types');
        this.userTypes = response.data;
      } catch (error) {
        console.error('Error fetching user types:', error);
      }
    },
    async createUser() {
      this.createBtnLoading = true

      try {
        const response = await axios.post('/api/users', this.newUser)
        this.users.push(response.data)
        this.newUser.name = ''
        this.newUser.username = ''
        this.newUser.user_type_id = 2
        this.errorMessage = ''
      } catch (error) {
        console.error('Error creating user:', error)
        this.errorMessage = 'Error creating user: ' + error.response.data.message;
      }

      this.createBtnLoading = false
    },
    async editUser(user) {
      this.currentUser = { ...user }
      this.isEditing = true
    },
    async updateUser() {
      try {
        const response = await axios.put(`/api/users/${this.currentUser.id}`, {
          name: this.currentUser.name,
          username: this.currentUser.username,
          password: this.currentUser.password,
          user_type_id: this.currentUser.user_type_id // Include user_type_id in the request
        });

        // Assuming the backend returns the updated user with the full user type
        const updatedUser = response.data;

        // Find the index of the user and update the user and their type
        const index = this.users.findIndex(user => user.id === this.currentUser.id);
        if (index !== -1) {
          this.users.splice(index, 1, updatedUser); // Replace the user with the updated one
        }

        this.isEditing = false; // Close the edit modal
        this.updateErrorMessage = ''; // Clear error messages if successful
      } catch (error) {
        // Handle the error and display a message
        console.error('Error updating user:', error);
        if (error.response && error.response.data && error.response.data.message) {
          this.updateErrorMessage = 'Error updating user: ' + error.response.data.message;
        } else {
          this.updateErrorMessage = 'An unknown error occurred.';
        }
      }
    },
    async deleteUser(userId) {
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          await axios.delete(`/api/users/${userId}`)
          this.users = this.users.filter(user => user.id !== userId)
        } catch (error) {
          console.error('Error deleting user:', error)
        }
      }
    },
  },
}
</script>

<style scoped>
/* Add any additional styles for your users page here */
</style>
