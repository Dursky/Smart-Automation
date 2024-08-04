import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp, Scene} from '../types';
import {SceneItem} from '../components/SceneItem';
import {getSocket} from '../services/socket';

export const SceneListScreen = () => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const socket = getSocket();
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    socket.emit('getScenes');

    socket.on('sceneList', (sceneList: Scene[]) => {
      setScenes(sceneList);
    });

    return () => {
      socket.off('sceneList');
    };
  }, [socket]);

  const executeScene = (sceneId: string) => {
    socket.emit('executeScene', sceneId);
  };

  const deleteScene = (sceneId: string) => {
    socket.emit('deleteScene', sceneId);
  };

  return (
    <View style={styles.container}>
      <Button
        title="Create New Scene"
        onPress={() => navigation.navigate?.('CreateScene')}
      />
      <FlatList
        data={scenes}
        renderItem={({item}) => (
          <SceneItem
            scene={item}
            onExecute={executeScene}
            onDelete={deleteScene}
          />
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
