import React from 'react';
import { SectionList, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { ContactItem } from '../../../components/ContactItem/ContactItem';
import PressableItem from '../../../components/PressableItem';
import styles from './styles';

export const FriendTab = ({ navigation }) => {
   const { friendRequests } = useSelector((state) => state.friendRequest);
   const contacts = useSelector((state) => state.friend.friend);

   const transformedData = () => {
      return contacts
         .filter((item) => !item.leader)
         .reduce((acc, obj) => {
            const title = obj.name.charAt(0).toUpperCase();
            const existingTitle = acc.find((item) => item.title === title);
            if (existingTitle) existingTitle.data.push(obj);
            else acc.push({ title, data: [obj] });
            return acc;
         }, []);
   };

   return (
      <View style={styles.container}>
         <PressableItem
            navParams={{ screen: 'FriendRequest' }}
            navigation={navigation}
            title={`Lời mời kết bạn (${friendRequests.length && friendRequests.length})`}
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
            sections={transformedData()}
            renderSectionHeader={({ section }) => <Text style={styles.title}>{section.title}</Text>}
            renderItem={({ item }) => <ContactItem navigation={navigation} data={item} />}
            keyExtractor={(item, index) => item + index}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            SectionSeparatorComponent={() => <View style={{ height: 10 }} />}
            stickySectionHeadersEnabled={false}
            style={{ paddingHorizontal: 12 }}
         />
      </View>
   );
};
