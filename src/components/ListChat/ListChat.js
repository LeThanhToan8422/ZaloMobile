import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import ChatItem from '../ChatItem';
import axios from 'axios';

/**
 * Represents a component that displays a list of chats.
 * @param {object} navigation - The navigation object used for navigating between screens.
 * @returns {JSX.Element} The rendered ListChat component.
 */
export const ListChat = ({ chats, navigation, ...props }) => {
   // const { chats, navigation } = props;
   return (
      <View {...props}>
         <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ChatItem navigation={navigation} data={item} />}
         />
      </View>
   );
};
