
import axios from 'axios';
import { toast } from 'sonner';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api', // Change this to match your API's base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authorization token
api.interceptors.request.use(
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
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    
    if (error.response?.status === 401) {
      toast.error('Session expired. Please login again.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Auth services
const auth = {
  login: (credentials: { handle: string; password: string }) => 
    api.post('/login', credentials),
  
  register: (userData: {
    username: string;
    email: string;
    phone: string;
    name: { first: string; last: string };
    password: string;
    rePassword: string;
  }) => api.post('/signup', userData),
  
  verifyEmail: (data: { email: string; otp: string }) => 
    api.post('/verify', data),
  
  resendOTP: (data: { email: string }) => 
    api.post('/resendOTP', data),
  
  googleLogin: (idToken: string) => 
    api.post('/google', { idToken }),
  
  forgotPassword: (handle: string) => 
    api.post('/forgotpassword', { handle }),
  
  resetPassword: (data: { 
    token: string; 
    email: string; 
    password: string; 
    rePassword: string 
  }) => api.post('/resetpassword', data),
  
  getAwsCredentials: () => 
    api.get('/awstempcreds'),
};

// User services
const user = {
  getCurrentUser: () => 
    api.get('/user/me'),
  
  updateProfile: (userData: any) => 
    api.put('/user/me', userData),
  
  getProfilePictureUploadUrl: () => 
    api.put('/user/profile-picture'),
  
  getUserProfile: (id: string) => 
    api.get(`/user/profile/${id}`),
  
  getUserHistory: (page = 1, limit = 10) => 
    api.get(`/user/history?page=${page}&limit=${limit}`),
  
  getUserById: (id: string) => 
    api.get(`/user/${id}`),
};

// Blog services
const blog = {
  createBlog: (blogData: any) => 
    api.post('/createBlog', blogData),
  
  getBlogs: (params: any) => 
    api.post('/blogs', params),
  
  getBlogById: (id: string) => 
    api.get(`/blog/${id}`),
  
  updateBlog: (id: string, blogData: any) => 
    api.post(`/updateBlog/${id}`, blogData),
  
  deleteBlog: (id: string) => 
    api.get(`/deleteBlog/${id}`),
  
  publishDraftBlog: (id: string) => 
    api.put(`/blog/publish/${id}`),
  
  getDraftBlogs: () => 
    api.get('/blogs/drafts'),
  
  getAuthors: () => 
    api.get('/blogs/authors'),
};

// Bookmark services
const bookmark = {
  toggleBookmark: (id: string) => 
    api.post(`/blog/bookmark/${id}`),
  
  getBookmarks: () => 
    api.get('/blogs/bookmarks/'),
};

// Blog interaction services
const interaction = {
  postInteraction: (id: string, data: any) => 
    api.post(`/post/interaction/${id}`, data),
  
  getLikes: (id: string) => 
    api.get(`/post/likes/${id}`),
  
  getComments: (id: string, page = 1, limit = 10) => 
    api.post(`/post/comments/${id}`, { page, limit }),
  
  getReplies: (id: string, page = 1, limit = 10) => 
    api.post(`/post/replies/${id}`, { page, limit }),
  
  likeComment: (id: string, like = true) => 
    api.put(`/post/comment/like/${id}`, { like }),
  
  unlikeComment: (id: string) => 
    api.put(`/post/comment/like/${id}`, { unlike: true }),
  
  unlikePost: (id: string) => 
    api.delete(`/post/unlike/${id}`),
  
  updateComment: (id: string, content: string) => 
    api.put(`/post/update/comment/${id}`, { content }),
  
  deleteInteraction: (id: string) => 
    api.delete(`/post/deleteinteraction/${id}`),
};

// History services
const history = {
  saveSearchHistory: (data: { userId: string; query: string; thumbnail: string }) => 
    api.post('/search/history', data),
};

// Admin services
const admin = {
  getDashboardStats: () => 
    api.get('/admin/dashboard/stats'),
  
  getUsers: (params: any = {}) => 
    api.get('/admin/users', { params }),
  
  getUserDetails: (id: string) => 
    api.get(`/admin/user/${id}`),
  
  updateUserRole: (id: string, role: string) => 
    api.put(`/admin/user/${id}/role`, { role }),
  
  getBlogs: (params: any = {}) => 
    api.get('/admin/blogs', { params }),
  
  deleteBlog: (id: string) => 
    api.delete(`/admin/blogs/${id}`),
  
  getComments: (params: any = {}) => 
    api.get('/admin/comments', { params }),
  
  deleteComment: (id: string) => 
    api.delete(`/admin/comments/${id}`),
  
  sendBroadcast: (data: any) => 
    api.post('/admin/broadcast', data),
  
  getBroadcasts: (params: any = {}) => 
    api.get('/admin/broadcasts', { params }),
  
  exportData: (type: 'users' | 'blogs' | 'comments') => 
    api.get(`/admin/exports/${type}`, { responseType: 'blob' }),
};

// Export all services
export default {
  auth,
  user,
  blog,
  bookmark,
  interaction,
  history,
  admin,
};
