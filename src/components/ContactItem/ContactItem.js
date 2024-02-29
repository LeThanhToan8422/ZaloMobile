import { View, Text, Image, Pressable } from 'react-native';
import React from 'react';
import { IconButton } from 'react-native-paper';
import styles from './styles';

export const ContactItem = ({ name, image }) => {
   return (
      <Pressable style={styles.container}>
         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image style={styles.image} source={{ uri: image }} />
            <Text style={styles.name}>{name}</Text>
         </View>
         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton icon="phone-outline" size={26} />
            <IconButton icon="video-outline" size={28} />
         </View>
      </Pressable>
   );
};
