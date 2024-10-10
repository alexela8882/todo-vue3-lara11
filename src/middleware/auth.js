import axios from '@/axios';

export default async function authMiddleware(to, from, next) {
  const token = localStorage.getItem('token')

  if (!token) {
    // If there is no token, redirect to the login page
    next({ name: 'login' });
    return;
  }

  try {
    // Verify the token (you may need to adjust this endpoint)
    await axios.get('/api/auth/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // If the token is valid, proceed to the requested route
    next();
  } catch (error) {
    console.error('Authentication failed:', error);
    // If the token is invalid, redirect to the login page
    next({ name: 'login' });
  }
}
