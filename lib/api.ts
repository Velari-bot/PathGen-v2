import axios from 'axios';
import { Replay, Stats, ServerHealth, User } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://155.138.163.88:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get session headers
const getSessionHeaders = (session?: any) => {
  if (!session?.user) return {};
  
  return {
    'X-User-Id': session.user.discordId || session.user.id,
    'X-Username': session.user.username || session.user.name,
    'X-User-Avatar': session.user.avatarUrl || session.user.avatar || '',
    'X-Is-Admin': session.user.isAdmin ? 'true' : 'false',
  };
};

// Auth
export const authAPI = {
  getCurrentUser: async () => {
    const response = await api.get('/me');
    return response.data;
  },
  
  logout: async () => {
    const response = await api.get('/auth/logout');
    return response.data;
  },
};

// Replays
export const replaysAPI = {
  getAll: async (limit = 100, offset = 0) => {
    const response = await api.get<{ replays: Replay[]; total: number }>(
      `/api/replays?limit=${limit}&offset=${offset}`
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Replay>(`/api/replays/${id}`);
    return response.data;
  },

  upload: async (formData: FormData, session?: any) => {
    const headers = getSessionHeaders(session);
    const response = await api.post('/api/replays/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...headers,
      },
    });
    return response.data;
  },

  delete: async (id: string, session?: any) => {
    const headers = getSessionHeaders(session);
    const response = await api.delete(`/api/replays/${id}`, {
      headers,
    });
    return response.data;
  },

  download: (id: string) => {
    return `${API_BASE_URL}/api/replays/${id}/download`;
  },

  getStats: async () => {
    const response = await api.get<Stats>('/api/replays/stats/overview');
    return response.data;
  },
};

// Users
export const usersAPI = {
  getAll: async (limit = 50, offset = 0) => {
    const response = await api.get<{ users: User[]; total: number }>(
      `/api/users?limit=${limit}&offset=${offset}`
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<User>(`/api/users/${id}`);
    return response.data;
  },

  getReplays: async (id: string) => {
    const response = await api.get<{ replays: Replay[]; total: number }>(
      `/api/users/${id}/replays`
    );
    return response.data;
  },
};

// Health
export const healthAPI = {
  get: async () => {
    const response = await api.get<ServerHealth>('/api/health');
    return response.data;
  },
};

export default api;
