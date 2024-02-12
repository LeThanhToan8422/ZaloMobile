import {
   View,
   Text,
   KeyboardAvoidingView,
   TextInput,
   Platform,
   Keyboard,
   TouchableWithoutFeedback,
} from 'react-native';
import React, { useState } from 'react';
import styles from '../ContactScreen/styles';
import { Icon, IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-web';

export const ChatScreen = ({ route }) => {
   const [messages, setMessages] = useState('');
   const insets = useSafeAreaInsets();
   const { name, message, time, avatar } = route.params;
   return (
      <KeyboardAvoidingView
         enabled
         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
         keyboardVerticalOffset={60}
         style={{ flexGrow: 1 }}
      >
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
               <View style={{ flexGrow: 1, backgroundColor: '#E2E8F1' }}></View>
               <View style={[styles.chatContainer, { paddingBottom: insets.bottom }]}>
                  <IconButton icon="sticker-emoji" size={28} iconColor="#333" />
                  <TextInput
                     style={styles.input}
                     value={messages}
                     onChangeText={(text) => setMessages(text)}
                     placeholder="Message"
                     placeholderTextColor={'#888'}
                     underlineColorAndroid="transparent"
                  />
                  {!messages ? (
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
