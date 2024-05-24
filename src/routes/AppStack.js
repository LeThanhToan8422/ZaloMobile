import { useHeaderHeight } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
   ZegoUIKitPrebuiltCallInCallScreen,
   ZegoUIKitPrebuiltCallWaitingScreen,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import axios from 'axios';
import Constants from 'expo-constants';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Camera } from '../components/Camera/Camera';
import HeaderApp from '../components/HeaderApp';
import {
   addMessage,
   deleteMessage,
   fetchChats,
   fetchMessages,
   fetchMessagesOfChats,
   recallMessage,
   updateMessage,
} from '../features/chat/chatSlice';
import { fetchDetailChat, fetchMembersInGroup } from '../features/detailChat/detailChatSlice';
import { fetchFriend } from '../features/friend/friendSlice';
import { fetchFriendRequests } from '../features/friendRequest/friendRequestSlice';
import { updateUser } from '../features/user/userSlice';
import { ChangePassScreen } from '../screens/ChangePassScreen/ChangePassScreen';
import ChatScreen from '../screens/ChatScreen';
import ManageGroupAndChat from '../screens/CreateGroupScreen';
import { DetailChatScreen } from '../screens/DetailChatScreen/DetailChatScreen';
import { FriendRequestScreen } from '../screens/FriendRequestScreen/FriendRequestScreen';
import InfoAppScreen from '../screens/InfoAppScreen';
import MembersChatsScreen from '../screens/MembersChatScreen';
import { ProfileScreen } from '../screens/ProfileScreen/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import { onDisplayNotification } from '../utils/notification';
import { socket } from '../utils/socket';
import { getData, storeData } from '../utils/storage';
import { onUserLogin } from '../utils/zego';
import AppTabs from './AppTabs';

const Stack = createNativeStackNavigator();

const AppStack = ({ navigation }) => {
   const headerHeight = useHeaderHeight();
   const dispatch = useDispatch();
   const { user } = useSelector((state) => state.user);
   const { chats, currentChat } = useSelector((state) => state.chat);
   const { friend } = useSelector((state) => state.friend);
   const SERVER_HOST = Constants.expoConfig.extra.SERVER_HOST;

   useEffect(() => {
      user && onUserLogin(user.id, user.name);
   }, [user]);

   useEffect(() => {
      const onChatEvents = async (res) => {
         if (res.data.idTemp) {
            dispatch(deleteMessage(res.data.idTemp));
         }
         dispatch(addMessage({ ...res.data, chatRoom: String(res.data.chatRoom) }));
         if (
            res.data.sender !== user.id &&
            res.data.sender !== currentChat.id &&
            res.data.chatRoom !== currentChat.id
         ) {
            let message = res.data.message;
            const checkVideo = /(mp4|avi|mkv|mov|wmv|flv|webm)$/i.test(message.split('.').pop());
            const checkVoice = /(m4a|wav|aac|flac|ogg)$/i.test(message.split('.').pop());
            message = checkVideo ? 'Video' : checkVoice ? 'Tin nhắn thoại' : message;
            onDisplayNotification(
               res.data.nameGroup ? res.data.nameGroup : res.data.name,
               res.data.nameGroup ? `${res.data.name}: ${message}` : message,
               res.data.imageGroup ? res.data.imageGroup : res.data.imageUser
            );
         }
         if (res.data.sender === currentChat.id || res.data.chatRoom === currentChat.id) {
            if (res.data.groupChat) {
               await axios.post(`${SERVER_HOST}/wait-message/update/${user.id}/Group/${res.data.groupChat}`);
            } else {
               await axios.post(`${SERVER_HOST}/wait-message/update/${currentChat.id}/${user.id}`);
            }
         }
         dispatch(fetchChats());
         const messages = await getData(
            `@${
               res.data.groupChat
                  ? res.data.groupChat
                  : user.id === res.data.sender
                  ? res.data.receiver
                  : res.data.sender
            }`
         );
         messages.unshift(res.data);
         messages.length > 20 && messages.pop();
         storeData(
            `@${
               res.data.groupChat
                  ? res.data.groupChat
                  : user.id === res.data.sender
                  ? res.data.receiver
                  : res.data.sender
            }`,
            messages
         );
      };
      const onStatusChatEvents = (res) => {
         if (res.data.chatFinal && res.data.id) {
            const { chatFinal, id } = res.data;
            dispatch(recallMessage(id));
            dispatch(fetchChats());
            storeData(`@${currentChat.id}`, currentChat.messages);
            if (chatFinal.sender !== user.id) {
               onDisplayNotification(
                  chatFinal.nameGroup ? chatFinal.nameGroup : chatFinal.name,
                  `${chatFinal.name} đã thu hồi 1 tin nhắn`,
                  chatFinal.imageGroup ? chatFinal.imageGroup : chatFinal.image
               );
            }
         }
      };

      socket.onAny((event, res) => {
         console.log(event, res);
         friend
            .map((chat) => ({
               id: chat.leader ? chat.id : user.id < chat.id ? `${user.id}${chat.id}` : `${chat.id}${user.id}`,
               group: chat.leader ? true : false,
            }))
            .forEach(({ id, group }) => {
               if (event === `Server-Chat-Room-${id}` && event.split('-').pop().length > 1) {
                  onChatEvents(res);
               }
               if (event === `Server-Status-Chat-${id}`) {
                  onStatusChatEvents(res);
               }
               if (group && event === `Server-Change-Leader-And-Deputy-Group-Chats-${id}`) {
                  dispatch(fetchDetailChat({ id, type: 'group' }));
                  dispatch(fetchMembersInGroup(id));
               }
            });
         if (
            event ===
            `Server-Emotion-Chats-${
               currentChat.id < user.id ? `${currentChat.id}${user.id}` : `${user.id}${currentChat.id}`
            }`
         ) {
            if (user.id !== res.data.implementer) {
               dispatch(updateMessage({ id: res.data.chat, emojis: res.data.type }));
            }
            storeData(`@${currentChat.id}`, currentChat.messages);
         }
         if (event === `Server-Reload-Page-${user.id}`) {
            dispatch(updateUser({ ...user, image: res.data.image, background: res.data.background }));
         }
         if (event === `Server-Group-Chats-${user.id}`) {
            dispatch(fetchFriend());
            dispatch(fetchDetailChat({ id: res.data.id, type: 'group' }));
            dispatch(fetchMembersInGroup(res.data.id));
            dispatch(fetchChats());
            dispatch(fetchMessagesOfChats());
            if (currentChat.id === res.data.id) {
               dispatch(fetchMessages({ groupId: res.data.id, page: currentChat.messages.length + 1 }));
               if (!JSON.parse(res.data.members).some((member) => member === user.id)) {
                  navigation.navigate('AppTabs');
               }
            }
         }
         if (
            event.includes('Server-Make-Friends-') &&
            (event.slice(-1) === `${user.id}` || event.slice(-2, -1) === `${user.id}`)
         ) {
            (async () => {
               const dataUser = await axios.get(`${SERVER_HOST}/users/${res.data.giver}`);
               if (dataUser) {
                  onDisplayNotification(
                     dataUser.data.name,
                     `${dataUser.data.name} đã gửi lời mời kết bạn cho bạn`,
                     dataUser.data.image
                  );
               }
            })();
            dispatch(fetchFriendRequests());
         }
      });
      return () => {
         socket.offAny();
      };
   }, [chats, currentChat.id]);

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
               headerTitle: 'Lời mời kết bạn',
               headerTitleStyle: { fontWeight: '400' },
            }}
         />
         <Stack.Group
            screenOptions={{
               presentation: 'containedModal',
               headerShown: false,
            }}
         >
            <Stack.Screen name="Camera" component={Camera} />
         </Stack.Group>
         <Stack.Screen
            options={{ headerShown: false }}
            name="ZegoUIKitPrebuiltCallWaitingScreen"
            component={ZegoUIKitPrebuiltCallWaitingScreen}
         />
         <Stack.Screen
            options={{ headerShown: false }}
            name="ZegoUIKitPrebuiltCallInCallScreen"
            component={ZegoUIKitPrebuiltCallInCallScreen}
         />
         <Stack.Screen name="InfoApp" component={InfoAppScreen} />
      </Stack.Navigator>
   );
};

export default AppStack;
