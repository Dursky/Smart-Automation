import React, {useEffect} from 'react';
import {View, FlatList, StyleSheet, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {DeviceItem} from '../components/DeviceItem';
import {useSocket} from '../contexts/SocketContext';

export const DeviceListScreen: React.FC = () => {
  const devices = useSelector((state: RootState) => state.devices.devices);
  const {isConnected, getDevices, toggleDevice} = useSocket();

  useEffect(() => {
    if (isConnected) {
      getDevices();
    }
  }, [isConnected, getDevices]);

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Text>Connecting...</Text>
      </View>
    );
  }

  console.log({devices});

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
    justifyContent: 'center',
    alignItems: 'center',
  },
});
