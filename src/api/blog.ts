
import axiosInstance from './axios';
import { toast } from 'sonner';

export const getBlogs = async (params: any = {}) => {
  try {
    const response = await axiosInstance.get('/blogs', { params });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    toast.error(error.response?.data?.error || 'Failed to fetch blogs');
    return { blogs: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
  }
};

export const getFeaturedBlogs = async () => {
  try {
    const response = await axiosInstance.get('/blogs', { 
      params: { featured: true, limit: 5 } 
    });
    return response.data.blogs;
  } catch (error: any) {
    console.error('Error fetching featured blogs:', error);
    toast.error(error.response?.data?.error || 'Failed to fetch featured blogs');
    return [];
  }
};

export const getBlogById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/blogs/${id}`);
    return response.data.blog;
  } catch (error: any) {
    console.error(`Error fetching blog ${id}:`, error);
    toast.error(error.response?.data?.error || 'Failed to fetch blog');
    return null;
  }
};

export const createBlog = async (blogData: any) => {
  try {
    const response = await axiosInstance.post('/blogs', blogData);
    toast.success('Blog created successfully');
    return response.data.blog;
  } catch (error: any) {
    console.error('Error creating blog:', error);
    toast.error(error.response?.data?.error || 'Failed to create blog');
    return null;
  }
};

export const updateBlog = async (id: string, blogData: any) => {
  try {
    const response = await axiosInstance.put(`/blogs/${id}`, blogData);
    toast.success('Blog updated successfully');
    return response.data.blog;
  } catch (error: any) {
    console.error(`Error updating blog ${id}:`, error);
    toast.error(error.response?.data?.error || 'Failed to update blog');
    return null;
  }
};

export const deleteBlog = async (id: string) => {
  try {
    await axiosInstance.delete(`/blogs/${id}`);
    toast.success('Blog deleted successfully');
    return true;
  } catch (error: any) {
    console.error(`Error deleting blog ${id}:`, error);
    toast.error(error.response?.data?.error || 'Failed to delete blog');
    return false;
  }
};

export const likeBlog = async (id: string) => {
  try {
    const response = await axiosInstance.put(`/blogs/${id}/like`);
    return response.data;
  } catch (error: any) {
    console.error(`Error liking blog ${id}:`, error);
    toast.error(error.response?.data?.error || 'Failed to like blog');
    return null;
  }
};

export const bookmarkBlog = async (id: string) => {
  try {
    const response = await axiosInstance.put(`/blogs/${id}/bookmark`);
    toast.success(response.data.message);
    return response.data;
  } catch (error: any) {
    console.error(`Error bookmarking blog ${id}:`, error);
    toast.error(error.response?.data?.error || 'Failed to bookmark blog');
    return null;
  }
};

export const getBookmarkedBlogs = async () => {
  try {
    const response = await axiosInstance.get('/blogs/bookmarks');
    return response.data.blogs;
  } catch (error: any) {
    console.error('Error fetching bookmarked blogs:', error);
    toast.error(error.response?.data?.error || 'Failed to fetch bookmarks');
    return [];
  }
};

export const addComment = async (blogId: string, text: string) => {
  try {
    const response = await axiosInstance.post(`/blogs/${blogId}/comment`, { text });
    return response.data.comments;
  } catch (error: any) {
    console.error(`Error adding comment to blog ${blogId}:`, error);
    toast.error(error.response?.data?.error || 'Failed to add comment');
    return null;
  }
};

export const addReply = async (blogId: string, commentId: string, text: string) => {
  try {
    const response = await axiosInstance.post(`/blogs/${blogId}/comment/${commentId}/reply`, { text });
    return response.data.comments;
  } catch (error: any) {
    console.error(`Error adding reply to comment ${commentId}:`, error);
    toast.error(error.response?.data?.error || 'Failed to add reply');
    return null;
  }
};

export const rateBlog = async (id: string, rating: number) => {
  try {
    if (rating < 1 || rating > 5) {
      toast.error('Rating must be between 1 and 5');
      return null;
    }
    
    const response = await axiosInstance.put(`/blogs/${id}/rate`, { rating });
    toast.success('Blog rated successfully');
    return response.data.blog;
  } catch (error: any) {
    console.error(`Error rating blog ${id}:`, error);
    toast.error(error.response?.data?.error || 'Failed to rate blog');
    return null;
  }
};

export const getUserBlogs = async (userId: string, params: any = {}) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}/blogs`, { params });
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching user blogs for ${userId}:`, error);
    toast.error(error.response?.data?.error || 'Failed to fetch user blogs');
    return { blogs: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
  }
};
