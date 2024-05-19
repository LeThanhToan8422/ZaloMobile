import axios from 'axios';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { Button, Icon } from 'react-native-paper';
import styles from './styles';
import Constants from 'expo-constants';
import { socket } from '../../utils/socket';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { fetchChats, fetchMessagesOfChats } from '../../features/chat/chatSlice';
import { fetchFriendRequests } from '../../features/friendRequest/friendRequestSlice';
import { fetchFriend } from '../../features/friend/friendSlice';

export const FriendRequestItem = ({ navigation, userID, data }) => {
   const [contentChat, setContentChat] = useState('');
   const SERVER_HOST = Constants.expoConfig.extra.SERVER_HOST;
   const dispatch = useDispatch();

   const handleAgreeMakeFriend = async (friendRequest) => {
      const dataDelete = await axios.delete(`${SERVER_HOST}/make-friends/${friendRequest.makeFriendId}`);
      if (dataDelete.data) {
         const params = {
            relationship: 'friends',
            id: userID, // id user của mình
            objectId: friendRequest.id, // id của user muốn kết bạn
         };
         let dataAddFriend = await axios.post(`${SERVER_HOST}/users/relationships`, params);
         if (dataAddFriend.data) {
            socket.emit(`Client-Chat-Room`, {
               message: `Bạn và ${friendRequest.name} đã trở thành bạn`,
               dateTimeSend: dayjs().format('YYYY-MM-DD HH:mm:ss'),
               sender: userID,
               receiver: friendRequest.id,
               chatRoom: userID > friendRequest.id ? `${friendRequest.id}${userID}` : `${userID}${friendRequest.id}`,
            });
            setContentChat(`Bạn và ${friendRequest.name} đã trở thành bạn`);
            dispatch(fetchChats(userID));
            dispatch(fetchMessagesOfChats(userID));
            dispatch(fetchFriendRequests());
            dispatch(fetchFriend(userID));
         }
      }
   };

   return (
      <View style={styles.container}>
         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: data.image }} style={styles.avatar} />
            <View style={{ marginLeft: 8, rowGap: 4 }}>
               <Text style={{ fontSize: 18, fontWeight: '500' }}>{data.name}</Text>
               <Text style={{ fontSize: 16, color: '#333' }}>{contentChat ? contentChat : data.content}</Text>
            </View>
         </View>
         <View style={styles.actionContainer}>
            {contentChat ? (
               <>
                  <Button
                     icon={() => <Icon source={'chat-outline'} size={22} />}
                     mode="contained-tonal"
                     style={{ width: 150 }}
                     onPress={() => navigation.navigate('ChatScreen', { id: data.id, name: data.name })}
                  >
                     Nhắn tin
                  </Button>
               </>
            ) : (
               <>
                  <Button mode="contained-tonal" style={{ width: 150 }}>
                     Từ chối
                  </Button>
                  <Button mode="contained-tonal" style={{ width: 150 }} onPress={() => handleAgreeMakeFriend(data)}>
                     Chấp nhận
                  </Button>
               </>
            )}
         </View>
      </View>
   );
};
