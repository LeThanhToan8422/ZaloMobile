import React from 'react';
import { FlatList, View } from 'react-native';
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
   // const { chats, navigation } = props;
   return (
      <View {...props}>
         <FlatList
            data={chats}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => <ChatItem navigation={navigation} data={item} />}
         />
      </View>
   );
};
