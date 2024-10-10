import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useIndexStore = defineStore('index', () => {
  // states
  const loggedUser = ref(JSON.parse(localStorage.getItem('loggedUser')))

  // getters
  // const getLoggedUser = computed(() => JSON.parse(localStorage.getItem('loggedUser')))

  return {
    loggedUser
  }
})
