import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {Scene} from '../types';

interface SceneItemProps {
  scene: Scene;
  onExecute: (sceneId: string) => void;
  onDelete: (sceneId: string) => void;
}

export const SceneItem: React.FC<SceneItemProps> = ({
  scene,
  onExecute,
  onDelete,
}) => {
  const handleExecute = () => {
    onExecute(scene.id);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Scene',
      `Are you sure you want to delete the scene "${scene.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => onDelete(scene.id),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{scene.name}</Text>
        <Text style={styles.devices}>
          {scene.actions.length} device{scene.actions.length !== 1 ? 's' : ''}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.executeButton} onPress={handleExecute}>
          <Text style={styles.buttonText}>Execute</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  devices: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  executeButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
