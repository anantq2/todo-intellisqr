import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // FIX: Token key ko hardcode kiya 'token' taaki mismatch na ho
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Auth API ---

const login = async (data: any) => {
  const response = await apiClient.post('/auth/login', data);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const register = async (data: any) => {
  const response = await apiClient.post('/auth/register', data);
  
  // ✅ FIX: Register hote hi Token save karo!
  // Agar ye nahi karenge toh naya user "Unauthenticated" reh jayega
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data;
};

const forgotPassword = async (email: string) => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
};

const resetPassword = async (data: any) => {
  const response = await apiClient.post('/auth/reset-password', data);
  return response.data;
};

// --- Todo API ---

const getTodos = async () => {
  const response = await apiClient.get('/todos');
  return response.data;
};

const createTodo = async (data: any) => {
  const response = await apiClient.post('/todos', data);
  return response.data;
};

const updateTodo = async (id: string, data: any) => {
  const response = await apiClient.put(`/todos/${id}`, data);
  return response.data;
};

const deleteTodo = async (id: string) => {
  const response = await apiClient.delete(`/todos/${id}`);
  return response.data;
};

const apiService = {
  login,
  register,
  forgotPassword,
  resetPassword,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};

export const api = apiService;
export default apiService;