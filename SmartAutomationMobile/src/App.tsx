import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthProvider, AuthContext} from './contexts/AuthContext';
import {LoginScreen} from './screens/LoginScreen';
import {RegisterScreen} from './screens/RegisterScreen';
import {DeviceListScreen} from './screens/DeviceListScreen';
import {SceneListScreen} from './screens/SceneListScreen';
import {CreateSceneScreen} from './screens/CreateSceneScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthContext.Consumer>
          {({user, loading}) => {
            if (loading) {
              return null; // Or a loading screen
            }
            return (
              <Stack.Navigator>
                {user ? (
                  <>
                    <Stack.Screen name="Devices" component={DeviceListScreen} />
                    <Stack.Screen name="Scenes" component={SceneListScreen} />
                    <Stack.Screen
                      name="CreateScene"
                      component={CreateSceneScreen}
                    />
                  </>
                ) : (
                  <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                  </>
                )}
              </Stack.Navigator>
            );
          }}
        </AuthContext.Consumer>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
