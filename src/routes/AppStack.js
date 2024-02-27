import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useHeaderHeight } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HeaderApp from '../components/HeaderApp';
import ChatScreen from '../screens/ChatScreen';
import AppTabs from './AppTabs';

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
      </Stack.Navigator>
   );
};

export default AppStack;
