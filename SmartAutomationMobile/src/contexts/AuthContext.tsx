import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootState, AppDispatch} from '../redux/store';
import {setUser, setToken, logout, setLoading} from '../redux/slices/authSlice';
import {login, register} from '../services/api';
import {socketManager} from '../services/socket';
import {User} from '../types';

interface AuthContextType {
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, email: string) => Promise<void>;
  signOut: () => Promise<void>;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  user: null,
  loading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {user, isLoading} = useSelector((state: RootState) => state.auth);

  const loadStoredData = useCallback(async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('user'),
      ]);

      if (storedToken && storedUser) {
        dispatch(setToken(storedToken));
        dispatch(setUser(JSON.parse(storedUser)));

        await socketManager.initSocket();
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    loadStoredData();
  }, [loadStoredData]);

  const handleAuthResponse = async (response: {user: any; token: string}) => {
    if (response.user && response.token) {
      dispatch(setUser(response.user));
      dispatch(setToken(response.token));

      await Promise.all([
        AsyncStorage.setItem('userToken', response.token),
        AsyncStorage.setItem('user', JSON.stringify(response.user)),
      ]);

      await socketManager.initSocket();
    } else {
      throw new Error('Invalid response from server');
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      const response = await login(username, password);

      await handleAuthResponse(response);
    } catch (error) {
      console.error('Sign in error:', error);

      throw error;
    }
  };

  const signUp = async (username: string, password: string, email: string) => {
    try {
      const response = await register(username, password, email);

      await handleAuthResponse(response);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('userToken'),
        AsyncStorage.removeItem('user'),
        AsyncStorage.removeItem('refreshToken'),
      ]);

      socketManager.closeSocket();

      dispatch(logout());
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{signIn, signUp, signOut, user, loading: isLoading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
