import { SERVER_HOST } from '@env';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Pressable, SectionList, Text, View } from 'react-native';
import { ContactItem } from '../../../components/ContactItem/ContactItem';
import PressableItem from '../../../components/PressableItem';
import { getUserID } from '../../../utils/storage';
import styles from './styles';

export const FriendTab = ({ navigation }) => {
   const [contacts, setContacts] = useState([]);
   useEffect(() => {
      getUserID().then((userID) => {
         getContacts(userID);
      });
   }, []);

   useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
         getUserID().then((userID) => {
            getContacts(userID);
         });
      });
      return unsubscribe;
   }, [navigation]);

   const getContacts = async (userID) => {
      const res = await axios.get(`${SERVER_HOST}/users/friends/${userID}`);
      const transformedData = res.data.reduce((acc, obj) => {
         const title = obj.name.charAt(0).toUpperCase();
         const existingTitle = acc.find((item) => item.title === title);
         if (existingTitle) existingTitle.data.push(obj);
         else acc.push({ title, data: [obj] });
         return acc;
      }, []);
      setContacts(transformedData);
   };

   return (
      <View style={styles.container}>
         <PressableItem
            navParams={{ screen: 'FriendRequest' }}
            navigation={navigation}
            title="Lời mời kết bạn"
            icon="account-multiple-outline"
            iconStyle={{ size: 28 }}
            action={null}
         />
         <PressableItem
            title="Danh bạ máy"
            subtitle="Liên hệ có cùng Zalo"
            icon="contacts"
            iconStyle={{ size: 26 }}
            action={null}
         />
         <SectionList
            sections={contacts}
            renderItem={({ item }) => <ContactItem navigation={navigation} data={item} />}
            renderSectionHeader={({ section }) => <Text style={styles.title}>{section.title}</Text>}
            keyExtractor={(item, index) => item + index}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            SectionSeparatorComponent={() => <View style={{ height: 10 }} />}
            stickySectionHeadersEnabled={false}
            style={{ paddingHorizontal: 12 }}
         />
      </View>
   );
};
