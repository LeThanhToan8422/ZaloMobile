import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ChatScreen from '../screens/ChatScreen';
import AppTabs from './AppTabs';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AppStack = () => {
   return (
      <Stack.Navigator>
         <Stack.Screen name="AppTabs" component={AppTabs} options={{ headerShown: false }} />
         <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
   );
};

export default AppStack;
