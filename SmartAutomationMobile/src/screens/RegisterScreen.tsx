import React, {useState, useContext} from 'react';
import {View, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../contexts/AuthContext';

export const RegisterScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {signUp} = useContext(AuthContext);
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!username || !email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      await signUp(username, password, email);
      Alert.alert('Success', 'Registration successful', [
        {text: 'OK', onPress: () => navigation.navigate('Login' as never)},
      ]);
    } catch (error) {
      Alert.alert('Registration Error', (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegister} />
      <Button
        title="Already have an account? Login"
        onPress={() => navigation.navigate('Login' as never)}
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
