import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ZegoCallInvitationDialog } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { fetchChats } from '../features/chat/chatSlice';
import { fetchFriend } from '../features/friend/friendSlice';
import { fetchFriendRequests } from '../features/friendRequest/friendRequestSlice';
import { fetchUser } from '../features/user/userSlice';
import { storeData } from '../utils/storage';
import { toastConfig } from '../utils/toastConfig';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

const Stack = createNativeStackNavigator();

const Router = (props) => {
   const [isLogin, setIsLogin] = useState(true);
   const navigationRef = useNavigationContainerRef();
   const dispatch = useDispatch();

   useEffect(() => {
      checkLogin();
   }, []);

   const checkLogin = async () => {
      const jsonValue = await AsyncStorage.getItem('@user');
      const params = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (!params) {
         setIsLogin(false);
         return;
      }
      dispatch(fetchUser({ phone: params.phone }))
         .unwrap()
         .then((response) => {
            if (!response) {
               navigationRef.navigate('AuthStack');
               storeData(null);
            } else {
               dispatch(fetchFriend(response.id));
               dispatch(fetchChats());
               dispatch(fetchFriendRequests());
            }
         })
         .catch((err) => {
            Toast.show({
               type: 'error',
               text1: `Đăng nhập thất bại. ${err.message}`,
               position: 'bottom',
            });
            navigationRef.navigate('AuthStack');
         });
   };
   return (
      <SafeAreaProvider>
         <NavigationContainer ref={navigationRef}>
            <ZegoCallInvitationDialog />
            <Stack.Navigator initialRouteName={isLogin ? 'AppStack' : 'AuthStack'}>
               <Stack.Screen name="AppStack" component={AppStack} options={{ headerShown: false }} />
               <Stack.Screen name="AuthStack" component={AuthStack} options={{ headerShown: false }} />
            </Stack.Navigator>
         </NavigationContainer>
         <Toast config={toastConfig} />
      </SafeAreaProvider>
   );
};

export default Router;
