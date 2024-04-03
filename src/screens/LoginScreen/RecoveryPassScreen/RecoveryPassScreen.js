import React, { useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Button } from 'react-native-paper';
import PhoneInput from 'react-native-phone-number-input';
import styles from './styles';

export const RecoveryPassScreen = ({ navigation }) => {
   const [phone, setPhone] = useState('');
   const [valid, setValid] = useState(true);
   const phoneInput = useRef(null);

   const handleRecovery = () => {
      const checkValid = phoneInput.current?.isValidNumber(phone);
      setValid(checkValid);
      if (checkValid) {
         navigation.navigate('VerifyPhone', { phone });
      }
   };

   return (
      <KeyboardAvoidingView
         enabled
         {...(Platform.OS === 'ios' && { behavior: 'padding', keyboardVerticalOffset: 80 })}
         style={{ flexGrow: 1 }}
      >
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
               <Text style={styles.title}>Vui lòng nhập số điện thoại và mật khẩu để đăng nhập</Text>
               <PhoneInput
                  ref={phoneInput}
                  defaultValue={phone}
                  defaultCode="VN"
                  layout="first"
                  onChangeText={(text) => setPhone(text)}
                  containerStyle={{ width: '100%' }}
                  textContainerStyle={styles.phoneInputContainer}
                  flagButtonStyle={styles.phoneInputFlagButton}
                  autoFocus
               />

               <Text style={styles.textError}>{!valid ? 'Số điện thoại không hợp lệ' : null}</Text>
               <Button mode="contained" style={styles.btnStyle} onPress={handleRecovery}>
                  Tiếp tục
               </Button>
            </View>
         </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
   );
};
