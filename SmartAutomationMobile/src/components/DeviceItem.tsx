import React from 'react';
import {View, Text, Switch, StyleSheet} from 'react-native';
import {Device} from '../types';

interface DeviceItemProps {
  device: Device;
  onToggle: (deviceId: string, newState: 'ON' | 'OFF') => void;
}

export const DeviceItem: React.FC<DeviceItemProps> = ({device, onToggle}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{device.name}</Text>
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
