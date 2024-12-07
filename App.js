import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chats from './src/chat/';  
import Chat from './src/telaChat/';   

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Chats">
        <Stack.Screen name="Chats" component={Chats} />
        <Stack.Screen name="ChatDetails" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
