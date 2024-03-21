import { View, Text, Image } from 'react-native';
import React from 'react';
import styles from './styles';
import PressableItem from '../../components/PressableItem';
import { IconButton } from 'react-native-paper';

export const PersonalScreen = ({ navigation }) => {
   return (
      <View style={styles.container}>
         <PressableItem
            navigation={navigation}
            icon={() => <Image style={styles.imageAvt} source={{ uri: 'https://picsum.photos/200' }} />}
            title="Account and security"
            subtitle="View my profile"
            action={
               <IconButton
                  icon="account-sync-outline"
                  size={24}
                  iconColor="#375FD1"
                  style={{ margin: 0 }}
                  onPress={() => {}}
               />
            }
            style={{ marginBottom: 8 }}
         />
         <PressableItem navigation={navigation} icon="security" title="Account and security" />
         <PressableItem navigation={navigation} icon="lock" title="Privacy" />
      </View>
   );
};
