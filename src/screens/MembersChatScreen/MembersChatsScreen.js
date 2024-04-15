import { SERVER_HOST } from '@env';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { IconButton, PaperProvider } from 'react-native-paper';
import MemberItem from '../../components/MemberItem';
import { getUserID } from '../../utils/storage';

export const MembersChatsScreen = ({ navigation, route }) => {
   const { data } = route.params;
   const [members, setMembers] = useState([]);
   const [userID, setUserID] = useState();
   const [group, setGroup] = useState(data);

   useEffect(() => {
      getUserID().then((id) => setUserID(id));
      getMembers();
   }, []);

   useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
         getMembers();
      });
      return unsubscribe;
   }, [navigation]);

   const getMembers = async () => {
      const res = await axios.get(`${SERVER_HOST}/users/get-members-in-group/${data.id}`);
      if (res.data) setMembers(res.data);
   };

   return (
      <PaperProvider>
         <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
               <Text>Thành viên {`(${members.length})`}</Text>
               <IconButton
                  icon="account-plus-outline"
                  color="#000"
                  size={24}
                  onPress={() => {
                     navigation.navigate('ManageGroupAndChatScreen', { data, type: 'addMember' });
                  }}
               />
            </View>
            <FlatList
               data={members}
               keyExtractor={(_, index) => index.toString()}
               renderItem={({ item }) => {
                  return <MemberItem userID={userID} data={data} item={item} onFreshMember={getMembers} />;
               }}
            />
         </View>
      </PaperProvider>
   );
};
