import { View, Text } from 'react-native';
import React from 'react';
import styles from './styles';
import PressableItem from '../../components/PressableItem';

export const PersonalScreen = ({ navigation }) => {
   return (
      <View style={styles.container}>
         <PressableItem
            navigation={navigation}
            icon="security"
            title="Account and security"
            style={{ marginBottom: 8 }}
         />
         <PressableItem navigation={navigation} icon="security" title="Account and security" />
         <PressableItem navigation={navigation} icon="lock" title="Privacy" />
      </View>
   );
};
