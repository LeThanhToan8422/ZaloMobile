import { AntDesign, Entypo, Feather, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Text, TextInput, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import styles from './styles';

/**
 * Represents the header component of the app.
 * @param {object} navigation - The navigation object.
 * @param {object} props - Additional props for the header.
 * @param {string} type - The type of the header. Can be 'chat', 'settings', 'message', 'contact' or 'personal'.
 * @returns {JSX.Element} The header component.
 */
export const HeaderApp = ({ navigation, props, type, title, member }) => {
   Platform.OS === 'ios' ? (height = 44) : (height = 56);
   return (
      <Appbar.Header {...props} mode="small" style={{ height: height, backgroundColor: '#4D9DF7' }}>
         {type === 'chat' ? (
            <>
               <Appbar.Action
                  color="#fff"
                  size={22}
                  icon={(props) => <Entypo {...props} name="chevron-thin-left" />}
                  onPress={() => navigation.navigate('AppTabs')}
                  animated={false}
               />
               <Appbar.Content
                  title={
                     <>
                        <Text style={{ color: '#fff', fontWeight: 500, fontSize: 20 }}>{title}</Text>
                        {member ? <Text style={{ color: '#BBE5FE', fontWeight: '300' }}>{member} members</Text> : null}
                     </>
                  }
               />
               {!member ? (
                  <Appbar.Action
                     color="#fff"
                     size={24}
                     icon={(props) => <Ionicons {...props} name="call-outline" />}
                     animated={false}
                     onPress={() => {}}
                  />
               ) : null}
               <Appbar.Action
                  color="#fff"
                  size={24}
                  icon={(props) => <Feather {...props} name="video" />}
                  animated={false}
                  onPress={() => {}}
               />
               {member ? (
                  <Appbar.Action
                     color="#fff"
                     size={24}
                     icon={(props) => <Ionicons {...props} name="search" />}
                     animated={false}
                     onPress={() => {}}
                  />
               ) : null}
               <Appbar.Action
                  color="#fff"
                  size={24}
                  icon={(props) => <AntDesign {...props} name="bars" size={24} color="#fff" />}
                  animated={false}
                  onPress={() => {}}
               />
            </>
         ) : type === 'settings' ? (
            <>
               <Appbar.Action
                  color="#fff"
                  size={22}
                  icon={(props) => <Entypo {...props} name="chevron-thin-left" />}
                  onPress={() => navigation.navigate('AppTabs')}
                  animated={false}
               />
               <Appbar.Content
                  title={
                     <>
                        <Text style={{ color: '#fff', fontWeight: 500, fontSize: 20 }}>{title}</Text>
                        {member ? <Text style={{ color: '#BBE5FE', fontWeight: '300' }}>{member} members</Text> : null}
                     </>
                  }
               />
            </>
         ) : (
            <>
               <Appbar.Content
                  title={
                     <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12 }}>
                        <Ionicons name="ios-search-outline" size={22} color="white" />
                        <TextInput style={[styles.searchInput]} placeholder="Tìm kiếm" placeholderTextColor="#fff" />
                     </View>
                  }
                  onPress={() => {}}
               />
               {type === 'message' ? (
                  <>
                     <Appbar.Action
                        color="#fff"
                        size={20}
                        icon={(props) => <Ionicons {...props} name="ios-qr-code-outline" />}
                        animated={false}
                        onPress={() => {}}
                     />
                     <Appbar.Action
                        color="#fff"
                        size={32}
                        icon={(props) => <Ionicons {...props} name="ios-add-outline" />}
                        animated={false}
                        onPress={() => {}}
                     />
                  </>
               ) : type === 'contact' ? (
                  <Appbar.Action
                     color="#fff"
                     size={22}
                     icon={(props) => <Ionicons {...props} name="ios-person-add-outline" />}
                     animated={false}
                     onPress={() => {}}
                  />
               ) : type === 'personal' ? (
                  <Appbar.Action
                     color="#fff"
                     size={22}
                     icon={(props) => <Ionicons {...props} name="ios-settings-outline" />}
                     animated={false}
                     onPress={() => navigation.navigate('SettingScreen')}
                  />
               ) : null}
            </>
         )}
      </Appbar.Header>
   );
};
