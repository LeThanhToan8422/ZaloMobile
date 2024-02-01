import { View, Text } from 'react-native';
import React from 'react';
import styles from './styles';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FocusedTab from './FocusedTab';
import OtherTab from './OtherTab';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chat from '../ChatScreen';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

export const MessageScreen = () => {
   return (
      <Tab.Navigator
         screenOptions={{
            swipeEnabled: false,
            tabBarLabelStyle: {
               fontSize: 14,
               fontWeight: '600',
               textTransform: 'none',
               color: '#000',
            },
            tabBarItemStyle: {
               width: 'auto',
            },
         }}
      >
         <Tab.Screen name="Ưu tiên" component={FocusedTab} options={{ tabBarContentContainerStyle: { height: 40 } }} />
         <Tab.Screen name="Khác" component={OtherTab} options={{ tabBarContentContainerStyle: { height: 40 } }} />
      </Tab.Navigator>
   );
};
