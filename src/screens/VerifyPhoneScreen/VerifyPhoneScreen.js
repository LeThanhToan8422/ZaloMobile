import auth from '@react-native-firebase/auth';
import { OtpInput } from 'react-native-otp-entry';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import styles from './styles';

export const VerifyPhoneScreen = ({ navigation, route }) => {
   const [confirm, setConfirm] = useState(null);
   const [code, setCode] = useState('');
   const phone = `${route.params.code}${route.params?.phone}`;

   // Handle login
   function onAuthStateChanged(user) {
      if (user) {
         navigation.navigate('PasswordScreen', { ...route.params });
      }
   }

   useEffect(() => {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      signInWithPhoneNumber(phone);
      return subscriber; // unsubscribe on unmount
   }, []);

   // Handle the button press
   const signInWithPhoneNumber = async (phone) => {
      const confirmation = await auth().signInWithPhoneNumber(phone);
      setConfirm(confirmation);
   };

   const confirmCode = async (code) => {
      try {
         await confirm.confirm(code);
         navigation.navigate('PasswordScreen', { ...route.params });
      } catch (error) {
         console.log(error);
         Toast.show({
            type: 'error',
            text1: 'Mã xác thực không chính xác',
            position: 'bottom',
         });
      }
   };

   return (
      <View>
         <OtpInput
            numberOfDigits={6}
            focusColor="green"
            focusStickBlinkingDuration={500}
            autoFocus
            onTextChange={(code) => setCode(code)}
            onFilled={(code) => confirmCode(code)}
            theme={{
               containerStyle: {
                  marginTop: 20,
                  marginHorizontal: 8,
               },
            }}
            textInputProps={{
               accessibilityLabel: 'One-Time Password',
            }}
         />

         <Button
            onPress={() => {
               setCode('');
               signInWithPhoneNumber(phone);
            }}
         >
            Gửi lại mã
         </Button>
      </View>
   );
};
