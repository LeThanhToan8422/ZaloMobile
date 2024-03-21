import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { Icon } from 'react-native-paper';
import styles from './styles';

export const PressableItem = ({ navigation, icon, title, subtitle, action, ...props }) => {
   return (
      <Pressable style={[props.style, styles.container]}>
         <Icon source={icon} size={22} color="#375FD1" />
         <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
         </View>
         <View style={{ marginLeft: 'auto' }}>
            {action ? action : <Icon source="chevron-right" size={22} color="#999" />}
         </View>
      </Pressable>
   );
};
