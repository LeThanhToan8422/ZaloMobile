import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import HeaderApp from '../components/HeaderApp';
import ContactScreen from '../screens/ContactScreen';
import DiscoveryScreen from '../screens/DiscoveryScreen';
import MessageScreen from '../screens/MessageScreen';
import PersonalScreen from '../screens/PersonalScreen';
import TimelineScreen from '../screens/TimelineScreen';

const Tab = createBottomTabNavigator();

const AppTabs = () => {
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
                  iconName = focused ? 'ios-time' : 'ios-time-outline';
               } else if (route.name === 'Cá nhân') {
                  iconName = focused ? 'ios-person' : 'ios-person-outline';
               }
               return <Ionicons name={iconName} size={size} color={color} />;
            },
            headerTitleAlign: 'left',
            headerStyle: {
               backgroundColor: '#4D9DF7',
            },
         })}
      >
         <Tab.Screen
            name="Tin nhắn"
            component={MessageScreen}
            options={{
               header: (props) => <HeaderApp {...props} type="message" />,
            }}
         />
         <Tab.Screen
            name="Danh bạ"
            component={ContactScreen}
            options={{
               header: (props) => <HeaderApp {...props} type="contact" />,
            }}
         />
         <Tab.Screen
            name="Khám phá"
            component={DiscoveryScreen}
            options={{
               header: (props) => <HeaderApp {...props} type="discovery" />,
            }}
         />
         <Tab.Screen
            name="Nhật ký"
            component={TimelineScreen}
            options={{
               header: (props) => <HeaderApp {...props} type="timeline" />,
            }}
         />
         <Tab.Screen
            name="Cá nhân"
            component={PersonalScreen}
            options={{
               header: (props) => <HeaderApp {...props} />,
            }}
         />
      </Tab.Navigator>
   );
};

export default AppTabs;
