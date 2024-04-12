import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import styles from './styles';
import { IconButton } from 'react-native-paper';
import { getUserID } from '../../utils/storage';
import { socket } from '../../utils/socket';

export const SearchItem = ({ navigation, data }) => {
   const [userID, setUserID] = useState(null);
   const { id, image, name } = data;
   const [localUserID, setLocalUserID] = useState(null);
   const [isFriend, setIsFriend] = useState(false);
   const [isSendRequest, setIsSendRequest] = useState(false);

   useEffect(() => {
      getUserID().then((id) => {
         setUserID(id);
         setLocalUserID(id);
      });
   });

   const handleAddFriend = async () => {
      socket.emit(`Client-Make-Friends`, {
         content: 'Mình kết bạn với nhau nhé!!!',
         giver: userID, // id user của mình
         recipient: id, // id của user muốn kết bạn hoặc block
         chatRoom: userID > id ? `${id}${userID}` : `${userID}${id}`,
      });
      setIsSendRequest(!isSendRequest);
   };

   return (
      <Pressable
         style={styles.container}
         onPress={() => {
            navigation.goBack();
            navigation.navigate('ProfileScreen', { friend: id });
         }}
      >
         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: image }} style={styles.avatar} />
            <Text style={styles.name}>{name}</Text>
         </View>
         {localUserID !== id && (
            <View style={{ flexDirection: 'row' }}>
               {!isFriend && (
                  <IconButton
                     mode="contained-tonal"
                     icon={isSendRequest ? 'account-off-outline' : 'account-plus'}
                     color="#000"
                     size={20}
                     onPress={() => {}}
                  />
               )}
               <IconButton mode="contained-tonal" icon="chat-plus-outline" color="#000" size={20} onPress={() => {}} />
            </View>
         )}
      </Pressable>
   );
};
