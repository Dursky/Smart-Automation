import React, {createContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../types';
import {login, register} from '../services/api';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  async function loadStoredData() {
    const storedUser = await AsyncStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }

  async function signIn(username: string, password: string) {
    try {
      const response = await login(username, password);
      setUser(response.user);
      await AsyncStorage.setItem('userToken', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async function signUp(username: string, password: string, email: string) {
    try {
      const response = await register(username, password, email);
      setUser(response.user);
      await AsyncStorage.setItem('userToken', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async function signOut() {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  return (
    <AuthContext.Provider value={{user, loading, signIn, signUp, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};
