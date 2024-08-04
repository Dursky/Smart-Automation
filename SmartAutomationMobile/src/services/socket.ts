import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TypedSocket} from '../types';

const SOCKET_URL = 'http://your-socket-url.com';

let socket: TypedSocket;

export const initSocket = async () => {
  const token = await AsyncStorage.getItem('userToken');
  socket = io(SOCKET_URL, {
    query: {token},
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket');
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket is not initialized');
  }
  return socket;
};
