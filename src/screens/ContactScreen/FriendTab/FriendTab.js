import { View, Text, SectionList } from 'react-native';
import React from 'react';
import styles from './styles';
import { ContactItem } from '../../../components/ContactItem/ContactItem';

export const FriendTab = () => {
   const data = [
      {
         title: 'A',
         data: [
            { name: 'Anh Tuan', image: 'https://picsum.photos/200' },
            { name: 'Anh Khang', image: 'https://picsum.photos/200' },
         ],
      },
      {
         title: 'B',
         data: [
            { name: 'Binh', image: 'https://picsum.photos/200' },
            { name: 'Bao', image: 'https://picsum.photos/200' },
            { name: 'Bang', image: 'https://picsum.photos/200' },
         ],
      },
      {
         title: 'C',
         data: [
            { name: 'Cuong', image: 'https://picsum.photos/200' },
            { name: 'Chau', image: 'https://picsum.photos/200' },
         ],
      },
      {
         title: 'D',
         data: [
            { name: 'Dung', image: 'https://picsum.photos/200' },
            { name: 'Duc', image: 'https://picsum.photos/200' },
            { name: 'Dai', image: 'https://picsum.photos/200' },
         ],
      },
   ];
   return (
      <View style={styles.container}>
         <SectionList
            sections={data}
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
