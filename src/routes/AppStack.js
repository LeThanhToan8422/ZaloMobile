import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Message from '../screens/Message';
import Contacts from '../screens/Contacts';
import Discovery from '../screens/Discovery';
import Timeline from '../screens/Timeline';
import Personal from '../screens/Personal';

const Tab = createBottomTabNavigator();

const AppStack = () => {
   return (
      <Tab.Navigator
         initialRouteName="Message"
         screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
               let iconName;
               if (route.name === 'Tin nhắn') {
                  iconName = focused ? 'ios-chatbubbles' : 'ios-chatbubbles-outline';
               } else if (route.name === 'Danh bạ') {
                  iconName = focused ? 'ios-people' : 'ios-people-outline';
               } else if (route.name === 'Khám phá') {
                  iconName = focused ? 'ios-compass' : 'ios-compass-outline';
               } else if (route.name === 'Nhật ký') {
                  iconName = focused ? 'ios-paper' : 'ios-paper-outline';
               } else if (route.name === 'Cá nhân') {
                  iconName = focused ? 'ios-person' : 'ios-person-outline';
               }
               return <Ionicons name={iconName} size={size} color={color} />;
            },
         })}
      >
         <Tab.Screen name="Tin nhắn" component={Message} options={{ headerShown: false }} />
         <Tab.Screen name="Danh bạ" component={Contacts} options={{ headerShown: false }} />
         <Tab.Screen name="Khám phá" component={Discovery} options={{ headerShown: false }} />
         <Tab.Screen name="Nhật ký" component={Timeline} options={{ headerShown: false }} />
         <Tab.Screen name="Cá nhân" component={Personal} options={{ headerShown: false }} />
      </Tab.Navigator>
   );
};

export default AppStack;
