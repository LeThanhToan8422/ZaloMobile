import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SimpleLineIcons } from '@expo/vector-icons';
import MessageScreen from '../screens/MessageScreen';
import ContactScreen from '../screens/ContactScreen';
import DiscoveryScreen from '../screens/DiscoveryScreen';
import TimelineScreen from '../screens/TimelineScreen';
import PersonalScreen from '../screens/PersonalScreen';
import HeaderApp from '../components/HeaderApp';
import styles from '../screens/MessageScreen/styles';

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
               headerTitle: (props) => (
                  <HeaderApp
                     {...props}
                     left={LeftHeader}
                     right={[
                        <Ionicons
                           style={{ paddingHorizontal: 10 }}
                           key={1}
                           name="ios-qr-code-outline"
                           size={20}
                           color="white"
                        />,
                        <Ionicons
                           style={{ paddingHorizontal: 10 }}
                           key={2}
                           name="ios-add-outline"
                           size={32}
                           color="white"
                        />,
                     ]}
                  />
               ),
            }}
         />
         <Tab.Screen
            name="Danh bạ"
            component={ContactScreen}
            options={{
               headerTitle: (props) => (
                  <HeaderApp
                     {...props}
                     left={LeftHeader}
                     right={[
                        <Ionicons
                           style={{ paddingHorizontal: 10 }}
                           key={1}
                           name="ios-person-add-outline"
                           size={22}
                           color="white"
                        />,
                     ]}
                  />
               ),
            }}
         />
         <Tab.Screen
            name="Khám phá"
            component={DiscoveryScreen}
            options={{
               headerTitle: (props) => (
                  <HeaderApp
                     {...props}
                     left={LeftHeader}
                     right={[
                        <Ionicons
                           style={{ paddingHorizontal: 10 }}
                           key={1}
                           name="ios-qr-code-outline"
                           size={20}
                           color="white"
                        />,
                     ]}
                  />
               ),
            }}
         />
         <Tab.Screen
            name="Nhật ký"
            component={TimelineScreen}
            options={{
               headerTitle: (props) => (
                  <HeaderApp
                     {...props}
                     left={LeftHeader}
                     right={[
                        <SimpleLineIcons
                           key={1}
                           style={{ paddingHorizontal: 10 }}
                           name="note"
                           size={20}
                           color="white"
                        />,
                        <SimpleLineIcons
                           style={{ paddingHorizontal: 10 }}
                           key={2}
                           name="bell"
                           size={20}
                           color="white"
                        />,
                     ]}
                  />
               ),
            }}
         />
         <Tab.Screen
            name="Cá nhân"
            component={PersonalScreen}
            options={{
               headerTitle: (props) => (
                  <HeaderApp
                     {...props}
                     left={LeftHeader}
                     right={[
                        <Ionicons
                           style={{ paddingHorizontal: 10 }}
                           key={1}
                           name="ios-settings-outline"
                           size={22}
                           color="white"
                        />,
                     ]}
                  />
               ),
            }}
         />
      </Tab.Navigator>
   );
};

const LeftHeader = () => {
   return (
      <>
         <Ionicons name="ios-search-outline" size={22} color="white" />
         <Text style={[styles.text]}>Tìm kiếm</Text>
      </>
   );
};

export default AppTabs;
