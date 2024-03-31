import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, LogBox, Platform, Text, TouchableWithoutFeedback, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import PhoneInput from 'react-native-phone-number-input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './styles';

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

export const PhoneNumberScreen = ({ navigation, route }) => {
   const [phone, setPhone] = useState('');
   const insets = useSafeAreaInsets();
   const [valid, setValid] = useState(true);
   const phoneInput = useRef(null);

   const handleRegister = () => {
      const checkValid = phoneInput.current?.isValidNumber(phone);
      setValid(checkValid);
      if (checkValid) {
         navigation.navigate('VerifyPhone', { ...route.params, phone });
      }
   };

   useEffect(() => {
      navigation.setOptions({});
   });

   return (
      <KeyboardAvoidingView
         enabled
         {...(Platform.OS === 'ios' && { behavior: 'padding', keyboardVerticalOffset: 80 })}
         style={{ flexGrow: 1 }}
      >
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, { paddingBottom: insets.bottom }]}>
               <View style={{ flex: 1, width: '100%' }}>
                  <Text style={styles.title}>Nhập số điện thoại của bạn để tạo tài khoản mới</Text>
                  <PhoneInput
                     ref={phoneInput}
                     defaultValue={phone}
                     defaultCode="VN"
                     layout="first"
                     onChangeText={(text) => setPhone(text)}
                     textContainerStyle={styles.phoneInputContainer}
                     flagButtonStyle={styles.phoneInputFlagButton}
                     autoFocus
                  />

                  <Text style={styles.textError}>{!valid ? 'Số điện thoại không hợp lệ' : null}</Text>
               </View>
               <IconButton
                  style={styles.btnNext}
                  mode="contained"
                  containerColor="#4B8FFE"
                  iconColor="#fff"
                  icon="arrow-right"
                  onPress={handleRegister}
               />
            </View>
         </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
   );
};
