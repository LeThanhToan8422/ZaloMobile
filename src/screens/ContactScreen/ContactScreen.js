import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import Friend from './FriendTab';
import Group from './GroupTab';

const Tab = createMaterialTopTabNavigator();

export const ContactScreen = () => {
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
         }}
      >
         <Tab.Screen name="Bạn bè" component={Friend} options={{ tabBarContentContainerStyle: { height: 40 } }} />
         <Tab.Screen name="Nhóm" component={Group} options={{ tabBarContentContainerStyle: { height: 40 } }} />
      </Tab.Navigator>
   );
};
