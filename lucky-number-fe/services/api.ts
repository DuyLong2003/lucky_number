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
      clearUserRoleName();
      if (onUnauthorized) {
        onUnauthorized();
      } else if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
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
  clearUserRoleName();
};

export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

export const getUserIdFromToken = (): string | null => {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || null;
  } catch (e) {
    return null;
  }
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
    funcRoleId: {
      _id: string;
      name: string;
      id: string;
    };
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
  userId: string;
}

export interface RegisterParticipantResponse {
  fullName: string;
  phoneNumber: string;
  luckyNumber: string;
  isWinner: boolean;
  id: string;
  createdAt: string;
  org?: string;
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
    // Lưu Role Name thay vì Role ID
    if (response.data.user?.funcRoleId?.name) {
      localStorage.setItem('user_role_name', response.data.user.funcRoleId.name);
    }
  }
  return response.data;
};

export const logout = async (): Promise<void> => {
  const refreshToken = '';
  try {
    await apiClient.post('/auth/logout', { refreshToken });
  } catch (err) {
    console.error('Logout API failed, skipping...', err);
  } finally {
    clearToken();
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  await apiClient.post('/auth/forgot-password', { email });
};

export const resetPassword = async (token: string, password: string): Promise<void> => {
  await apiClient.post(`/auth/reset-password?token=${token}`, { password });
};

export const getUserRoleName = (): string | null => {
  return localStorage.getItem('user_role_name');
};

export const clearUserRoleName = () => {
  localStorage.removeItem('user_role_name');
};

export interface RegisterTenantRequest {
  name: string;
  email: string;
  password?: string;
}

export const registerTenant = async (data: { name: string; email: string; password?: string }): Promise<any> => {
  const response = await apiClient.post('/users/reg', data);
  return response.data;
};

export interface TenantConfig {
  name: string;
  customLogoUrl?: string;
  brandColor?: string;
  isVip?: boolean;
}

export const getTenantConfig = async (tenantId: string): Promise<TenantConfig> => {
  const response = await apiClient.get(`/users/public-config/${tenantId}`);
  return response.data;
};

export const updateTenantConfig = async (tenantId: string, data: Partial<TenantConfig>): Promise<TenantConfig> => {
  const response = await apiClient.patch(`/users/${tenantId}`, data);
  return response.data;
};

// --- Super Admin APIs ---

export interface SuperAdminTenant {
  _id: string;
  id: string;
  name: string;
  email: string;
  maxParticipants: number;
  validUntil: string | null;
  notes: string;
  status: string;
  createdAt: string;
  isVip?: boolean;
}

export interface GetSuperAdminTenantsResponse {
  results: SuperAdminTenant[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export const getSuperAdminTenants = async (params?: { page?: number; limit?: number; sortBy?: string }): Promise<GetSuperAdminTenantsResponse> => {
  const response = await apiClient.get('/super-admin/tenants', { params });
  return response.data;
};

export const updateSuperAdminTenant = async (
  tenantId: string,
  data: { maxParticipants?: number; validUntil?: string | null; notes?: string; status?: string; isVip?: boolean }
): Promise<SuperAdminTenant> => {
  const response = await apiClient.patch(`/super-admin/tenants/${tenantId}`, data);
  return response.data;
};

export default apiClient;
