import { PORT, SERVER_HOST } from '@env';
import axios from 'axios';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View } from 'react-native';
import reactNativeBcrypt from 'react-native-bcrypt';
import { Button, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { checkPassword } from '../../../utils/func';
import { storeData } from '../../../utils/storage';

export const PasswordScreen = ({ navigation, route }) => {
   const [password, setPassword] = useState('');
   const [rePassword, setRePassword] = useState('');
   const [securePass, setSecurePass] = useState(true);
   const [secureRePass, setSecureRePass] = useState(true);
   const { name, gender, dob, phone } = route.params;

   const handleRegister = async () => {
      if (!checkPassword(password, rePassword)) return;
      const salt = reactNativeBcrypt.genSaltSync(10);
      const hashPass = reactNativeBcrypt.hashSync(password, salt);
      try {
         const dataUsers = await axios.post(`${SERVER_HOST}:${PORT}/users`, {
            name,
            gender,
            dob,
            phone,
         });
         if (dataUsers.data) {
            const dataAccount = await axios.post(`${SERVER_HOST}:${PORT}/accounts`, {
               phone,
               password: hashPass,
               user: dataUsers.data.id,
            });
            if (dataAccount.data) {
               storeData({ phone, password: hashPass, id: dataUsers.data.id });
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
