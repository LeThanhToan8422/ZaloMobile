import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthenticationScreen from '../screens/AuthenticationScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
   return (
      <Stack.Navigator initialRouteName="Authentication">
         <Stack.Screen name="Authentication" component={AuthenticationScreen} options={{ headerShown: false }} />
         <Stack.Screen name="Login" component={LoginScreen} />
         <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
               headerTitle: 'Tạo tài khoản',
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

export default AuthStack;
