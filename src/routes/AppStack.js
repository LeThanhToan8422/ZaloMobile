import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SimpleLineIcons } from '@expo/vector-icons';
import Message from '../screens/Message';
import Contacts from '../screens/Contacts';
import Discovery from '../screens/Discovery';
import Timeline from '../screens/Timeline';
import Personal from '../screens/Personal';
import HeaderApp from '../components/HeaderApp';
import { useNavigation } from '@react-navigation/native';

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
            component={Message}
            options={{
               headerTitle: (props) => (
                  <HeaderApp
                     {...props}
                     children={[
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
            component={Contacts}
            options={{
               headerTitle: (props) => (
                  <HeaderApp
                     {...props}
                     children={[
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
            component={Discovery}
            options={{
               headerTitle: (props) => (
                  <HeaderApp
                     {...props}
                     children={[
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
            component={Timeline}
            options={{
               headerTitle: (props) => (
                  <HeaderApp
                     {...props}
                     children={[
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
            component={Personal}
            options={{
               headerTitle: (props) => (
                  <HeaderApp
                     {...props}
                     children={[
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

export default AppStack;
