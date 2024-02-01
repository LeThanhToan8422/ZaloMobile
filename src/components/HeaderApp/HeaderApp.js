import { View, Text, Dimensions, Pressable, TextInput } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from './styles';

export const HeaderApp = ({ left, right }) => {
   return (
      <View style={styles.container}>
         <Pressable style={styles.containerSearch}>{left}</Pressable>
         <View style={styles.containerIconRight}>{right}</View>
      </View>
   );
};
