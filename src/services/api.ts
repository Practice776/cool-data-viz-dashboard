
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

// Helper to build URL params from filters
const buildFilterParams = (filters: FilterParams = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  return params.toString();
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
  
  filterData: async (filters: FilterParams = {}) => {
    const params = buildFilterParams(filters);
    const response = await api.get(`/api/filter?${params}`);
    return response.data;
  },
  
  getTopicDistribution: async (filters: FilterParams = {}) => {
    const params = buildFilterParams(filters);
    const url = `/api/topic-distribution${params ? `?${params}` : ''}`;
    const response = await api.get(url);
    return response.data as TopicData[];
  },
  
  getYearTrend: async (filters: FilterParams = {}) => {
    const params = buildFilterParams(filters);
    const url = `/api/year-trend${params ? `?${params}` : ''}`;
    const response = await api.get(url);
    return response.data as YearData[];
  },
  
  getCountryDistribution: async (filters: FilterParams = {}) => {
    const params = buildFilterParams(filters);
    const url = `/api/country-distribution${params ? `?${params}` : ''}`;
    const response = await api.get(url);
    return response.data as CountryData[];
  },
  
  getIntensityDistribution: async (filters: FilterParams = {}) => {
    const params = buildFilterParams(filters);
    const url = `/api/intensity-distribution${params ? `?${params}` : ''}`;
    const response = await api.get(url);
    return response.data as IntensityData[];
  },
  
  getLikelihoodDistribution: async (filters: FilterParams = {}) => {
    const params = buildFilterParams(filters);
    const url = `/api/likelihood-distribution${params ? `?${params}` : ''}`;
    const response = await api.get(url);
    return response.data as LikelihoodData[];
  },
  
  getRegionDistribution: async (filters: FilterParams = {}) => {
    const params = buildFilterParams(filters);
    const url = `/api/region-distribution${params ? `?${params}` : ''}`;
    const response = await api.get(url);
    return response.data as RegionData[];
  },
  
  getRelevanceByTopic: async (filters: FilterParams = {}) => {
    const params = buildFilterParams(filters);
    const url = `/api/relevance-chart${params ? `?${params}` : ''}`;
    const response = await api.get(url);
    return response.data as RelevanceData[];
  },
  
  getSectorDistribution: async (filters: FilterParams = {}) => {
    const params = buildFilterParams(filters);
    const url = `/api/sector-distribution${params ? `?${params}` : ''}`;
    const response = await api.get(url);
    return response.data as SectorData[];
  }
};
