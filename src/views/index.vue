<script setup>
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main>
    <!-- Hero Section -->
    <div class="hero min-h-screen bg-base-200">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">Organize Your Day</h1>
          <p class="py-6">Stay on top of your tasks with our easy-to-use todo list app. Create, edit, and track your tasks effortlessly.</p>
          <router-link to="/todos" class="btn btn-outline btn-secondary mt-4">Get Started</router-link>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-12" id="todo">
      <div class="max-w-7xl mx-auto text-center">
        <h2 class="text-4xl font-bold text-gray-800 mb-6">Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card shadow-lg">
            <div class="card-body">
              <h3 class="card-title">Create Tasks</h3>
              <p>Quickly add new tasks with ease.</p>
            </div>
          </div>
          <div class="card shadow-lg">
            <div class="card-body">
              <h3 class="card-title">Track Progress</h3>
              <p>Keep an eye on task status and stay productive.</p>
            </div>
          </div>
          <div class="card shadow-lg">
            <div class="card-body">
              <h3 class="card-title">Collaborate</h3>
              <p>Share your to-do list and work with your team.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
