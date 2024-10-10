import axios from '@/axios'

export default async function roleMiddleware(to, from, next) {
  const token = localStorage.getItem('token')

  // If there's no token, redirect to login
  if (!token) {
    return next({ name: 'login' })
  }

  try {
    // Verify the token and fetch the user data
    const response = await axios.get('/api/auth/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const user = response.data

    // Check if the user type is admin (1)
    if (user.user_type_id === 1) {
      // Allow access to admin routes
      return next()
    }

    // If the user is a regular user (2) and tries to access admin routes
    if (to.meta.requiresAdmin) {
      return next({ name: 'todoIndex' }) // Redirect to a default page for users
    }

    // If the user is allowed access
    next()
  } catch (error) {
    console.error('Authorization failed:', error)
    // Redirect to the login page if authentication fails
    next({ name: 'login' })
  }
}
