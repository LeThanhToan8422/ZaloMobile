import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useHeaderHeight } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import HeaderApp from '../components/HeaderApp';
import { ChangePassScreen } from '../screens/ChangePassScreen/ChangePassScreen';
import ChatScreen from '../screens/ChatScreen';
import ManageGroupAndChat from '../screens/CreateGroupScreen';
import { DetailChatScreen } from '../screens/DetailChatScreen/DetailChatScreen';
import { FriendRequestScreen } from '../screens/FriendRequestScreen/FriendRequestScreen';
import MembersChatsScreen from '../screens/MembersChatScreen';
import { ProfileScreen } from '../screens/ProfileScreen/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import AppTabs from './AppTabs';
import { socket } from '../utils/socket';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, fetchChats, recallMessage, updateMessage } from '../features/chat/chatSlice';
import { updateUser } from '../features/user/userSlice';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AppStack = ({ navigation }) => {
   const headerHeight = useHeaderHeight();
   const dispatch = useDispatch();
   const { user } = useSelector((state) => state.user);
   const { chats } = useSelector((state) => state.chat);

   useEffect(() => {
      const onChatEvents = (res) => {
         dispatch(addMessage({ ...res.data, chatRoom: String(res.data.chatRoom), file: {} }));
         dispatch(fetchChats());
      };
      const onStatusChatEvents = (res) => {
         if (!res.data.chatFinal && res.data.id) dispatch(recallMessage(res.data));
      };

      const listIDChat = chats.map((chat) =>
         chat.leader ? chat.id : user.id < chat.id ? `${user.id}${chat.id}` : `${chat.id}${user.id}`
      );

      socket.onAny((event, res) => {
         listIDChat.forEach((id) => {
            if (event === `Server-Chat-Room-${id}`) {
               onChatEvents(res);
            }
            if (event === `Server-Status-Chat-${id}`) {
               onStatusChatEvents(res);
            }
         });
         if (event === `Server-Reload-Page-${user.id}`) {
            dispatch(updateUser({ ...user, image: res.data.image, background: res.data.background }));
         }
      });
      return () => {
         socket.offAny();
      };
   }, [chats]);

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
                     id={route.params.id}
                     navigation={navigation}
                     type="chat"
                     title={route.params.name}
                     member={route.params.members}
                     headerHeight={headerHeight}
                  />
               ),
            })}
         />
         <Stack.Screen
            name="DetailChatScreen"
            component={DetailChatScreen}
            options={{
               title: 'Tùy chọn',
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
            name="MembersChatScreen"
            component={MembersChatsScreen}
            options={{
               title: 'Thành viên',
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
         <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{
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
         <Stack.Group
            screenOptions={{
               presentation: 'formSheet',
            }}
         >
            <Stack.Screen name="SearchScreen" component={SearchScreen} />
         </Stack.Group>
         <Stack.Group
            screenOptions={{
               presentation: 'containedModal',
            }}
         >
            <Stack.Screen name="ManageGroupAndChatScreen" component={ManageGroupAndChat} />
         </Stack.Group>
         <Stack.Screen
            name="FriendRequest"
            component={FriendRequestScreen}
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
               headerBackTitle: 'Lời mời kết bạn',
            }}
         />
      </Stack.Navigator>
   );
};

export default AppStack;
