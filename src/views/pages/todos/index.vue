<template>
  <div class="container mx-auto w-full md:w-9/12 lg:w-6/12 p-4">
    <h1 class="text-2xl font-bold mb-4">Todos</h1>

    <div class="mb-4 flex w-full gap-2">
      <!-- Input Section -->
      <label class="input input-bordered flex-grow flex items-center gap-2">
        <input
          @keypress.enter="_storeTodo"
          v-model="newTodo"
          type="text"
          class="grow"
          placeholder="add your todos here..." />
      </label>

      <!-- Button Section -->
      <button 
        @click="_storeTodo" 
        :disabled="!newTodo" 
        class="btn flex-shrink-0">
        Add
      </button>
    </div>

    <!-- Legends -->
    <div class="flex gap-1 mb-4">
      <div v-for="(status, sx) in todoStatuses" :key="sx">
        <button
          @click="status.toggle = !status.toggle"
          class="btn"
          :class="`${statusClass('border', status.id)} border-${status.toggle ? '1' : '0'}`">
          {{ status.name }}
          <div class="text-white badge badge-sm p-2" :class="statusClass('bg', status.id)">
            {{ todoStatusCount(status.id) }}
          </div>
        </button>
      </div>
    </div>

    <div v-if="toggledStatuses && toggledStatuses.length <= 0">
      No toggled todos
    </div>
    <div v-else>
      <div
        v-if="filteredTodos && filteredTodos.length > 0"
        v-for="todo in filteredTodos"
        :key="todo.id">
        <div
          class="card bg-base-100 shadow-xl mb-4 border border-t-4"
          :class="statusClass('border', todo.status.id)">
          <div v-if="!todo.edit">
            <!-- Edit icon -->
            <button
              @click="editTodo(todo)"
              class="absolute top-2 right-2 text-gray-400 btn btn-circle btn-xs btn-link">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </button>
          </div>
          <div v-else>
            <!-- Delete icon -->
            <button
              @click="_deleteTodo(todo.id)"
              class="absolute top-2 right-10 text-red-400 btn btn-circle btn-xs btn-link">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
            <!-- Update icon -->
            <button
              @click="_updateTodo"
              class="absolute top-2 right-2 text-green-600 btn btn-circle btn-xs btn-link">
              <!-- Pencil Icon (Heroicons example) -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </button>
          </div>

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
              <option v-for="status in getTodoStatuses" :key="status.id" :value="status.id">
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
      <div v-else>
        No TODOS. Please create one.
      </div>
    </div>

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
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import axios from '@/axios'

const todoStatuses = ref([])
const newTodo = ref('')
const isEditing = ref(false)
const currentTodo = ref()
const preventiveModal = ref(false)

// stores
import { useTodoStore } from '@/stores/todos'
const todoStore = useTodoStore()
const { getTodos, getTodoStatuses } = storeToRefs(todoStore)
const {
  fetchTodos,
  fetchTodoStatuses,
  storeTodo,
  updateTodo,
  deleteTodo
} = todoStore

const todoStatusCount = (status_id) => {
  const count = getTodos.value.filter(t => t.todo_status_id === status_id).length
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

const toggledStatuses = computed(() => {
  // Get the ids of the statuses where toggle is true
  return todoStatuses.value.filter(status => status.toggle).map(status => status.id)
})

const filteredTodos = computed(() => {
  // Filter todos based on whether their status id is in the toggled statuses
  return getTodos.value.filter(todo => toggledStatuses.value.includes(todo.todo_status_id))
})

// Create a new todo
const _storeTodo = async () => {
  if (!newTodo.value) return

  // store new todos
  const response = await storeTodo(newTodo.value)
  if (response) newTodo.value = '' // reset
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
const _updateTodo = async () => {
  const response = await updateTodo(currentTodo.value)
  if (response) {
    isEditing.value = false
    currentTodo.value = null // Reset currentTodo
  }
}

// Delete a todo
const _deleteTodo = async (id) => {
  const response = await deleteTodo(id)
  if (response) currentTodo.value = null // reset
}

// Fetch todos on component mount
onMounted(async () => {
  await fetchTodos()
  await fetchTodoStatuses()

  // assign
  todoStatuses.value = getTodoStatuses.value.map(status => ({
    ...status,
    toggle: true // toggle all
  }))
})
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>