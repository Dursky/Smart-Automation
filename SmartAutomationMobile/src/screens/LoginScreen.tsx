import React, {useState, useContext} from 'react';
import {View, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {AuthContext} from '../contexts/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '../types';

export const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {signIn} = useContext(AuthContext);

  const navigation = useNavigation<NavigationProp>();

  const handleLogin = async () => {
    try {
      await signIn(username, password);
    } catch (error) {
      Alert.alert('Login Error', (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Back to Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
