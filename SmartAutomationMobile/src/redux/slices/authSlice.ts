import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: state => {
      state.user = null;
      state.token = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {setUser, setToken, logout, setLoading} = authSlice.actions;
export default authSlice.reducer;
