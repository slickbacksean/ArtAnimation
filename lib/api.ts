// /lib/api.ts

import axios, { AxiosError } from 'axios';
import { Project, AnimationJob, DetectedObject, AnimationSettings } from '@/types/animation';
import { logger } from '@/lib/logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    logger.error('API request interceptor error:', error);
    return Promise.reject(error);
  }
);

export const getUserProjects = async (): Promise<Project[]> => {
  try {
    const response = await api.get<Project[]>('/projects');
    logger.info(`Retrieved ${response.data.length} user projects`);
    return response.data;
  } catch (error) {
    logger.error('Error fetching user projects:', error);
    throw error;
  }
};

export const uploadImage = async (file: File, projectId: string): Promise<{ file_path: string; results: DetectedObject[] }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);

    const response = await api.post<{ file_path: string; results: DetectedObject[] }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    logger.info(`Image uploaded successfully for project ${projectId}`);
    return response.data;
  } catch (error) {
    logger.error('Error uploading image:', error);
    throw error;
  }
};

export const startAnimation = async (
  imageId: string,
  animationType: string,
  animationSettings: AnimationSettings
): Promise<{ job_id: string }> => {
  try {
    const response = await api.post<{ job_id: string }>('/animate', {
      imageId,
      animationType,
      animationSettings,
    });

    logger.info(`Animation job started for image ${imageId}`);
    return response.data;
  } catch (error) {
    logger.error('Error starting animation:', error);
    throw error;
  }
};

export const getAnimationStatus = async (job_id: string): Promise<AnimationJob> => {
  try {
    const response = await api.get<AnimationJob>(`/animation_status/${job_id}`);
    logger.info(`Retrieved animation status for job ${job_id}`);
    return response.data;
  } catch (error) {
    logger.error('Error fetching animation status:', error);
    throw error;
  }
};

export const downloadAnimation = async (filename: string): Promise<Blob> => {
  try {
    const response = await api.get<Blob>(`/download_animation/${filename}`, {
      responseType: 'blob',
    });
    logger.info(`Animation downloaded: ${filename}`);
    return response.data;
  } catch (error) {
    logger.error('Error downloading animation:', error);
    throw error;
  }
};

export const createProject = async (projectData: Partial<Project>): Promise<Project> => {
  try {
    const response = await api.post<Project>('/projects', projectData);
    logger.info(`Project created: ${response.data.id}`);
    return response.data;
  } catch (error) {
    logger.error('Error creating project:', error);
    throw error;
  }
};

export const updateProject = async (projectId: string, projectData: Partial<Project>): Promise<Project> => {
  try {
    const response = await api.put<Project>(`/projects/${projectId}`, projectData);
    logger.info(`Project updated: ${projectId}`);
    return response.data;
  } catch (error) {
    logger.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    await api.delete(`/projects/${projectId}`);
    logger.info(`Project deleted: ${projectId}`);
  } catch (error) {
    logger.error('Error deleting project:', error);
    throw error;
  }
};

export const getProjectImages = async (projectId: string): Promise<DetectedObject[]> => {
  try {
    const response = await api.get<DetectedObject[]>(`/projects/${projectId}/images`);
    logger.info(`Retrieved ${response.data.length} images for project ${projectId}`);
    return response.data;
  } catch (error) {
    logger.error('Error fetching project images:', error);
    throw error;
  }
};

// Error handling utility
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      logger.error('API error response:', axiosError.response.data);
      return axiosError.response.data.message || 'An error occurred while processing your request.';
    } else if (axiosError.request) {
      logger.error('API error request:', axiosError.request);
      return 'No response received from the server. Please try again later.';
    }
  }
  logger.error('Unexpected error:', error);
  return 'An unexpected error occurred. Please try again later.';
};

export default api;