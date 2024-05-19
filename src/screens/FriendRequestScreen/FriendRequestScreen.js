import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { FriendRequestItem } from '../../components/FriendRequestItem/FriendRequestItem';

export const FriendRequestScreen = ({ navigation }) => {
   const { user } = useSelector((state) => state.user);
   const { friendRequests } = useSelector((state) => state.friendRequest);

   return (
      <View>
         {friendRequests.length > 0 ? (
            <FlatList
               data={friendRequests}
               keyExtractor={(item) => item.makeFriendId}
               renderItem={({ item }) => <FriendRequestItem navigation={navigation} userID={user.id} data={item} />}
            />
         ) : (
            <View style={{ paddingHorizontal: 8, paddingVertical: 12 }}>
               <Text style={{ fontSize: 16 }}>Bạn không có lời mời kết bạn nào</Text>
            </View>
         )}
      </View>
   );
};
