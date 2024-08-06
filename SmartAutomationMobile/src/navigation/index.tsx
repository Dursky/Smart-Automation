// navigation.tsx

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useAuth} from '../contexts/AuthContext';
import {HomeScreen} from '../screens/HomeScreen';
import {LoginScreen} from '../screens/LoginScreen';
import {RegisterScreen} from '../screens/RegisterScreen';
import {DeviceListScreen} from '../screens/DeviceListScreen';
import {SceneListScreen} from '../screens/SceneListScreen';
import {CreateSceneScreen} from '../screens/CreateSceneScreen';
import {RootStackParamList} from '../types';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigation = () => {
  const {user, loading} = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Devices" component={DeviceListScreen} />
          <Stack.Screen name="Scenes" component={SceneListScreen} />
          <Stack.Screen name="CreateScene" component={CreateSceneScreen} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
