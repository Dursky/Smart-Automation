import io, {Socket} from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from './api';

class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;

  private constructor() {}

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public async initSocket(): Promise<Socket> {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    const token = await AsyncStorage.getItem('userToken');

    if (!token) {
      throw new Error('No token found');
    }

    this.socket = io(API_URL, {
      auth: {token},
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });

    return this.socket;
  }

  public async getSocket(): Promise<Socket> {
    if (!this.socket) {
      try {
        this.socket = await this.initSocket();

        console.log('-> New Socket created');
      } catch (error) {
        console.error('-> Failed to create new socket:', error);
        throw error;
      }
    }

    return this.socket;
  }
  public closeSocket() {
    if (this.socket) {
      this.socket.disconnect();

      this.socket = null;
    }
  }
}

export const socketManager = SocketManager.getInstance();
