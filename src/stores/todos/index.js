import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from '@/axios'

export const useTodoStore = defineStore('todo', () => {
  // refs
  const loggedUser = ref(JSON.parse(localStorage.getItem('loggedUser')))

  // states
  const todos = ref([])
  const allTodos = ref([])
  const todoStatuses = ref([])

  // getters
  const getTodos = computed(() => todos.value)
  const getAllTodos = computed(() => allTodos.value)
  const getTodoStatuses = computed(() => todoStatuses.value)

  const toggledStatuses = computed(() => {
    // Get the ids of the statuses where toggle is true
    return getTodoStatuses.value.filter(status => status.toggle).map(status => status.id)
  })
  
  const filteredTodos = computed(() => {
    // Filter todos based on whether their status id is in the toggled statuses
    return getTodos.value.filter(todo => toggledStatuses.value.includes(todo.todo_status_id))
  })

  // actions
  const toggleStatus = (status) => {
    todoStatuses.value = todoStatuses.value.map(s => {
      if (s.id === status.id) {
        return {
          ...s,
          toggle: !s.toggle // Toggle the status
        }
      }
      return s
    })
  }

  const fetchTodos = async () => {
    try {
      const response = await axios.get('/api/todos')
      todos.value = response.data
    } catch (error) {
      console.error('Error fetching all todos:', error)
    }
  }

  const fetchTodoStatuses = async () => {
    try {
      const response = await axios.get('/api/todostatuses')
      todoStatuses.value = response.data.map(data => ({
        ...data,
        toggle: true
      }))
    } catch (error) {
      console.error('Error fetching todo statuses:', error)
    }
  }

  const storeTodo = async (payload) => {
    try {
      const response = await axios.post('/api/todos', {
        todo: payload,
        description: '', // Set a default or allow the user to add
        user_id: loggedUser.value.id, // Assuming you have a user store
        todo_status_id: 1, // Default status or allow selection
      })
      todos.value.push(response.data)

      // return response
      return response.data
    } catch (error) {
      console.error('Error creating todo:', error)
    }
  }

  const updateTodo = async (payload) => {
    try {
      const response = await axios.put(`/api/todos/${payload.id}`, {
        todo: payload.todo,
        description: payload.description,
        todo_status_id: payload.todo_status_id,
      })
  
      const updatedTodo = response.data
  
      const index = todos.value.findIndex(t => t.id === payload.id)
      if (index !== -1) {
        todos.value[index] = { ...updatedTodo } // Update the existing todo
      }

      // close all opened edits
      todos.value.map(t => t.edit = false)

      console.log(todos.value)
      // return response
      return response.data
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`)
      todos.value = todos.value.filter(todo => todo.id !== id)

      return todos.value
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const fetchAllTodos = async () => {
    try {
      const response = await axios.get('/api/todos-all')
      allTodos.value = response.data
    } catch (error) {
      console.error('Error fetching all todos:', error)
    }
  }

  return {
    getTodos,
    filteredTodos,
    getAllTodos,
    getTodoStatuses,
    toggledStatuses,
    fetchTodos,
    fetchAllTodos,
    fetchTodoStatuses,
    toggleStatus,
    storeTodo,
    updateTodo,
    deleteTodo
  }
})
