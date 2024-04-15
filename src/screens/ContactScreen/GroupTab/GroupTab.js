import { PORT, SERVER_HOST } from '@env';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import ListChat from '../../../components/ListChat';
import { getUserID } from '../../../utils/storage';
import styles from './styles';

export const GroupTab = ({ navigation }) => {
   const [data, setData] = useState([]);
   useEffect(() => {
      getUserID().then((userID) => {
         getApiChatsByUserId(userID);
      });
   }, []);

   useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
         getUserID().then((userID) => {
            getApiChatsByUserId(userID);
         });
      });
      return unsubscribe;
   }, [navigation]);

   // Func Call API to get data
   const getApiChatsByUserId = async (userID) => {
      const res = await axios.get(`${SERVER_HOST}/users/get-chats-by-id/${userID}`);
      setData(
         res.data.filter((item) => item.leader).sort((a, b) => new Date(b.dateTimeSend) - new Date(a.dateTimeSend))
      );
   };
   return (
      <View>
         <Button
            mode="text"
            icon={() => <AntDesign style={styles.iconAdd} name="addusergroup" size={24} color="#4885FE" />}
            contentStyle={styles.addBtnContent}
            labelStyle={styles.addBtnLabel}
            style={styles.addBtn}
            onPress={() => navigation.navigate('ManageGroupAndChatScreen', { type: 'addGroup' })}
         >
            Create New Group
         </Button>

         <ListChat style={{ height: '100%', backgroundColor: '#fff' }} chats={data} navigation={navigation} />
      </View>
   );
};
