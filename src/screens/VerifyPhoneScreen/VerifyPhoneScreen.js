import auth from '@react-native-firebase/auth';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import styles from './styles';

export const VerifyPhoneScreen = ({ navigation, route }) => {
   const [confirm, setConfirm] = useState(null);
   const [code, setCode] = useState('');
   const phone = `${route.params.code}${route.params?.phone}`;
   const countryCode = route.params?.code;

   // Handle login
   function onAuthStateChanged(user) {
      if (user) {
         // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
         // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
         // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
         // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
      }
   }

   useEffect(() => {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      signInWithPhoneNumber(phone);
      return subscriber; // unsubscribe on unmount
   }, []);

   // Handle the button press
   async function signInWithPhoneNumber(phone) {
      const confirmation = await auth().signInWithPhoneNumber(phone);
      setConfirm(confirmation);
   }

   async function confirmCode(code) {
      try {
         await confirm.confirm(code);
         navigation.navigate('PasswordScreen', { ...route.params });
      } catch (error) {
         Toast.show({
            type: 'error',
            text1: 'Mã xác thực không chính xác',
            position: 'bottom',
         });
      }
   }

   return (
      <View>
         <OTPInputView
            style={styles.container}
            pinCount={6}
            code={code}
            onCodeChanged={(code) => setCode(code)}
            codeInputFieldStyle={styles.codeInput}
            codeInputHighlightStyle={styles.inputHighlight}
            onCodeFilled={(code) => confirmCode(code)}
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
