import React, { useCallback } from 'react';
import { Linking, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import styles from './styles';

export const OpenURLText = ({ url, children, ...props }) => {
   const handlePress = useCallback(async () => {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
         await Linking.openURL(url);
      } else {
         Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'An error occurred while trying to open the link.',
         });
      }
   }, [url]);
   return (
      <Text style={[styles.link, props.style]} onPress={handlePress}>
         {children}
      </Text>
   );
};
