import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import styles from './styles';
import DeviceInfo from 'react-native-device-info';
import { IconButton } from 'react-native-paper';

export const InfoAppScreen = ({ navigation }) => {
   useEffect(() => {
      navigation.setOptions({
         title: 'Thông tin ứng dụng',
      });
   }, []);

   const appVersion = DeviceInfo.getVersion();

   return (
      <View style={styles.container}>
         <View style={{ backgroundColor: '#fff', paddingHorizontal: 6, paddingVertical: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <Text style={styles.version}>Phiên bản: {appVersion}</Text>
               <IconButton icon="check-circle" size={24} iconColor="#375FD1" style={{ margin: 0 }} />
            </View>
            <Text>Bạn đang sử dụng phiên bản mới nhất</Text>
         </View>
      </View>
   );
};
