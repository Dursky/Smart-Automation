import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {Socket} from 'socket.io-client';
import {useDispatch} from 'react-redux';
import {socketManager} from '../services/socket';
import {setDevices, updateDevice} from '../redux/slices/deviceSlice';
import {AppDispatch} from '../redux/store';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  getDevices: () => void;
  toggleDevice: (deviceId: string, newState: 'ON' | 'OFF') => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const initSocket = async () => {
      try {
        const socketInstance = await socketManager.getSocket();
        setSocket(socketInstance);
        setIsConnected(true);

        socketInstance.on('connect', () => setIsConnected(true));
        socketInstance.on('disconnect', () => setIsConnected(false));

        socketInstance.on('deviceList', deviceList => {
          dispatch(setDevices(deviceList));
        });

        socketInstance.on('deviceUpdated', updatedDevice => {
          dispatch(updateDevice(updatedDevice));
        });
      } catch (error) {
        console.error('Failed to initialize socket:', error);
      }
    };

    initSocket();

    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('deviceList');
        socket.off('deviceUpdated');
      }
    };
  }, [dispatch, socket]);

  const getDevices = () => {
    if (socket) {
      socket.emit('getDevices');
    }
  };

  const toggleDevice = (deviceId: string, newState: 'ON' | 'OFF') => {
    if (socket) {
      socket.emit('toggleDevice', JSON.stringify({deviceId, state: newState}));
    }
  };

  return (
    <SocketContext.Provider
      value={{socket, isConnected, getDevices, toggleDevice}}>
      {children}
    </SocketContext.Provider>
  );
};
