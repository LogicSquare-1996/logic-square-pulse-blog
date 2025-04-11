
import axiosInstance from './axios';
import { toast } from 'sonner';

export const getUploadUrl = async (fileType: string) => {
  try {
    const response = await axiosInstance.get('/s3/upload-url', {
      params: { fileType }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error getting upload URL:', error);
    toast.error(error.response?.data?.error || 'Failed to get upload URL');
    return null;
  }
};

export const uploadToS3 = async (file: File) => {
  try {
    // Get presigned URL
    const presignedUrlData = await getUploadUrl(file.type);
    
    if (!presignedUrlData) {
      return null;
    }
    
    // Upload file to S3
    await fetch(presignedUrlData.uploadURL, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });
    
    return presignedUrlData.fileUrl;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    toast.error('Failed to upload file');
    return null;
  }
};

export const deleteFile = async (key: string) => {
  try {
    await axiosInstance.delete('/s3/delete', {
      data: { key }
    });
    toast.success('File deleted successfully');
    return true;
  } catch (error: any) {
    console.error('Error deleting file:', error);
    toast.error(error.response?.data?.error || 'Failed to delete file');
    return false;
  }
};
