import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import styles from './styles';
import { ZegoSendCallInvitationButton } from '@zegocloud/zego-uikit-prebuilt-call-rn';

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
   const { id, name, image } = data;
   return (
      <Pressable style={styles.container} onPress={() => navigation.navigate('ChatScreen', data)}>
         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image style={styles.image} source={{ uri: image }} />
            <Text style={styles.name}>{name}</Text>
         </View>
         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton
               icon={() => (
                  <ZegoSendCallInvitationButton
                     invitees={[{ userID: String(id), userName: name, avatar: image }]}
                     key={id}
                     isVideoCall={false}
                     resourceID={'zego_call'}
                     width={32}
                     height={32}
                  />
               )}
               onPress={() => {}}
            />
            <IconButton
               icon={() => (
                  <ZegoSendCallInvitationButton
                     invitees={[{ userID: String(id), userName: name, avatar: image }]}
                     key={id}
                     isVideoCall={true}
                     resourceID={'zego_call'}
                     width={32}
                     height={32}
                  />
               )}
               onPress={() => {}}
            />
         </View>
      </Pressable>
   );
};
