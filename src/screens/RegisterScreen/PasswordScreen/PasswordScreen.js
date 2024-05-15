import Constants from 'expo-constants';
import axios from 'axios';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { checkPassword } from '../../../utils/func';
import { storeData } from '../../../utils/storage';
var bcrypt = require('bcryptjs');

export const PasswordScreen = ({ navigation, route }) => {
   const SERVER_HOST = Constants.expoConfig.extra.SERVER_HOST;
   const [password, setPassword] = useState('');
   const [rePassword, setRePassword] = useState('');
   const [securePass, setSecurePass] = useState(true);
   const [secureRePass, setSecureRePass] = useState(true);
   const { name, gender, dob, phone } = route.params;

   const handleRegister = async () => {
      if (!checkPassword(password, rePassword)) return;
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);
      try {
         const dataUsers = await axios.post(`${SERVER_HOST}/users`, {
            name,
            gender,
            dob,
            phone,
         });
         if (dataUsers.data) {
            const dataAccount = await axios.post(`${SERVER_HOST}/accounts`, {
               phone,
               password: hashPass,
               user: dataUsers.data.id,
            });
            if (dataAccount.data) {
               dispatch(fetchFriend(dataUsers.id));
               dispatch(fetchChats());
               dispatch(fetchFriendRequests());
               storeData('@user', { phone, password: hashPass, id: dataUsers.data.id });
               navigation.navigate('AppStack');
            }
         }
      } catch (error) {
         console.error(error);
         Toast.show({
            type: 'error',
            text1: 'Đã có lỗi xảy ra, vui lòng thử lại',
            position: 'bottom',
         });
      }
   };

   return (
      <KeyboardAvoidingView
         enabled
         {...(Platform.OS === 'ios' && { behavior: 'padding', keyboardVerticalOffset: 60 })}
         style={{ flexGrow: 1 }}
      >
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
               <TextInput
                  label="Mật khẩu"
                  secureTextEntry={securePass}
                  value={password}
                  onChangeText={(pass) => setPassword(pass)}
                  right={
                     <TextInput.Icon
                        icon={securePass ? 'eye-off' : 'eye'}
                        onPress={() => {
                           setSecurePass(!securePass);
                           return false;
                        }}
                     />
                  }
               />
               <TextInput
                  label="Nhập lại mật khẩu"
                  secureTextEntry={secureRePass}
                  value={rePassword}
                  onChangeText={(rePass) => setRePassword(rePass)}
                  right={
                     <TextInput.Icon
                        icon={secureRePass ? 'eye-off' : 'eye'}
                        onPress={() => {
                           setSecureRePass(!secureRePass);
                           return false;
                        }}
                     />
                  }
               />
               <Button style={{ marginTop: 16 }} mode="contained" onPress={handleRegister}>
                  Tiếp tục
               </Button>
            </View>
         </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
   );
};
