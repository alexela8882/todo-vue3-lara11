<template>
  <div class="container mx-auto w-5/12 p-4">
    <h1 class="text-2xl font-bold mb-4">Todos</h1>

    <!-- Legends -->
    <div class="flex gap-1 mb-4">
      <div v-for="(status, sx) in todoStatuses" :key="sx">
        <button class="btn">
          {{ status.name }}
          <div class="text-white badge badge-sm p-2" :class="statusClass('bg', status.id)">
            {{ todoStatusCount(status.id) }}
          </div>
        </button>
      </div>
    </div>

    <div class="mb-4 flex w-full gap-2">
      <!-- Input Section -->
      <label class="input input-bordered flex-grow flex items-center gap-2">
        <input
          @keypress.enter="createTodo"
          v-model="newTodo"
          type="text"
          class="grow"
          placeholder="add your todos here..." />
      </label>

      <!-- Button Section -->
      <button 
        @click="createTodo" 
        :disabled="!newTodo" 
        class="btn flex-shrink-0">
        Add
      </button>
    </div>

    <div>
      <div
        v-for="todo in todos"
        :key="todo.id">
        <div
          class="card bg-base-100 shadow-xl mb-4 border border-t-4"
          :class="statusClass('border', todo.status.id)">
          <!-- Pencil Icon in Top Right -->
          <button
            v-if="!todo.edit"
            @click="editTodo(todo)"
            class="absolute top-2 right-2 text-gray-400 btn btn-circle btn-xs btn-link">
            <!-- Pencil Icon (Heroicons example) -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </button>
          <button
            v-else
            @click="updateTodo"
            class="absolute top-2 right-2 text-gray-400 btn btn-circle btn-xs btn-link">
            <!-- Pencil Icon (Heroicons example) -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </button>

          <!-- Editing content -->
          <div v-if="todo.edit" class="card-body">
            <input
              v-model="currentTodo.todo"
              type="text"
              placeholder="Todo"
              class="input input-ghost w-full"
            />

            <select
              v-model="currentTodo.todo_status_id"
              id="status"
              class="select select-bordered w-full">
              <option v-for="status in todoStatuses" :key="status.id" :value="status.id">
                {{ status.name }}
              </option>
            </select>

            <textarea
              v-model="currentTodo.description"
              placeholder="Description"
              class="textarea textarea-bordered w-full"
            ></textarea>
          </div>

          <!-- Content -->
          <div v-else class="card-body">
            <h2 class="card-title">{{ todo.todo }}</h2>
            <p>{{ todo.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <!-- <div v-if="isEditing" class="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div class="bg-white p-4 rounded shadow-md">
        <h2 class="text-xl font-bold mb-2">Edit Todo</h2> -->
        
        <!-- Todo Input -->
        <!-- <input
          v-model="currentTodo.todo"
          type="text"
          placeholder="Todo"
          class="border rounded p-2 w-full mb-2"
        /> -->

        <!-- Status Dropdown -->
        <!-- <label for="status" class="block mb-2 font-semibold">Status:</label>
        <select
          v-model="currentTodo.todo_status_id"
          id="status"
          class="border rounded p-2 w-full mb-2">
          <option v-for="status in todoStatuses" :key="status.id" :value="status.id">
            {{ status.name }}
          </option>
        </select> -->

        <!-- Description Input -->
        <!-- <textarea
          v-model="currentTodo.description"
          placeholder="Description"
          class="border rounded p-2 w-full mb-2"
        ></textarea> -->
        
        <!-- Update Button -->
        <!-- <button @click="updateTodo" class="bg-green-500 text-white rounded p-2">
          Update Todo
        </button> -->
        
        <!-- Cancel Button -->
        <!-- <button @click="isEditing = false" class="bg-gray-400 text-white rounded p-2 ml-2">
          Cancel
        </button> -->
      <!-- </div> -->
    <!-- </div> -->

    <!-- Modal Checkbox Control -->
    <input type="checkbox" id="my_modal_7" class="modal-toggle" v-model="preventiveModal" />

    <!-- Modal Content -->
    <div class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Please save your current edits first!</h3>
        <div class="modal-action">
          <!-- Close Button -->
          <label for="my_modal_7" class="btn">Close</label>
        </div>
      </div>
      <label class="modal-backdrop" for="my_modal_7">Close</label>
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
const currentTodo = ref()
const loggedUser = ref(JSON.parse(localStorage.getItem('loggedUser')))
const preventiveModal = ref(false)

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

const todoStatusCount = (status_id) => {
  const count = todos.value.filter(t => t.todo_status_id === status_id).length
  return count
}

const statusClass = (prefix, statusId) => {
  switch (statusId) {
    case 1:
      return `${prefix}-yellow-500` // Pending
    case 2:
      return `${prefix}-blue-500` // In Progress
    case 3:
      return `${prefix}-green-500` // Completed
    default:
      return `${prefix}-gray-500` // Unknown status
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
  if (currentTodo.value) preventiveModal.value = true
  else {
    todo.edit = true // edit mode
    currentTodo.value = { ...todo, edit: true } // Make a copy to edit
  }
}

// Update the current todo
const updateTodo = async () => {
  try {
    const response = await axios.put(`/api/todos/${currentTodo.value.id}`, {
      todo: currentTodo.value.todo,
      description: currentTodo.value.description,
      todo_status_id: currentTodo.value.todo_status_id,
    })

    const updatedTodo = response.data

    const index = todos.value.findIndex(t => t.id === currentTodo.value.id)
    if (index !== -1) {
      todos.value[index] = { ...updatedTodo } // Update the existing todo
    }
    isEditing.value = false
    currentTodo.value = {} // Reset currentTodo
  } catch (error) {
    console.error('Error updating todo:', error)
  } finally {
    // close all opened edits
    todos.value.map(t => t.edit = false)

    // resets
    currentTodo.value = null
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