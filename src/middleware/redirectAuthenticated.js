export default function redirectAuthenticatedMiddleware(to, from, next) {
  const token = localStorage.getItem('token')

  // If the user is already logged in and trying to access the login page
  if (to.name === 'login' && token) {
    return next({ name: 'todoIndex' }) // Redirect to todo index
  }

  next() // Allow access to the requested route
}
