import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import AuthenticationScreen from '../screens/AuthenticationScreen';
import LoginScreen from '../screens/LoginScreen';
import RecoveryPassScreen from '../screens/LoginScreen/RecoveryPassScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PasswordScreen from '../screens/RegisterScreen/PasswordScreen';
import PhoneNumberScreen from '../screens/RegisterScreen/PhoneNumberScreen';
import { VerifyPhoneScreen } from '../screens/VerifyPhoneScreen';
const Stack = createNativeStackNavigator();

const AuthStack = () => {
   return (
      <Stack.Navigator initialRouteName="Authentication">
         <Stack.Screen name="Authentication" component={AuthenticationScreen} options={{ headerShown: false }} />
         <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
               headerTitle: 'Đăng nhập',
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
         <Stack.Screen
            name="PhoneNumber"
            component={PhoneNumberScreen}
            options={{
               headerTitle: '',
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
         <Stack.Screen
            name="VerifyPhone"
            component={VerifyPhoneScreen}
            options={{
               headerTitle: 'Xác thực mã OTP',
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
               headerBackTitle: 'Lấy lại mật khẩu',
            }}
         />
         <Stack.Screen
            name="PasswordScreen"
            component={PasswordScreen}
            options={{
               headerTitle: '',
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
               headerBackTitle: '',
            }}
         />
         <Stack.Screen
            name="RecoveryPass"
            component={RecoveryPassScreen}
            options={{
               headerTitle: '',
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
               headerBackTitle: 'Lấy lại mật khẩu',
            }}
         />
      </Stack.Navigator>
   );
};

export default AuthStack;
