import { View, Text } from 'react-native';
import React from 'react';
import styles from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const Timeline = () => {
   const insets = useSafeAreaInsets();
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
         <Text>Timeline</Text>
      </View>
   );
};
