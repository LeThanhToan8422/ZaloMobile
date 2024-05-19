import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View } from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import { Button, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { checkPassword } from '../../utils/func';
import { getData } from '../../utils/storage';
import { onUserLogout } from '../../utils/zego';
var bcrypt = require('bcryptjs');
bcrypt.setRandomFallback((len) => {
   var buf = new Uint8Array(len);
   return buf.map(() => Math.floor(Math.random() * 256));
});
var salt = bcrypt.genSaltSync(10);

export const ChangePassScreen = ({ navigation, route }) => {
   const SERVER_HOST = Constants.expoConfig.extra.SERVER_HOST;
   const [oldPass, setOldPass] = useState('');
   const [password, setPassword] = useState('');
   const [rePassword, setRePassword] = useState('');
   const [secureOldPass, setSecureOldPass] = useState(true);
   const [securePass, setSecurePass] = useState(true);
   const [secureRePass, setSecureRePass] = useState(true);
   const { phone } = route.params;
   const [visible, setVisible] = useState(false);

   const handleChangePass = async () => {
      setVisible(true);
      try {
         const dataUsers = await axios.get(`${SERVER_HOST}/accounts/phone/${phone}`);
         if (bcrypt.compareSync(oldPass, dataUsers.data.password)) {
            if (!checkPassword(password, rePassword)) {
               setVisible(false);
               return;
            }
            if (bcrypt.compareSync(password, dataUsers.data.password)) {
               setVisible(false);
               Toast.show({
                  type: 'error',
                  text1: 'Mật khẩu mới không được trùng với mật khẩu cũ',
                  position: 'bottom',
               });
               return;
            }
            const hashPass = bcrypt.hashSync(password, salt);
            const dataAccount = await axios.put(`${SERVER_HOST}/accounts`, {
               phone,
               password: hashPass,
               id: dataUsers.data.id,
            });
            if (dataAccount.data) {
               setVisible(false);
               Toast.show({
                  type: 'success',
                  text1: 'Đổi mật khẩu thành công',
                  position: 'bottom',
               });
               onUserLogout();
               await AsyncStorage.clear();
               navigation.reset({
                  index: 0,
                  routes: [{ name: 'AuthStack' }],
               });
            }
         } else {
            setVisible(false);
            Toast.show({
               type: 'error',
               text1: 'Mật khẩu cũ không đúng',
               position: 'bottom',
            });
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
               <AnimatedLoader
                  visible={visible}
                  overlayColor="rgba(255,255,255,1)"
                  source={require('../../../assets/lotties/loader.json')}
                  animationStyle={{
                     width: 200,
                     height: 200,
                  }}
                  speed={2}
               />
               <TextInput
                  label="Mật khẩu cũ"
                  secureTextEntry={secureOldPass}
                  value={oldPass}
                  onChangeText={(oldPass) => setOldPass(oldPass)}
                  right={
                     <TextInput.Icon
                        icon={secureOldPass ? 'eye-off' : 'eye'}
                        onPress={() => {
                           setSecureOldPass(!secureOldPass);
                           return false;
                        }}
                     />
                  }
               />
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
               <Button style={{ marginTop: 16 }} mode="contained" onPress={handleChangePass}>
                  Tiếp tục
               </Button>
            </View>
         </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
   );
};
