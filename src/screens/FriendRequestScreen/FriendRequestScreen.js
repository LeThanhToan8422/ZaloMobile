import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { FriendRequestItem } from '../../components/FriendRequestItem/FriendRequestItem';
import { useSelector } from 'react-redux';

export const FriendRequestScreen = ({ navigation }) => {
   const { user } = useSelector((state) => state.user);
   const { friendRequests } = useSelector((state) => state.friendRequest);

   return (
      <View>
         <FlatList
            data={friendRequests}
            keyExtractor={(item) => item.makeFriendId}
            renderItem={({ item }) => <FriendRequestItem navigation={navigation} userID={user.id} data={item} />}
         />
      </View>
   );
};
