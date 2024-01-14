import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Authentication from '../screens/Authentication';
import Login from '../screens/Login';
import Register from '../screens/Register';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
   return (
      <Stack.Navigator initialRouteName="Authentication">
         <Stack.Screen name="Authentication" component={Authentication} options={{ headerShown: false }} />
         <Stack.Screen name="Login" component={Login} />
         <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
   );
};

export default AuthStack;
