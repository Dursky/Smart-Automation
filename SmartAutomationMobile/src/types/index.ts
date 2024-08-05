import {StackNavigationProp} from '@react-navigation/stack';
import {Socket} from 'socket.io-client';

export interface Device {
  id: string;
  name: string;
  state: 'ON' | 'OFF';
}

export interface Scene {
  id: string;
  name: string;
  actions: {deviceId: string; state: 'ON' | 'OFF'}[];
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Devices: undefined;
  Scenes: undefined;
  CreateScene: undefined;
};

export type NavigationProp = StackNavigationProp<RootStackParamList>;

export interface ServerToClientEvents {
  deviceList: (devices: Device[]) => void;
  deviceUpdated: (device: Device) => void;
  deviceLost: (deviceId: string) => void;
  sceneList: (scenes: Scene[]) => void;
  sceneCreated: (result: {
    success: boolean;
    sceneId?: string;
    error?: string;
  }) => void;
  sceneExecuted: (result: {
    success: boolean;
    sceneId: string;
    error?: string;
  }) => void;
  toggleResult: (result: {
    success: boolean;
    deviceId: string;
    state: 'ON' | 'OFF';
    error?: string;
  }) => void;
}

export interface ClientToServerEvents {
  getDevices: () => void;
  toggleDevice: (data: string) => void;
  getScenes: () => void;
  createScene: (data: string) => void;
  executeScene: (sceneId: string) => void;
  deleteScene: (sceneId: string) => void;
}

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
