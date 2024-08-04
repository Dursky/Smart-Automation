import React, {useState, useEffect} from 'react';
import {View, TextInput, Button, FlatList, StyleSheet} from 'react-native';
import {Device} from '../types';
import {getSocket} from '../services/socket';

export const CreateSceneScreen = () => {
  const [name, setName] = useState('');
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<{
    [key: string]: 'ON' | 'OFF';
  }>({});
  const socket = getSocket();

  useEffect(() => {
    socket.emit('getDevices');

    socket.on('deviceList', (deviceList: Device[]) => {
      setDevices(deviceList);
    });

    return () => {
      socket.off('deviceList');
    };
  }, [socket]);

  const toggleDeviceSelection = (deviceId: string) => {
    setSelectedDevices(prev => {
      const newSelection = {...prev};
      if (newSelection[deviceId]) {
        delete newSelection[deviceId];
      } else {
        newSelection[deviceId] = 'ON';
      }
      return newSelection;
    });
  };

  const createScene = () => {
    const actions = Object.entries(selectedDevices).map(
      ([deviceId, state]) => ({deviceId, state}),
    );
    socket.emit('createScene', JSON.stringify({name, actions}));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Scene Name"
        value={name}
        onChangeText={setName}
      />
      <FlatList
        data={devices}
        renderItem={({item}) => (
          <Button
            title={`${item.name} ${
              selectedDevices[item.id] ? '(Selected)' : ''
            }`}
            onPress={() => toggleDeviceSelection(item.id)}
          />
        )}
        keyExtractor={item => item.id}
      />
      <Button title="Create Scene" onPress={createScene} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
