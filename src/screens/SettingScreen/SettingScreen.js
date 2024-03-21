import { View, Text } from 'react-native';
import React from 'react';
import PressableItem from '../../components/PressableItem';
import { Button } from 'react-native-paper';
import { storeData } from '../../utils/storage';

export const SettingScreen = ({ navigation }) => {
   return (
      <View>
         <PressableItem icon="security" title="Tài khoản và bảo mật" />
         <PressableItem icon="lock-outline" title="Quyền riêng tư" style={{ marginBottom: 8 }} />
         <PressableItem icon="bell-outline" title="Thông báo" />
         <PressableItem icon="chat-processing-outline" title="Tin nhắn" />
         <PressableItem icon="phone-outline" title="Cuộc gọi" />
         <PressableItem icon="contacts-outline" title="Danh bạ" style={{ marginBottom: 8 }} />
         <PressableItem icon="information-outline" title="Thông tin về Zalo" style={{ marginBottom: 8 }} />
         <PressableItem icon="help-circle-outline" title="Trợ giúp" />
         <Button
            mode="contained"
            icon="logout"
            contentStyle={{ flexDirection: 'row-reverse' }}
            style={{ margin: 8, backgroundColor: '#666' }}
            onPress={() => {
               storeData(null);
               navigation.reset({
                  index: 0,
                  routes: [{ name: 'AuthStack' }],
               });
            }}
         >
            Đăng xuất
         </Button>
      </View>
   );
};
