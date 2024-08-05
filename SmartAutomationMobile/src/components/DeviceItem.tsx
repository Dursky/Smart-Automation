import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Device} from '../types';
import Switch from './Switch';

interface DeviceItemProps {
  device: Device;
  onToggle: (deviceId: string, newState: 'ON' | 'OFF') => void;
}

export const DeviceItem: React.FC<DeviceItemProps> = ({device, onToggle}) => {
  console.log(device);
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{device.id}</Text>
      <Switch
        value={device.state === 'ON'}
        onValueChange={value => onToggle(device.id, value ? 'ON' : 'OFF')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  name: {
    fontSize: 16,
  },
});
