import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Message } from '../screens/Message';
import { Contacts } from '../screens/Contacts';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

const Stack = createNativeStackNavigator();

const Router = () => {
   const [isLogin, setIsLogin] = useState(true);
   return (
      <NavigationContainer>
         <Stack.Navigator>
            {isLogin ? (
               <Stack.Screen name="AppStack" component={AppStack} options={{ headerShown: false }} />
            ) : (
               <Stack.Screen name="AuthStack" component={AuthStack} options={{ headerShown: false }} />
            )}
         </Stack.Navigator>
      </NavigationContainer>
   );
};

export default Router;
