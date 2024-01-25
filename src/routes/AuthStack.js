import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Authentication from '../screens/Authentication';
import Login from '../screens/Login';
import Register from '../screens/Register';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
   return (
      <Stack.Navigator initialRouteName="Authentication">
         <Stack.Screen name="Authentication" component={Authentication} options={{ headerShown: false }} />
         <Stack.Screen name="Login" component={Login} />
         <Stack.Screen
            name="Register"
            component={Register}
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
