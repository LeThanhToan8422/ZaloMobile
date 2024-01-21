import { View, Text, Dimensions, Pressable } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from './styles';

export const HeaderApp = ({ children }) => {
   const paddingRightTextSearch = 0;
   return (
      <View style={styles.container}>
         <Pressable style={styles.containerSearch}>
            <Ionicons name="ios-search-outline" size={22} color="white" />
            <Text style={[styles.text, { paddingRight: paddingRightTextSearch }]}>Tìm kiếm</Text>
         </Pressable>
         <View style={styles.containerIconRight}>{children}</View>
      </View>
   );
};
