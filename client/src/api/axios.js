import axios from 'axios';

const API = axios.create({
 baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Automatically add the JWT token to every request if it exists
API.interceptors.request.use((req) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.token) {
    // This 'Bearer' string matches the 'startsWith(Bearer)' check in the backend
    req.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return req;
});

export default API;