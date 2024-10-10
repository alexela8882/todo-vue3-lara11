<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Todos</h1>

    <div class="mb-4 flex">
      <input
        v-model="newTodo"
        type="text"
        placeholder="Add a new todo"
        class="border rounded p-2 flex-grow mr-2"
      />
      <button 
        @click="createTodo" 
        class="bg-blue-500 text-white rounded p-2" 
        :class="!newTodo && 'bg-blue-300'"
        :disabled="!newTodo"
      >
        Add Todo
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      <div
        v-for="todo in todos"
        :key="todo.id"
        class="border rounded p-4 shadow-md flex flex-col">

        <!-- content -->
        <div class="flex-grow">
          <h2 class="text-xl font-bold text-gray-800 mb-2">{{ todo.todo }}</h2>
          <p class="text-gray-700 mb-4">{{ todo.description }}</p>
          <div class="flex items-center mb-2">
            <span
              :class="statusClass(todo.todo_status_id)"
              class="inline-block px-3 py-1 rounded-full text-white text-xs font-semibold">
              {{ getStatusLabel(todo.todo_status_id) }}
            </span>
          </div>
        </div>

        <!-- buttons -->
        <div class="flex mt-4">
          <button 
            @click="editTodo(todo)" 
            class="bg-yellow-500 text-white rounded-lg px-4 py-2 transition-colors hover:bg-yellow-600"
          >
            Edit
          </button>
          <button 
            @click="deleteTodo(todo.id)" 
            class="bg-red-500 text-white rounded-lg px-4 py-2 ml-2 transition-colors hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <div v-if="isEditing" class="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div class="bg-white p-4 rounded shadow-md">
        <h2 class="text-xl font-bold mb-2">Edit Todo</h2>
        
        <!-- Todo Input -->
        <input
          v-model="currentTodo.todo"
          type="text"
          placeholder="Todo"
          class="border rounded p-2 w-full mb-2"
        />

        <!-- Status Dropdown -->
        <label for="status" class="block mb-2 font-semibold">Status:</label>
        <select
          v-model="currentTodo.todo_status_id"
          id="status"
          class="border rounded p-2 w-full mb-2">
          <option v-for="status in todoStatuses" :key="status.id" :value="status.id">
            {{ status.name }}
          </option>
        </select>

        <!-- Description Input -->
        <textarea
          v-model="currentTodo.description"
          placeholder="Description"
          class="border rounded p-2 w-full mb-2"
        ></textarea>
        
        <!-- Update Button -->
        <button @click="updateTodo" class="bg-green-500 text-white rounded p-2">
          Update Todo
        </button>
        
        <!-- Cancel Button -->
        <button @click="isEditing = false" class="bg-gray-400 text-white rounded p-2 ml-2">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'

const todos = ref([])
const todoStatuses = ref([])
const newTodo = ref('')
const isEditing = ref(false)
const currentTodo = ref({})
const loggedUser = ref(JSON.parse(localStorage.getItem('loggedUser')))

// Fetch todos when the component is mounted
const fetchTodos = async () => {
  try {
    const response = await axios.get('/api/todos')
    todos.value = response.data
  } catch (error) {
    console.error('Error fetching todos:', error)
  }
}

const fetchTodoStatuses = async () => {
  try {
    const response = await axios.get('/api/todostatuses')
    todoStatuses.value = response.data
  } catch (error) {
    console.error('Error fetching todo statuses:', error)
  }
}

const getStatusLabel = (statusId) => {
  const status = todoStatuses.value.find(status => status.id === statusId)
  return status ? status.name : 'Unknown'
}

const statusClass = (statusId) => {
  switch (statusId) {
    case 1:
      return 'bg-yellow-500' // Pending
    case 2:
      return 'bg-blue-500' // In Progress
    case 3:
      return 'bg-green-500' // Completed
    default:
      return 'bg-gray-500' // Unknown status
  }
}

// Create a new todo
const createTodo = async () => {
  if (!newTodo.value) return

  try {
    const response = await axios.post('/api/todos', {
      todo: newTodo.value,
      description: '', // Set a default or allow the user to add
      user_id: loggedUser.value.id, // Assuming you have a user store
      todo_status_id: 1, // Default status or allow selection
    })
    todos.value.push(response.data)
    newTodo.value = ''
  } catch (error) {
    console.error('Error creating todo:', error)
  }
}

// Set up editing mode
const editTodo = async (todo) => {
  isEditing.value = true
  currentTodo.value = { ...todo } // Make a copy to edit
}

// Update the current todo
const updateTodo = async () => {
  try {
    await axios.put(`/api/todos/${currentTodo.value.id}`, {
      todo: currentTodo.value.todo,
      description: currentTodo.value.description,
      todo_status_id: currentTodo.value.todo_status_id,
    })
    const index = todos.value.findIndex(t => t.id === currentTodo.value.id)
    if (index !== -1) {
      todos.value[index] = { ...currentTodo.value } // Update the existing todo
    }
    isEditing.value = false
    currentTodo.value = {} // Reset currentTodo
  } catch (error) {
    console.error('Error updating todo:', error)
  }
}

// Delete a todo
const deleteTodo = async (todoId) => {
  try {
    await axios.delete(`/api/todos/${todoId}`)
    todos.value = todos.value.filter(todo => todo.id !== todoId)
  } catch (error) {
    console.error('Error deleting todo:', error)
  }
}

// Fetch todos on component mount
onMounted(async () => {
  await fetchTodos()
  await fetchTodoStatuses()
})
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>