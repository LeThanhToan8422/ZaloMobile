import { PORT, SERVER_HOST } from '@env';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import ListChat from '../../../components/ListChat';
import { getUserID } from '../../../utils/storage';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';

export const GroupTab = ({ navigation }) => {
   const dispatch = useDispatch();
   const { chats } = useSelector((state) => state.chat);

   const getGroupChats = () => {
      return chats.filter((chat) => chat.leader);
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

         <ListChat
            style={{ height: '100%', backgroundColor: '#fff' }}
            chats={getGroupChats()}
            navigation={navigation}
         />
      </View>
   );
};
