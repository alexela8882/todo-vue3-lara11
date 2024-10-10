import { createRouter, createWebHistory } from 'vue-router'
import authMiddleware from '@/middleware/auth'
import redirectAuthenticatedMiddleware from '@/middleware/redirectAuthenticated'
import roleMiddleware from '@/middleware/roleMiddleware'
import indexPage from '@/views/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: indexPage
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/pages/admin/index.vue'),
      beforeEnter: roleMiddleware,
      meta: { requiresAdmin: true }, // This route requires admin access
      children: [
        {
          path: 'users',
          name: 'adminUsers',
          component: () => import('@/views/pages/admin/users/index.vue')
        },
        {
          path: 'userdetails',
          name: 'adminUserDetails',
          component: () => import('@/views/pages/admin/userdetails/index.vue')
        }
      ],
    },
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('@/views/pages/auth/login.vue'),
      beforeEnter: redirectAuthenticatedMiddleware
    },
    {
      path: '/todos',
      name: 'todoIndex',
      component: () => import('@/views/pages/todos/index.vue'),
      children: [
        {
          path: 'statuses',
          name: 'todoStatuses',
          component: () => import('@/views/pages/todos/statuses/index.vue')
        }
      ],
      beforeEnter: authMiddleware,
    }
  ]
})

export default router
