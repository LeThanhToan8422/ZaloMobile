import React, { useState } from 'react';
import { Text, View } from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import { Button, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import OpenURLText from '../../components/OpenURLText';
import { fetchChats } from '../../features/chat/chatSlice';
import { fetchFriend } from '../../features/friend/friendSlice';
import { login } from '../../features/user/userSlice';
import { storeData } from '../../utils/storage';
import { onUserLogin } from '../../utils/zego';
import styles from './styles';

export const LoginScreen = ({ navigation }) => {
   const [phone, setPhone] = useState('');
   const [password, setPassword] = useState('');
   const [secPass, setSecPass] = useState(true);
   const [visible, setVisible] = useState(false);
   const insets = useSafeAreaInsets();
   const dispatch = useDispatch();

   const handleLogin = async () => {
      setVisible(true);
      dispatch(login({ phone, password }))
         .unwrap()
         .then((res) => {
            if (res) {
               storeData('@user', { phone: res.phone, password: password, user: res.user });
               dispatch(fetchFriend(res.id));
               dispatch(fetchChats());
               onUserLogin(res.id, res.name);
               setVisible(false);
               navigation.navigate('AppStack');
            } else {
               setVisible(false);
               Toast.show({
                  type: 'error',
                  text1: `Đăng nhập thất bại. Sai số điện thoại hoặc mật khẩu`,
                  position: 'bottom',
               });
            }
         })
         .catch((err) => {
            setVisible(false);
            Toast.show({
               type: 'error',
               text1: `Đăng nhập thất bại. ${err.message}`,
               position: 'bottom',
            });
         });
   };

   return (
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
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
         <View style={{ flex: 1, width: '100%' }}>
            <Text style={styles.title}>Vui lòng nhập số điện thoại và mật khẩu để đăng nhập</Text>
            <TextInput
               placeholder="Số điện thoại"
               mode="flat"
               activeUnderlineColor="skyblue"
               style={{ backgroundColor: '#fff' }}
               value={phone}
               enterKeyHint="next"
               onChangeText={(text) => {
                  setPhone(text);
               }}
            />
            <TextInput
               placeholder="Mật khẩu"
               mode="flat"
               activeUnderlineColor="skyblue"
               style={{ backgroundColor: '#fff' }}
               onChangeText={(text) => setPassword(text)}
               secureTextEntry={secPass}
               value={password}
               right={
                  <TextInput.Icon
                     icon={secPass ? 'eye-off' : 'eye'}
                     onPress={() => {
                        setSecPass(!secPass);
                     }}
                  />
               }
            />
            <Button textColor="cornflowerblue" onPress={() => navigation.navigate('RecoveryPass')}>
               Lấy lại mật khẩu
            </Button>
            <Button mode="contained" style={styles.btnStyle} onPress={handleLogin}>
               Đăng nhập
            </Button>
         </View>
         <View style={{ marginBottom: 10 }}>
            <OpenURLText url="https://www.google.com">Các câu hỏi thường gặp</OpenURLText>
         </View>
      </View>
   );
};
