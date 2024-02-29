import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import ChatItem from '../ChatItem';
import axios from 'axios';

/**
 * Represents a component that displays a list of chats.
 * @param {object} navigation - The navigation object used for navigating between screens.
 * @returns {JSX.Element} The rendered ListChat component.
 */
export const ListChat = ({ navigation }) => {
   const [data, setData] = useState([]);
   useEffect(() => {
      getApiChatsByUserId();
   }, []);

   // Func Call API to get data
   const getApiChatsByUserId = async (userID) => {
      const res = await axios.get(`http://localhost:8080/user/get-chats-by-id/1`);
      setData(res.data);
   };
   return (
      <View>
         <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ChatItem navigation={navigation} data={item} />}
         />
      </View>
   );
};
