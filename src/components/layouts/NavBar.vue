<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
          <li>
            <router-link to="/todos">Todos</router-link>
          </li>
          <li>
            <router-link
              v-if="loggedUser && loggedUser.user_type_id === 1"
              to="/admin">
              Admin
            </router-link>
          </li>
        </ul>
      </div>
      <a @click="this.$router.push('/')" class="btn btn-ghost text-xl">TODO</a>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li>
          <router-link to="/todos">Todos</router-link>
        </li>
        <li>
          <router-link
            v-if="loggedUser && loggedUser.user_type_id === 1"
            to="/admin">
            Admin
          </router-link>
        </li>
      </ul>
    </div>
    <div class="navbar-end pr-5">
      <button
        v-if="loggedUser"
        @click="logout()">
        Logout
      </button>
      <router-link v-else to="/auth/login">Login</router-link>
    </div>
  </div>
</template>

<script setup>
import axios from '@/axios'
import { storeToRefs } from 'pinia'

const loggedUser = JSON.parse(localStorage.getItem('loggedUser'))

const logout = async () => {
  try {
    await axios.post('/api/logout');
    localStorage.removeItem('token'); // Remove token from local storage
    localStorage.removeItem('loggedUser'); // Remove loggedUser from local storage
    window.location = '/auth/login' // redirect ot login page
  } catch (error) {
    console.error('Error logging out:', error);
  }
}
</script>

<style scoped>
/* Additional styles can go here if needed */
</style>
