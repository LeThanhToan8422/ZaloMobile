import { View, Text } from 'react-native';
import React from 'react';
import { ZegoUIKitPrebuiltCall, ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { useSelector } from 'react-redux';
import styles from './styles';

export const CallScreen = ({ navigation, route }) => {
   const { user } = useSelector((state) => state.user);
   const callID = route.params?.callID;
   return (
      <View>
         <ZegoUIKitPrebuiltCall
            appID={1851922968}
            appSign="e110146816650993b60440168c50adf78da80ca06fbba04b081bbb42be9a1e6e"
            userID={`${user.id}`} // userID can be something like a phone number or the user id on your own user system.
            userName={user.name}
            callID={`${callID}`} // callID can be any unique string.
            config={{
               // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
               ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
               onOnlySelfInRoom: () => {
                  navigation.goBack();
               },
               onHangUp: () => {
                  navigation.goBack();
               },
            }}
         />
      </View>
   );
};
