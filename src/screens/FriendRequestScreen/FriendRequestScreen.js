import { View, Text, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserID } from '../../utils/storage';
import { SERVER_HOST } from '@env';
import { Button, Icon } from 'react-native-paper';
import styles from './styles';
import { socket } from '../../utils/socket';
import dayjs from 'dayjs';
import { Toast } from 'react-native-toast-message';

export const FriendRequestScreen = () => {
   const [userId, setUserId] = useState('');
   const [friendRequests, setFriendRequests] = useState([]);

   useEffect(() => {
      getUserID().then((userId) => {
         setUserId(userId);
         getFriendRequests(userId);
      });
   }, []);

   // useEffect(() => {
   //    const link = `Server-Chat-Room-${
   //       userId > friendAgree?.id ? `${friendAgree?.id}${userId}` : `${userId}${friendAgree?.id}`
   //    }`;
   //    socket.on(link, (dataGot) => {
   //       setRerender((pre) => !pre);
   //       Toast.show({
   //          type: 'success',
   //          text1: dataGot.message,
   //          position: 'bottom',
   //       });
   //    });

   //    return () => {
   //       socket.off(link);
   //    };
   // }, [friendAgree]);

   let handleAgreeMakeFriend = async (id, friendId, makeFriendId) => {
      const dataDelete = await axios.delete(`${SERVER_HOST}/make-friends/${makeFriendId}`);
      if (dataDelete.data) {
         const dataAddFriend = await axios.post(`${SERVER_HOST}/users/relationships`, {
            relationship: 'friends',
            id: id, // id user của mình
            objectId: friendId, // id của user muốn kết bạn
         });
         if (dataAddFriend.data) {
            socket.emit(`Client-Chat-Room`, {
               message: `Bạn và ${user.name} đã trở thành bạn`,
               dateTimeSend: dayjs().format('YYYY-MM-DD HH:mm:ss'),
               sender: id,
               receiver: friendId,
               chatRoom: id > friendId ? `${friendId}${id}` : `${id}${friendId}`,
            });
         }
      }
   };

   const getFriendRequests = async (userId) => {
      const response = await axios.get(`${SERVER_HOST}/make-friends/givers/${userId}`);
      if (response.data) {
         setFriendRequests(response.data);
      }
   };

   return (
      <View>
         <FlatList
            data={friendRequests}
            keyExtractor={(item) => item.makeFriendId}
            renderItem={({ item }) => (
               <View style={styles.itemContainer}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                     <Image source={{ uri: item.image }} style={styles.avatar} />
                     <View style={{ marginLeft: 8, rowGap: 4 }}>
                        <Text style={{ fontSize: 18, fontWeight: '500' }}>{item.name}</Text>
                        <Text style={{ fontSize: 16, color: '#333' }}>{item.content}</Text>
                     </View>
                  </View>
                  <View style={styles.actionContainer}>
                     <Button mode="contained-tonal" style={{ width: 150 }}>
                        Từ chối
                     </Button>
                     <Button mode="contained-tonal" style={{ width: 150 }}>
                        Chấp nhận
                     </Button>
                  </View>
               </View>
            )}
         />
      </View>
   );
};
