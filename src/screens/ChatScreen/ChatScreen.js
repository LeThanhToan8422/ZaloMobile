import React, { useState } from 'react';
import {
   FlatList,
   Keyboard,
   KeyboardAvoidingView,
   Platform,
   TextInput,
   TouchableWithoutFeedback,
   View,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Message from '../../components/Message';
import styles from './styles';

/**
 * ChatScreen component. This component is used to render the chat screen.
 *
 * @param {Object} route - The route object containing navigation parameters.
 * @returns {JSX.Element} The rendered ChatScreen component.
 */
export const ChatScreen = ({ route }) => {
   const [message, setMessage] = useState('');
   const insets = useSafeAreaInsets();
   const messages = [
      {
         user: 0,
         time: '12:00',
         content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      },
      {
         user: 0,
         time: '12:01',
         content: 'Hello, my name is Viet',
      },
      {
         user: 1,
         time: '12:00',
         content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      },
      {
         user: 1,
         time: '12:01',
         content: 'Hello, my name is Viet',
      },
      {
         user: 0,
         time: '12:00',
         content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      },
      {
         user: 0,
         time: '12:01',
         content: 'Hello, my name is Viet',
      },
      {
         user: 1,
         time: '12:00',
         content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      },
      {
         user: 1,
         time: '12:01',
         content: 'Hello, my name is Viet',
      },
      {
         user: 0,
         time: '12:00',
         content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      },
      {
         user: 0,
         time: '12:01',
         content: 'Hello, my name is Viet',
      },
      {
         user: 1,
         time: '12:00',
         content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      },
      {
         user: 1,
         time: '12:01',
         content: 'Hello, my name is Viet',
      },
      {
         user: 0,
         time: '12:00',
         content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      },
      {
         user: 0,
         time: '12:01',
         content: 'Hello, my name is Viet',
      },
      {
         user: 1,
         time: '12:00',
         content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      },
      {
         user: 1,
         time: '12:01',
         content: 'Hello, my name is Viet',
      },
      {
         user: 0,
         time: '12:00',
         content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      },
      {
         user: 0,
         time: '12:01',
         content: 'Hello, my name is Viet',
      },
      {
         user: 1,
         time: '12:00',
         content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      },
      {
         user: 1,
         time: '12:01',
         content: 'Hello, my name is Viet',
      },
   ];
   return (
      <KeyboardAvoidingView
         enabled
         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
         keyboardVerticalOffset={60}
         style={{ flexGrow: 1 }}
      >
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
               <FlatList
                  inverted
                  data={messages}
                  style={{ flexGrow: 1, backgroundColor: '#E2E8F1' }}
                  renderItem={({ item, index }) => <Message data={item} index={index} />}
                  keyExtractor={(_, index) => index.toString()}
               />
               <View style={[styles.chatContainer, { paddingBottom: insets.bottom }]}>
                  <IconButton icon="sticker-emoji" size={28} iconColor="#333" />
                  <TextInput
                     style={styles.input}
                     value={message}
                     onChangeText={(text) => setMessage(text)}
                     placeholder="Message"
                     placeholderTextColor={'#888'}
                     underlineColorAndroid="transparent"
                  />
                  {!message ? (
                     <>
                        <IconButton icon="dots-horizontal" size={32} iconColor="#333" />
                        <IconButton icon="microphone-outline" size={32} iconColor="#333" />
                        <IconButton icon="file-image" size={32} iconColor="#333" />
                     </>
                  ) : (
                     <IconButton icon="send-circle" size={32} iconColor="#4D9DF7" />
                  )}
               </View>
            </View>
         </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
   );
};
