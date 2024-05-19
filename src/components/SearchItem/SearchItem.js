import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import styles from './styles';
import { IconButton } from 'react-native-paper';
import { socket } from '../../utils/socket';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Constants from 'expo-constants';
import { fetchChats, fetchMessagesOfChats } from '../../features/chat/chatSlice';
import { fetchFriendRequests } from '../../features/friendRequest/friendRequestSlice';
import dayjs from 'dayjs';

export const SearchItem = ({ navigation, data }) => {
   const { user } = useSelector((state) => state.user);
   const { friend } = useSelector((state) => state.friend);
   const { friendRequests } = useSelector((state) => state.friendRequest);
   const { id, image, name, leader } = data;
   const [isFriend, setIsFriend] = useState(false);
   const [isSendRequest, setIsSendRequest] = useState(false);
   const [isReceiveRequest, setIsReceiveRequest] = useState(false);
   const SERVER_HOST = Constants.expoConfig.extra.SERVER_HOST;
   const dispatch = useDispatch();

   useEffect(() => {
      if (friend.some((item) => item.id === id)) {
         setIsFriend(true);
         return;
      }
      (async () => {
         const sendMakeFriend = await axios.get(`${SERVER_HOST}/users/check-is-friend/${user.id}/${id}`);
         if (sendMakeFriend.data.isFriends.includes('Đã')) {
            setIsSendRequest(true);
         } else if (sendMakeFriend.data.isFriends.includes('Đợi')) {
            setIsReceiveRequest(true);
         }
      })();
   }, []);

   const handleAddFriend = async () => {
      socket.emit(`Client-Make-Friends`, {
         content: 'Mình kết bạn với nhau nhé!!!',
         giver: user.id, // id user của mình
         recipient: id, // id của user muốn kết bạn hoặc block
         chatRoom: user.id > id ? `${id}${user.id}` : `${user.id}${id}`,
      });
      setIsSendRequest(!isSendRequest);
   };

   const handleRemoveAddFriend = async () => {
      const makeFriendData = await axios.get(`${SERVER_HOST}/make-friends/givers/${id}`);
      if (makeFriendData.data) {
         const id = makeFriendData.data.find((item) => item.id === user.id).makeFriendId;
         if (id) {
            const dataDelete = await axios.delete(`${SERVER_HOST}/make-friends/${id}`);
            if (dataDelete.data) setIsSendRequest(false);
         }
      }
   };

   const handleAgreeMakeFriend = async () => {
      const dataDelete = await axios.delete(
         `${SERVER_HOST}/make-friends/${friendRequests.find((item) => item.id === id).makeFriendId}`
      );
      if (dataDelete.data) {
         const params = {
            relationship: 'friends',
            id: user.id, // id user của mình
            objectId: id, // id của user muốn kết bạn
         };
         let dataAddFriend = await axios.post(`${SERVER_HOST}/users/relationships`, params);
         if (dataAddFriend.data) {
            socket.emit(`Client-Chat-Room`, {
               message: `Bạn và ${name} đã trở thành bạn`,
               dateTimeSend: dayjs().format('YYYY-MM-DD HH:mm:ss'),
               sender: user.id,
               receiver: id,
               chatRoom: user.id > id ? `${id}${user.id}` : `${user.id}${id}`,
            });
            dispatch(fetchChats(user.id));
            dispatch(fetchMessagesOfChats(user.id));
            dispatch(fetchFriendRequests());
            dispatch(fetchFriend(user.id));
            setIsFriend(true);
         }
      }
   };

   return (
      <Pressable
         style={styles.container}
         onPress={() => {
            navigation.goBack();
            leader
               ? navigation.navigate('ChatScreen', data)
               : user.id === id
               ? navigation.navigate('ProfileScreen')
               : navigation.navigate('ProfileScreen', { friend: id });
         }}
      >
         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: image }} style={styles.avatar} />
            <Text style={styles.name}>{name}</Text>
         </View>
         {user.id !== id && (
            <View style={{ flexDirection: 'row' }}>
               {!isFriend && (
                  <IconButton
                     mode="contained-tonal"
                     icon={isSendRequest ? 'account-off-outline' : isReceiveRequest ? 'account-check' : 'account-plus'}
                     color="#000"
                     size={20}
                     onPress={() =>
                        isSendRequest
                           ? handleRemoveAddFriend()
                           : isReceiveRequest
                           ? handleAgreeMakeFriend()
                           : handleAddFriend()
                     }
                  />
               )}
               {isFriend && (
                  <IconButton
                     mode="contained-tonal"
                     icon="chat-plus-outline"
                     color="#000"
                     size={20}
                     onPress={() => navigation.navigate('ChatScreen', { id: id, name: name })}
                  />
               )}
            </View>
         )}
      </Pressable>
   );
};
