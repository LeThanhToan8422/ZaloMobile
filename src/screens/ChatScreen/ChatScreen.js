import { View, Text } from 'react-native';
import React from 'react';

export const ChatScreen = ({ route }) => {
   const { name, message, time, avatar } = route.params;
   return (
      <View>
         <Text>{name}</Text>
         <Text>{message}</Text>
         <Text>{time}</Text>
         <Text>{avatar}</Text>
      </View>
   );
};
