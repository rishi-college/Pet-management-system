import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const breedService = {
  
  getAllBreeds: async () => {
    try {
      const response = await api.get('/breeds');
      return { data: response.data, success: true };
    } catch (error) {
      return { 
        data: [], 
        success: false, 
        error: error.response?.data?.error || 'Failed to fetch breeds' 
      };
    }
  },
  
  getBreed: async (id) => {
    try {
      const response = await api.get(`/breeds/${id}`);
      return { data: response.data, success: true };
    } catch (error) {
      return { 
        data: null, 
        success: false, 
        error: error.response?.data?.error || 'Failed to fetch breed' 
      };
    }
  },
  
  createBreed: async (breedData) => {
    try {
      const response = await api.post('/breeds', breedData);
      return { data: response.data, success: true };
    } catch (error) {
      return { 
        data: null, 
        success: false, 
        error: error.response?.data?.error || 'Failed to create breed' 
      };
    }
  },
  
  updateBreed: async (id, breedData) => {
    try {
      const response = await api.put(`/breeds/${id}`, breedData);
      return { data: response.data, success: true };
    } catch (error) {
      return { 
        data: null, 
        success: false, 
        error: error.response?.data?.error || 'Failed to update breed' 
      };
    }
  },
  
  deleteBreed: async (id) => {
    try {
      const response = await api.delete(`/breeds/${id}`);
      return { data: response.data, success: true };
    } catch (error) {
      return { 
        data: null, 
        success: false, 
        error: error.response?.data?.error || 'Failed to delete breed' 
      };
    }
  },
  
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return { data: response.data, success: true };
    } catch (error) {
      return { 
        data: null, 
        success: false, 
        error: 'API is not available' 
      };
    }
  }
};

export default api;