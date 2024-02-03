import { AntDesign, Entypo, Feather, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Text, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import styles from './styles';

/**
 * Represents the header component of the app.
 * @param {object} navigation - The navigation object.
 * @param {object} props - Additional props for the header.
 * @param {string} type - The type of the header. Can be 'chat', 'message', 'contact', 'discovery', 'timeline', or 'personal'.
 * @returns {JSX.Element} The header component.
 */
export const HeaderApp = ({ navigation, props, type, title }) => {
   Platform.OS === 'ios' ? (height = 44) : (height = 56);
   return (
      <Appbar.Header {...props} mode="small" style={{ height: height, backgroundColor: '#4D9DF7' }}>
         {type === 'chat' ? (
            <>
               <Appbar.Action
                  color="#fff"
                  size={22}
                  icon={(props) => <Entypo {...props} name="chevron-thin-left" />}
                  onPress={navigation.goBack}
                  animated={false}
               />
               <Appbar.Content color="#fff" titleStyle={{ fontWeight: 500, fontSize: 20 }} title={title} />
               <Appbar.Action
                  color="#fff"
                  size={24}
                  icon={(props) => <Ionicons {...props} name="call-outline" />}
                  animated={false}
                  onPress={() => {}}
               />
               <Appbar.Action
                  color="#fff"
                  size={24}
                  icon={(props) => <Feather {...props} name="video" />}
                  animated={false}
                  onPress={() => {}}
               />
               <Appbar.Action
                  color="#fff"
                  size={24}
                  icon={(props) => <AntDesign {...props} name="bars" size={24} color="#fff" />}
                  animated={false}
                  onPress={() => {}}
               />
            </>
         ) : (
            <>
               <Appbar.Content
                  color="#fff"
                  titleStyle={{ fontWeight: 500, fontSize: 20 }}
                  title={
                     <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12 }}>
                        <Ionicons name="ios-search-outline" size={22} color="white" />
                        <Text style={[styles.text]}>Tìm kiếm</Text>
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
               ) : type === 'discovery' ? (
                  <Appbar.Action
                     color="#fff"
                     size={20}
                     icon={(props) => <Ionicons {...props} name="ios-qr-code-outline" />}
                     animated={false}
                     onPress={() => {}}
                  />
               ) : type === 'timeline' ? (
                  <>
                     <Appbar.Action
                        color="#fff"
                        size={20}
                        icon={(props) => <SimpleLineIcons {...props} name="note" />}
                        animated={false}
                        onPress={() => {}}
                     />
                     <Appbar.Action
                        color="#fff"
                        size={20}
                        icon={(props) => <SimpleLineIcons {...props} name="bell" />}
                        animated={false}
                        onPress={() => {}}
                     />
                  </>
               ) : (
                  <Appbar.Action
                     color="#fff"
                     size={22}
                     icon={(props) => <Ionicons {...props} name="ios-settings-outline" />}
                     animated={false}
                     onPress={() => {}}
                  />
               )}
            </>
         )}
      </Appbar.Header>
   );
};
