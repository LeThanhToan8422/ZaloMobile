import { FlashList } from '@shopify/flash-list';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { fetchChats } from '../../features/chat/chatSlice';
import ChatItem from '../ChatItem';

/**
 * Represents a component that displays a list of chats.
 *
 * @component
 * @param {object} props - The props of the component.
 * @param {object} navigation - The navigation object used for navigating between screens.
 * @param {Array} chats - The list of chats to display.
 * @returns {JSX.Element} The rendered ListChat component.
 */
export const ListChat = ({ chats, navigation, ...props }) => {
   const dispatch = useDispatch();
   const [loading, setLoading] = useState(false);

   return (
      <View {...props}>
         <FlashList
            data={chats}
            keyExtractor={(_, index) => index.toString()}
            estimatedItemSize={10}
            renderItem={({ item }) => <ChatItem navigation={navigation} data={item} />}
            refreshing={loading}
            onRefresh={() => {
               dispatch(fetchChats());
            }}
         />
      </View>
   );
};
