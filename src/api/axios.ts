
import axios from 'axios';
import { toast } from 'sonner';

// Create axios instance with base URL
const axiosInstance = axios.create({
  // Change this to match your API URL
  baseURL: 'http://localhost:5000/api', // or your deployed API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific error statuses
      switch (error.response.status) {
        case 401:
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          break;
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          console.log('Resource not found.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          if (error.response.data?.error) {
            toast.error(error.response.data.error);
          }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      toast.error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request
      console.error('Request error:', error.message);
      toast.error('Failed to send request.');
    }
    
    // Return the error for further handling
    return Promise.reject(error);
  }
);

export default axiosInstance;
