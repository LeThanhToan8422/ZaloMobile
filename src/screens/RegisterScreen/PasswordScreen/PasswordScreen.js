import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import axios from 'axios';
import { SERVER_HOST, PORT } from '@env';
import { storeData } from '../../../utils/storage';

export const PasswordScreen = ({ navigation, route }) => {
   const [password, setPassword] = useState('');
   const [rePassword, setRePassword] = useState('');
   const [securePass, setSecurePass] = useState(true);
   const [secureRePass, setSecureRePass] = useState(true);
   const { name, gender, dob, phone } = route.params;

   const handleRegister = async () => {
      if (password.length < 8) {
         alert('Mật khẩu phải có ít nhất 8 ký tự');
         return false;
      }
      if (password !== rePassword) {
         alert('Mật khẩu không trùng khớp');
         return false;
      }
      console.log({
         name,
         gender,
         dob,
      });
      let dataUsers = await axios.post(`${SERVER_HOST}:${PORT}/users`, {
         name,
         gender,
         dob,
      });
      console.log(dataUsers.data);
      if (dataUsers.data) {
         let dataAccount = await axios.post(`${SERVER_HOST}:${PORT}/accounts`, {
            phone,
            password,
            user: dataUsers.data.id,
         });
         if (dataAccount.data) {
            storeData({ phone, password, id: dataAccount.data.id });
            navigation.navigate('AppStack');
         }
      }
   };

   return (
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
   );
};
