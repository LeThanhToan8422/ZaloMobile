import { SERVER_HOST } from '@env';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { IconButton, PaperProvider } from 'react-native-paper';
import MemberItem from '../../components/MemberItem';
import { useSelector } from 'react-redux';

export const MembersChatsScreen = ({ navigation, route }) => {
   const { data } = route.params;
   const { user } = useSelector((state) => state.user);
   const members = useSelector((state) => state.detailChat.membersInGroup);

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
                  return <MemberItem item={item} />;
               }}
            />
         </View>
      </PaperProvider>
   );
};
