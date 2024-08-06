import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Device} from '../../types';

interface DeviceState {
  devices: Device[];
  isLoading: boolean;
}

const initialState: DeviceState = {
  devices: [],
  isLoading: false,
};

const deviceSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    setDevices: (state, action: PayloadAction<Device[]>) => {
      state.devices = action.payload;
      state.isLoading = false;
    },
    updateDevice: (state, action: PayloadAction<Device>) => {
      const index = state.devices.findIndex(
        device => device.id === action.payload.id,
      );
      if (index !== -1) {
        state.devices[index] = action.payload;
      }
    },
    setDeviceLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {setDevices, updateDevice, setDeviceLoading} = deviceSlice.actions;
export default deviceSlice.reducer;
