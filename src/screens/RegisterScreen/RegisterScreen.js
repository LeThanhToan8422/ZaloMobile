import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, View } from 'react-native';
import { IconButton, TextInput } from 'react-native-paper';
import { OpenURLText } from '../../components/OpenURLText/OpenURLText';
import styles from './styles';

export const RegisterScreen = ({ navigation }) => {
   const [name, setName] = useState('');
   return (
      <KeyboardAvoidingView
         enabled
         {...(Platform.OS === 'ios' && { behavior: 'padding', keyboardVerticalOffset: 80 })}
         style={{ flexGrow: 1 }}
      >
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
               <Text style={{ fontWeight: '600' }}>Tên Zalo</Text>
               <TextInput
                  mode="outlined"
                  placeholder="Gồm 2-40 ký tự"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  contentStyle={styles.inputContent}
                  onChangeText={(text) => setName(text)}
                  value={name}
               />
               <View style={{ rowGap: 6 }}>
                  <Text>Lưu ý khi đặt tên:</Text>
                  <Text>
                     Không vi phạm
                     <OpenURLText url="https://zalo.me/pc"> Điều khoản dịch vụ </OpenURLText>
                  </Text>
                  <Text>Nên sử dụng tên thật giúp bạn bè dễ nhận ra bạn</Text>
               </View>
               <IconButton
                  style={styles.btnNext}
                  mode="contained"
                  containerColor="#4B8FFE"
                  iconColor="#fff"
                  icon="arrow-right"
                  disabled={name.length < 2 || name.length > 40}
                  onPress={() => navigation.navigate('PhoneNumber')}
               />
            </View>
         </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
   );
};
