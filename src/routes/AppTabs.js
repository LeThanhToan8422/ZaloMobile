import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import HeaderApp from '../components/HeaderApp';
import ContactScreen from '../screens/ContactScreen';
import MessageScreen from '../screens/MessageScreen';
import PersonalScreen from '../screens/PersonalScreen';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

const AppTabs = () => {
   const { friendRequests } = useSelector((state) => state.friendRequest);
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
               tabBarBadge: friendRequests.length > 0 ? friendRequests.length : null,
            }}
         />
         <Tab.Screen
            name="Cá nhân"
            component={PersonalScreen}
            options={{
               header: (props) => <HeaderApp {...props} type="personal" />,
            }}
         />
      </Tab.Navigator>
   );
};

export default AppTabs;
