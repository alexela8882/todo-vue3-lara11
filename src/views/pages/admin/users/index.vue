<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Manage Users</h1>
    <div class="mb-4 flex">
      <input
        @keypress.enter="createUser"
        v-model="newUser.name"
        type="text"
        placeholder="Name"
        class="border rounded p-2 flex-grow mr-2 text-sm"
      />
      <input
        @keypress.enter="createUser"
        v-model="newUser.username"
        type="username"
        placeholder="Username"
        class="border rounded p-2 flex-grow mr-2 text-sm"
      />
      <select
        v-model="newUser.user_type_id"
        class="border rounded p-2 flex-grow mr-2">
        <option disabled :value="0">Select Type:</option>
        <option v-for="type in userTypes" :key="type.id" :value="type.id">
          {{ type.name }}
        </option>
      </select>
      <button
        @click="createUser"
        class="bg-blue-500 text-white rounded p-2"
        :class="(!newUser.name || !newUser.username) && 'bg-blue-400'"
        :disabled="!newUser.name || !newUser.username || createBtnLoading"
        :loading="true">
        <span v-if="createBtnLoading">Adding...</span>
        <span v-else>Add User</span>
      </button>
    </div>

    <!-- Error message display -->
    <div v-if="errorMessage" class="mb-4 text-red-600">
      {{ errorMessage }}
    </div>
    
    <table class="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th class="border border-gray-300 px-2 py-1 text-left text-sm">Name</th>
          <th class="border border-gray-300 px-2 py-1 text-left text-sm">Username</th>
          <th class="border border-gray-300 px-2 py-1 text-left text-sm">User Type</th>
          <th class="border border-gray-300 px-2 py-1 text-left text-sm">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td class="border border-gray-300 px-2 py-1 text-sm">{{ user.name }}</td>
          <td class="border border-gray-300 px-2 py-1 text-sm">{{ user.username }}</td>
          <td class="border border-gray-300 px-2 py-1 text-sm">{{ user.type.name }}</td>
          <td class="border border-gray-300 px-2 py-1 text-sm">
            <button @click="editUser(user)" class="bg-yellow-500 text-white rounded text-xs px-2 py-1 mr-1">
              Edit
            </button>
            <button @click="deleteUser(user.id)" class="bg-red-500 text-white rounded text-xs px-2 py-1">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="isEditing" class="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div class="bg-white p-4 rounded shadow-md w-2/5">
        <h2 class="text-xl font-bold mb-2">Edit User</h2>
        <input
          v-model="currentUser.name"
          type="text"
          placeholder="User Name"
          class="border rounded p-2 w-full mb-2"
        />
        <input
          v-model="currentUser.username"
          type="username"
          placeholder="Username"
          class="border rounded p-2 w-full mb-2"
        />
        <input
          v-model="currentUser.password"
          type="password"
          placeholder="Password"
          class="border rounded p-2 w-full mb-2"
        />
        <select
          v-model="currentUser.user_type_id"
          id="user-type"
          class="border rounded p-2 w-full mb-2">
          <option v-for="type in userTypes" :key="type.id" :value="type.id">
            {{ type.name }}
          </option>
        </select>

        <!-- Error message display -->
        <div v-if="updateErrorMessage" class="mb-4 text-red-600">
          {{ updateErrorMessage }}
        </div>

        <!-- Action Buttons -->
        <button @click="updateUser" class="bg-green-500 text-white rounded p-2">
          Update User
        </button>
        <button @click="isEditing = false" class="bg-gray-400 text-white rounded p-2 ml-2">
          Cancel
        </button>
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
