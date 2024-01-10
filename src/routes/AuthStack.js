import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Authentication from '../screens/Authentication';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
   return (
      <Stack.Navigator>
         <Stack.Screen name="Authentication" component={Authentication} />
      </Stack.Navigator>
   );
};

export default AuthStack;
