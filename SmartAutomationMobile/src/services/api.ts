import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'http://192.168.0.55:3000'; //FIXME:

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('userToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAuthToken();

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

const refreshAuthToken = async () => {
  try {
    console.log('refresh');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }
    const response = await api.post('/api/auth/refresh', {refreshToken});

    const {token, user} = response.data;

    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));

    return token;
  } catch (error) {
    console.error('Token refresh error:', error);
    await AsyncStorage.multiRemove(['userToken', 'user', 'refreshToken']);
    throw error;
  }
};

export const login = async (username: string, password: string) => {
  const response = await api.post('/api/auth/login', {username, password});

  return response.data;
};

export const register = async (
  username: string,
  password: string,
  email: string,
) => {
  const response = await api.post('/api/auth/register', {
    username,
    password,
    email,
  });

  return response.data;
};

export const refreshToken = async (refreshToken: string) => {
  const response = await api.post('/api/auth/refresh', {refreshToken});

  return response.data;
};

export default api;
