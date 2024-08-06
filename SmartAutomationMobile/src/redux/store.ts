import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import deviceReducer from './slices/deviceSlice';
import sceneReducer from './slices/sceneSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    devices: deviceReducer,
    scenes: sceneReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
