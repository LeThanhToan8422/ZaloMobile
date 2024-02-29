import { View, Text } from 'react-native';
import React from 'react';
import { Button, Icon, IconButton } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import styles from './styles';
import ListChat from '../../../components/ListChat';

export const GroupTab = () => {
   return (
      <View>
         <Button
            mode="text"
            icon={() => <AntDesign style={styles.iconAdd} name="addusergroup" size={24} color="#4885FE" />}
            contentStyle={styles.addBtnContent}
            labelStyle={styles.addBtnLabel}
            style={styles.addBtn}
            onPress={() => console.log('Pressed')}
         >
            Create New Group
         </Button>

         <ListChat />
      </View>
   );
};
