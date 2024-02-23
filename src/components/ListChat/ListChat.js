import { View, Text } from 'react-native';
import React from 'react';
import { FlatList } from 'react-native';
import ChatItem from '../ChatItem';

export const ListChat = ({ navigation }) => {
   const data = [
      {
         id: 1,
         name: 'Nguyễn Văn A',
         message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
         time: '10:00',
         avatar: 'https://picsum.photos/200',
         numberMessageUnread: 1,
      },
      {
         id: 2,
         name: 'Nguyễn Văn B',
         message: 'Hello',
         time: '10:00',
         avatar: 'https://picsum.photos/200',
         numberMessageUnread: 2,
      },
      {
         id: 3,
         name: 'Zalo Fake',
         member: 3,
         message: 'Hello',
         time: '10:00',
         avatar: 'https://picsum.photos/200',
         numberMessageUnread: 0,
      },
      {
         id: 4,
         name: 'Nguyễn Văn D',
         message: 'Hello',
         time: '10:00',
         avatar: 'https://picsum.photos/200',
         numberMessageUnread: 0,
      },
      {
         id: 5,
         name: 'Tết đong đầy',
         member: 7,
         message: 'Hello',
         time: '10:00',
         avatar: 'https://picsum.photos/200',
         numberMessageUnread: 4,
      },
      {
         id: 6,
         name: 'Nguyễn Văn F',
         message: 'Hello',
         time: '10:00',
         avatar: 'https://picsum.photos/200',
         numberMessageUnread: 7,
      },
      {
         id: 7,
         name: 'Nguyễn Văn G',
         message: 'Hello',
         time: '10:00',
         avatar: 'https://picsum.photos/200',
         numberMessageUnread: 0,
      },
      {
         id: 8,
         name: 'Nguyễn Văn H',
         message: 'Hello',
         time: '10:00',
         avatar: 'https://picsum.photos/200',
         numberMessageUnread: 0,
      },
      {
         id: 9,
         name: 'Nguyễn Văn I',
         message: 'Hello',
         time: '10:00',
         avatar: 'https://picsum.photos/200',
         numberMessageUnread: 1,
      },
      {
         id: 10,
         name: 'Nguyễn Văn K',
         message: 'Hello',
         time: '10:00',
         avatar: 'https://picsum.photos/200',
         numberMessageUnread: 0,
      },
      {
         id: 11,
         name: 'Nguyễn Văn L',
         message: 'Hello',
         time: '10:00',
         avatar: 'https://picsum.photos/200',
         numberMessageUnread: 0,
      },
      {
         id: 12,
         name: 'Nguyễn Văn M',
         message: 'Hello',
         time: '10:00',
         avatar: 'https://picsum.photos/200',
         numberMessageUnread: 2,
      },
      {
         id: 13,
         name: 'Nguyễn Văn N',
         message: 'Hello',
         time: '10:00',
         avatar: 'https://picsum.photos/200',
         numberMessageUnread: 0,
      },
      {
         id: 14,
         name: 'Nguyễn Văn O',
         message: 'Hello',
         time: '10:00',
         avatar: 'https://picsum.photos/200',
         numberMessageUnread: 0,
      },
      {
         id: 15,
         name: 'Nguyễn Văn P',
         message: 'Hello',
         time: '10:00',
         avatar: 'https://picsum.photos/200',
         numberMessageUnread: 1,
      },
   ];
   return (
      <View>
         <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ChatItem navigation={navigation} data={item} />}
         />
      </View>
   );
};
