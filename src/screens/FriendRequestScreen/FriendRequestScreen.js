import { SERVER_HOST } from '@env';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { FriendRequestItem } from '../../components/FriendRequestItem/FriendRequestItem';

export const FriendRequestScreen = ({ navigation }) => {
   const [userID, setUserID] = useState('');
   const [friendRequests, setFriendRequests] = useState([]);

   useEffect(() => {}, []);

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
            renderItem={({ item }) => <FriendRequestItem navigation={navigation} userID={userID} data={item} />}
         />
      </View>
   );
};
