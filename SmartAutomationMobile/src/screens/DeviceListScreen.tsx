import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {Device} from '../types';
import {DeviceItem} from '../components/DeviceItem';
import {getSocket} from '../services/socket';

export const DeviceListScreen = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const socket = getSocket();

  useEffect(() => {
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

    return () => {
      socket.off('deviceList');
      socket.off('deviceUpdated');
    };
  }, [socket]);

  const toggleDevice = (deviceId: string, newState: 'ON' | 'OFF') => {
    socket.emit('toggleDevice', JSON.stringify({deviceId, state: newState}));
  };

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
