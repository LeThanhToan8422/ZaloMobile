import { SERVER_HOST } from '@env';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import PhoneInput from 'react-native-phone-number-input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import styles from './styles';

export const PhoneNumberScreen = ({ navigation, route }, props) => {
   const [phone, setPhone] = useState('');
   const [code, setCode] = useState('+84');
   const insets = useSafeAreaInsets();
   const [valid, setValid] = useState(true);
   const phoneInput = useRef(null);

   const handleRegister = async () => {
      const checkValid = phoneInput.current?.isValidNumber(phone);
      setValid(checkValid);
      if (!checkValid) {
         Toast.show({ type: 'error', text1: 'Số điện thoại không hợp lệ', position: 'bottom' });
         return;
      }
      const checkPhone = await axios.get(`${SERVER_HOST}/accounts/phone/${phone}`);
      if (checkPhone.data) {
         Toast.show({ type: 'error', text1: 'Số điện thoại đã tồn tại', position: 'bottom' });
         return;
      }
      navigation.navigate('VerifyPhone', { code, phone, ...route.params });
   };

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
                     containerStyle={styles.phoneContainer}
                     onChangeCountry={(country) => setCode('+' + country.callingCode[0])}
                     autoFocus
                  />
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
