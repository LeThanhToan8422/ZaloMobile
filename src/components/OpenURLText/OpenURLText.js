import { View, Text, Linking, Alert } from 'react-native';
import React, { useCallback } from 'react';
import styles from './styles';

export const OpenURLText = ({ url, children }) => {
   const handlePress = useCallback(async () => {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
         await Linking.openURL(url);
      } else {
         // Alert.alert(`Don't know how to open this URL: ${url}`);
      }
   }, [url]);
   return (
      <Text style={styles.link} onPress={handlePress}>
         {children}
      </Text>
   );
};
