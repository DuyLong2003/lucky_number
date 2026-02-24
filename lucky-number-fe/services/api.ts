import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const TOKEN_KEY = 'auth_token';

// Callback function for 401 errors
let onUnauthorized: (() => void) | null = null;

export const setOnUnauthorizedCallback = (callback: () => void) => {
  onUnauthorized = callback;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      if (onUnauthorized) {
        onUnauthorized();
      }
    }
    return Promise.reject(error);
  }
);

// Token management functions
export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

// Auth interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    name: string;
    email: string;
    funcRoleId: string;
    uiRoleId: string[];
    gender: string;
    isPasswordChange: boolean;
    status: string;
    id: string;
  };
  tokens: {
    access: {
      token: string;
      expires: string;
    };
    refresh: {
      token: string;
      expires: string;
    };
  };
}

// Participant interfaces
export interface Participant {
  id: string;
  fullName: string;
  phoneNumber: string;
  luckyNumber: string;
  isWinner: boolean;
  createdAt: string;
}

export interface RegisterParticipantRequest {
  fullName: string;
  phoneNumber: string;
  org: string;
}

export interface RegisterParticipantResponse {
  fullName: string;
  phoneNumber: string;
  luckyNumber: string;
  isWinner: boolean;
  id: string;
  createdAt: string;
}

export interface GetParticipantsParams {
  fullName?: string;
  phoneNumber?: string;
  isWinner?: boolean;
  limit?: number;
  sortBy?: string;
  populate?: string;
  select?: string;
  page?: number;
}

export interface GetParticipantsResponse {
  results: Participant[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface DrawWinnerResponse extends Participant {
  winOrder?: number;
}

export interface StatsResponse {
  totalParticipants: number;
  totalWinners: number;
  remainingParticipants: number;
}

// API Functions

/**
 * Đăng ký tham gia
 */
export const registerParticipant = async (
  data: RegisterParticipantRequest
): Promise<RegisterParticipantResponse> => {
  const response = await apiClient.post('/participants/register', data);
  return response.data;
};

/**
 * Lấy danh sách người tham gia
 */
export const getParticipants = async (
  params?: GetParticipantsParams
): Promise<GetParticipantsResponse> => {
  const response = await apiClient.get('/participants', { params });
  return response.data;
};

/**
 * Lấy thông tin theo ID
 */
export const getParticipantById = async (
  participantId: string
): Promise<Participant> => {
  const response = await apiClient.get(`/participants/${participantId}`);
  return response.data;
};

/**
 * Tra cứu theo SĐT
 */
export const getParticipantByPhone = async (
  phoneNumber: string
): Promise<Participant> => {
  const response = await apiClient.get(`/participants/phone/${phoneNumber}`);
  return response.data;
};

/**
 * Quay số trúng thưởng
 */
export const drawWinner = async (): Promise<DrawWinnerResponse> => {
  const response = await apiClient.post('/participants/draw/winner');
  return response.data;
};

/**
 * Reset danh sách quay thưởng
 */
export const resetDraw = async (): Promise<{ message: string }> => {
  const response = await apiClient.post('/participants/draw/reset');
  return response.data;
};

/**
 * Xóa tất cả người tham gia
 */
export const deleteAllParticipants = async (): Promise<{ message: string }> => {
  const response = await apiClient.delete('/participants/delete/all');
  return response.data;
};

/**
 * Lấy thống kê
 */
export const getStats = async (): Promise<StatsResponse> => {
  const response = await apiClient.get('/participants/stats/summary');
  return response.data;
};

/**
 * Đăng nhập
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post('/auth/login', data);
  if (response.data.tokens?.access?.token) {
    setToken(response.data.tokens.access.token);
  }
  return response.data;
};

export default apiClient;
