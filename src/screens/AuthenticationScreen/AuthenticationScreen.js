import { View, Text, Image } from 'react-native';
import React, { useState } from 'react';
import styles from './styles';
import IntroSlider from '../../components/IntroSlider';
import { Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const AuthenticationScreen = ({ navigation }) => {
   const insets = useSafeAreaInsets();
   const [isEnglish, setIsEnglish] = useState(false);
   return (
      <View
         style={[
            styles.container,
            {
               paddingTop: insets.top,
               paddingBottom: insets.bottom,
               paddingHorizontal: insets.left,
               paddingVertical: insets.right,
            },
         ]}
      >
         <View>
            <Image style={styles.logo} source={require('../../assets/images/zalo.png')} />
         </View>
         <IntroSlider />
         <View style={{ rowGap: 8 }}>
            <Button
               mode="contained"
               style={[styles.button, { backgroundColor: '#4A8CFE' }]}
               contentStyle={styles.button}
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
         <View style={styles.languageContainer}>
            <Button
               mode="text"
               labelStyle={[styles.buttonText, !isEnglish ? styles.buttonActive : '']}
               style={[styles.buttonLang, !isEnglish ? styles.buttonActive : '']}
               onPress={() => setIsEnglish(false)}
            >
               Tiếng Việt
            </Button>
            <Button
               mode="text"
               labelStyle={[styles.buttonText, isEnglish ? styles.buttonActive : '']}
               style={[styles.buttonLang, isEnglish ? styles.buttonActive : '']}
               onPress={() => setIsEnglish(true)}
            >
               English
            </Button>
         </View>
      </View>
   );
};
