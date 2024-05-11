import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ZegoCallInvitationDialog } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { fetchChats, fetchMessagesOfChats, setChat } from '../features/chat/chatSlice';
import { fetchFriend } from '../features/friend/friendSlice';
import { fetchFriendRequests } from '../features/friendRequest/friendRequestSlice';
import { fetchUser } from '../features/user/userSlice';
import { getData, storeData } from '../utils/storage';
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
      const params = await getData('@user');
      if (!params) {
         setIsLogin(false);
         return;
      }
      const chats = await getData('@chats');
      dispatch(setChat(chats));
      dispatch(fetchUser({ phone: params.phone }))
         .unwrap()
         .then((response) => {
            if (!response) {
               navigationRef.navigate('AuthStack');
               storeData('@user', null);
            } else {
               dispatch(fetchFriend(response.id));
               dispatch(fetchChats());
               dispatch(fetchFriendRequests());
               dispatch(fetchMessagesOfChats());
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
