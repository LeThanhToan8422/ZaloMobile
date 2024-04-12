import React from 'react';
import { Image, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IntroSlider from '../../components/IntroSlider';
import styles from './styles';

export const AuthenticationScreen = ({ navigation }) => {
   const insets = useSafeAreaInsets();
   return (
      <View
         style={[
            styles.container,
            {
               paddingTop: 2 * insets.top,
               paddingBottom: insets.bottom ? 3 * insets.bottom : 30,
            },
         ]}
      >
         <View>
            <Image style={styles.logo} source={require('../../../assets/images/zalo.png')} />
         </View>
         <IntroSlider />
         <View style={{ rowGap: 8 }}>
            <Button
               mode="contained"
               style={[styles.button, { backgroundColor: '#4A8CFE' }]}
               contentStyle={{ width: '100%' }}
               onPress={() => navigation.navigate('Login')}
            >
               Đăng nhập
            </Button>
            <Button
               mode="contained"
               style={[styles.button, { backgroundColor: '#414347' }]}
               contentStyle={styles.button}
               onPress={() => navigation.navigate('Register')}
            >
               Đăng ký
            </Button>
         </View>
      </View>
   );
};
