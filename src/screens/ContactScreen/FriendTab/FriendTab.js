import { View, Text, SectionList } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './styles';
import { ContactItem } from '../../../components/ContactItem/ContactItem';
import axios from 'axios';

export const FriendTab = () => {
   // {
   //    title: 'A',
   //    data: [
   //       { name: 'Anh Tuan', image: 'https://picsum.photos/200' },
   //       { name: 'Anh Khang', image: 'https://picsum.photos/200' },
   //    ],
   // },
   // {
   //    title: 'A',
   //    data: [
   //       { name: 'Anh Tuan', image: 'https://picsum.photos/200' },
   //       { name: 'Anh Khang', image: 'https://picsum.photos/200' },
   //    ],
   // },
   const [contacts, setContacts] = useState([]);
   useEffect(() => {
      getContacts();
   }, []);
   const getContacts = async () => {
      const res = await axios.get('http://localhost:8080/relationship/get-friends-of-1/');
      const transformedData = res.data.reduce((acc, obj) => {
         const title = obj.name.charAt(0).toUpperCase();
         const existingTitle = acc.find((item) => item.title === title);
         obj.image = 'https://picsum.photos/200';
         if (existingTitle) existingTitle.data.push(obj);
         else acc.push({ title, data: [obj] });
         return acc;
      }, []);
      setContacts(transformedData);
   };
   return (
      <View style={styles.container}>
         <SectionList
            sections={contacts}
            renderItem={({ item }) => <ContactItem name={item.name} image={item.image} />}
            renderSectionHeader={({ section }) => <Text style={styles.title}>{section.title}</Text>}
            keyExtractor={(item, index) => item + index}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            SectionSeparatorComponent={() => <View style={{ height: 10 }} />}
            stickySectionHeadersEnabled={false}
         />
      </View>
   );
};
