import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useHeaderHeight } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HeaderApp from '../components/HeaderApp';
import { ChangePassScreen } from '../screens/ChangePassScreen/ChangePassScreen';
import ChatScreen from '../screens/ChatScreen';
import AppTabs from './AppTabs';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AppStack = ({ navigation }) => {
   const headerHeight = useHeaderHeight();
   return (
      <Stack.Navigator>
         <Stack.Screen name="AppTabs" component={AppTabs} options={{ headerShown: false }} />
         <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
            options={({ route }) => ({
               header: (props) => (
                  <HeaderApp
                     {...props}
                     navigation={navigation}
                     type="chat"
                     title={route.params.name}
                     member={route.params.member}
                     headerHeight={headerHeight}
                  />
               ),
            })}
         />
         <Stack.Screen
            name="ChangePassScreen"
            component={ChangePassScreen}
            options={{
               title: 'Đổi mật khẩu',
               headerBackground: () => (
                  <View
                     style={{
                        backgroundColor: '#4A8CFE',
                        flex: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#ddd',
                     }}
                  />
               ),
               headerTintColor: '#fff',
            }}
         />
      </Stack.Navigator>
   );
};

export default AppStack;
