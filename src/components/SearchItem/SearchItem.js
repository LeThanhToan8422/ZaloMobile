import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import styles from './styles';
import { IconButton } from 'react-native-paper';
import { getUserID } from '../../utils/storage';

export const SearchItem = ({ navigation, data }) => {
   const { id, image, name } = data;
   const [localUserID, setLocalUserID] = useState(null);

   useEffect(() => {
      getUserID().then((id) => {
         setLocalUserID(id);
      });
   });

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
               <IconButton mode="contained-tonal" icon="account-plus" color="#000" size={20} onPress={() => {}} />
               <IconButton mode="contained-tonal" icon="chat-plus-outline" color="#000" size={20} onPress={() => {}} />
            </View>
         )}
      </Pressable>
   );
};
