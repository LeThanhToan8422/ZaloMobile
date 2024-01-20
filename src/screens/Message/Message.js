import { View, Text } from 'react-native';
import React from 'react';
import styles from './styles';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Focused from './Focused';
import Other from './Other';

const Tab = createMaterialTopTabNavigator();

export const Message = () => {
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
         <Tab.Screen name="Ưu tiên" component={Focused} options={{ tabBarContentContainerStyle: { height: 40 } }} />
         <Tab.Screen name="Khác" component={Other} options={{ tabBarContentContainerStyle: { height: 40 } }} />
      </Tab.Navigator>
   );
};
