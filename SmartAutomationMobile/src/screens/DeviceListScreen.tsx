import React, {useEffect, useState, useCallback} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {Device} from '../types';
import {DeviceItem} from '../components/DeviceItem';
import {socketManager} from '../services/socket';
import {Socket} from 'socket.io-client';

export const DeviceListScreen = () => {
  const [devices, setDevices] = useState<Device[]>([]);

  const setupSocketListeners = useCallback((socket: Socket) => {
    socket.emit('getDevices');

    socket.on('deviceList', (deviceList: Device[]) => {
      setDevices(deviceList);
    });

    socket.on('deviceUpdated', (updatedDevice: Device) => {
      setDevices(prevDevices =>
        prevDevices.map(device =>
          device.id === updatedDevice.id ? updatedDevice : device,
        ),
      );
    });
  }, []);

  useEffect(() => {
    let socket: Socket;

    const initializeSocket = async () => {
      try {
        socket = await socketManager.initSocket();
        setupSocketListeners(socket);
      } catch (error) {
        console.error('Error initializing socket:', error);
      }
    };

    initializeSocket();

    return () => {
      if (socket) {
        socket.off('deviceList');
        socket.off('deviceUpdated');
      }
    };
  }, [setupSocketListeners]);

  const toggleDevice = useCallback(
    (deviceId: string, newState: 'ON' | 'OFF') => {
      const socket = socketManager.getSocket();
      socket.emit('toggleDevice', JSON.stringify({deviceId, state: newState}));
    },
    [],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={devices}
        renderItem={({item}) => (
          <DeviceItem device={item} onToggle={toggleDevice} />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
