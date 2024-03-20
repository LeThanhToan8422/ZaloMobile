import { View, Text, Image, Pressable } from 'react-native';
import React from 'react';
import { IconButton } from 'react-native-paper';
import styles from './styles';

/**
 * Renders a contact item component.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.data - The contact data.
 * @param {string} props.data.name - The name of the contact.
 * @param {string} props.data.image - The URL of the contact's image.
 * @param {Object} props.navigation - The navigation object.
 * @returns {JSX.Element} The rendered contact item component.
 */
export const ContactItem = ({ data, navigation }) => {
   const { name, image } = data;
   return (
      <Pressable style={styles.container} onPress={() => navigation.navigate('ChatScreen', data)}>
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
