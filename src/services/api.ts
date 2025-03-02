
import axios from 'axios';
import { toast } from 'sonner';

// Create axios instance with base URL
const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to include JWT token in requests
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

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.msg || 'An error occurred';
    
    if (error.response?.status === 401) {
      toast.error('Session expired. Please login again.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  checkAuth: () => {
    return localStorage.getItem('token') !== null;
  }
};

// Define types for dashboard data
export type FilterParams = {
  end_year?: string;
  sector?: string;
  topic?: string;
  region?: string;
  country?: string;
  pestle?: string;
  source?: string;
  swot?: string;
};

export type TopicData = {
  name: string;
  value: number;
};

export type YearData = {
  year: number;
  avgIntensity: number;
  avgLikelihood: number;
  avgRelevance: number;
};

export type CountryData = {
  country: string;
  count: number;
};

export type IntensityData = {
  intensity: number;
  count: number;
};

export type LikelihoodData = {
  likelihood: number;
  count: number;
};

export type RegionData = {
  name: string;
  value: number;
};

export type RelevanceData = {
  topic: string;
  avgRelevance: number;
};

export type SectorData = {
  name: string;
  value: number;
};

// Dashboard API
export const dashboardAPI = {
  getData: async (page = 1, limit = 10) => {
    const response = await api.get(`/api/data?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  filterData: async (filters: FilterParams) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await api.get(`/api/filter?${params.toString()}`);
    return response.data;
  },
  
  getTopicDistribution: async () => {
    const response = await api.get('/api/topic-distribution');
    return response.data as TopicData[];
  },
  
  getYearTrend: async () => {
    const response = await api.get('/api/year-trend');
    return response.data as YearData[];
  },
  
  getCountryDistribution: async () => {
    const response = await api.get('/api/country-distribution');
    return response.data as CountryData[];
  },
  
  getIntensityDistribution: async () => {
    const response = await api.get('/api/intensity-distribution');
    return response.data as IntensityData[];
  },
  
  getLikelihoodDistribution: async () => {
    const response = await api.get('/api/likelihood-distribution');
    return response.data as LikelihoodData[];
  },
  
  getRegionDistribution: async () => {
    const response = await api.get('/api/region-distribution');
    return response.data as RegionData[];
  },
  
  getRelevanceByTopic: async () => {
    const response = await api.get('/api/relevance-chart');
    return response.data as RelevanceData[];
  },
  
  getSectorDistribution: async () => {
    const response = await api.get('/api/sector-distribution');
    return response.data as SectorData[];
  }
};
