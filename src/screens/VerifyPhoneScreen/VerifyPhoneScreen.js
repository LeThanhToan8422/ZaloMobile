import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

export const VerifyPhoneScreen = ({ navigation, route }) => {
   const [confirm, setConfirm] = useState(null);
   const [code, setCode] = useState('');
   const phone = route.params?.phone;

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
      signInWithPhoneNumber('+447444555666');
      return subscriber; // unsubscribe on unmount
   }, []);

   // Handle the button press
   async function signInWithPhoneNumber(phoneNumber) {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
   }

   async function confirmCode() {
      try {
         await confirm.confirm(code);
         navigation.navigate('PasswordScreen', { ...route.params });
      } catch (error) {
         console.log('Invalid code.');
      }
   }

   return (
      <View>
         <TextInput value={code} onChangeText={(text) => setCode(text)} />
         <Button onPress={confirmCode}>Confirm Code</Button>
      </View>
   );
};
