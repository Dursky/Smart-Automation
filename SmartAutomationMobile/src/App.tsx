import React from 'react';
import {Provider} from 'react-redux';
import {store} from './redux/store';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider} from './contexts/AuthContext';
import {SocketProvider} from './contexts/SocketContext';
import {AppNavigation} from './navigation';

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <SocketProvider>
          <NavigationContainer>
            <AppNavigation />
          </NavigationContainer>
        </SocketProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;
