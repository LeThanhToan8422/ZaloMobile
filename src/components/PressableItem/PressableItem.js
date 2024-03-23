import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { Icon } from 'react-native-paper';
import styles from './styles';

/**
 * A custom pressable item component.
 *
 * @param {object} props - The component props.
 * @param {object} props.navigation - The navigation object.
 * @param {string} props.screenName - The name of the screen to navigate to.
 * @param {string} props.icon - The source of the icon.
 * @param {string} props.title - The title of the item.
 * @param {string} props.subtitle - The subtitle of the item.
 * @param {ReactNode} props.action - The action component to render.
 * @param {object} props.style - The custom style for the component.
 * @returns {ReactNode} The rendered pressable item component.
 */

export const PressableItem = ({ navigation, screenName, icon, iconStyle, title, subtitle, action, ...props }) => {
   return (
      <Pressable
         style={[props.style, styles.container]}
         onPress={() => (screenName ? navigation.navigate(screenName) : null)}
      >
         <Icon source={icon} size={22} color="#375FD1" {...iconStyle} />
         <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
         </View>
         <View style={{ marginLeft: 'auto' }}>
            {action === null ? null : action ? action : <Icon source="chevron-right" size={22} color="#999" />}
         </View>
      </Pressable>
   );
};
