import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'http://192.168.0.55:3000'; //FIXME:

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('userToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

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

export default api;
