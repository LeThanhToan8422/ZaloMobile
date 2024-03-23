import { View, Text } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig } from '../../firebase/config';
import firebase from 'firebase/compat/app';

export const VerifyPhoneScreen = ({ navigation, route }) => {
   const phoneNumber = route.params.phone;
   const [confirm, setConfirm] = useState(null);
   const [code, setCode] = useState('');
   const recaptchaVerifier = useRef(null);

   // Handle login
   function onAuthStateChanged(user) {
      if (user) {
         firebaseConfig;
      }
   }

   useEffect(() => {
      console.log(phoneNumber);
      try {
         const phoneProvider = new firebase.auth.PhoneAuthProvider();
         phoneProvider
            .verifyPhoneNumber('+84' + phoneNumber, recaptchaVerifier.current)
            .then((verificationId) => setConfirm(verificationId));
      } catch (error) {
         console.log(error);
      }
   }, []);

   // Handle the button press
   async function signInWithPhoneNumber(phoneNumber) {
      // const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      // setConfirm(confirmation);
   }

   const confirmCode = async () => {
      console.log(phoneNumber);
      try {
         const credential = firebase.auth.PhoneAuthProvider.credential(confirm, code);
         firebase
            .auth()
            .signInWithCredential(credential)
            .then(() => {
               console.log('Phone authentication successful');
               navigation.navigate('AppStack');
            });
      } catch (error) {
         console.log('Invalid code.');
      }
   };

   // if (!confirm) {
   //    return <Button title="Phone Number Sign In" onPress={() => signInWithPhoneNumber('+1 650-555-3434')} />;
   // }

   return (
      <View>
         <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebaseConfig} />
         <TextInput value={code} onChangeText={(text) => setCode(text)} />
         <Button onPress={confirmCode}>Confirm Code</Button>
      </View>
   );
};
