import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';

ZegoUIKitPrebuiltCallService.useSystemCallingUI([ZIM, ZPNs]);

const onUserLogin = async (userID, userName, props) => {
   return ZegoUIKitPrebuiltCallService.init(
      1851922968,
      'e110146816650993b60440168c50adf78da80ca06fbba04b081bbb42be9a1e6e',
      String(userID),
      userName,
      [ZIM, ZPNs],
      {
         ringtoneConfig: {
            incomingCallFileName: 'incoming.mp3',
            outgoingCallFileName: 'outgoing.mp3',
         },
         androidNotificationConfig: {
            channelID: 'ZegoUIKit',
            channelName: 'ZegoUIKit',
         },
      }
   );
};

const onUserLogout = async () => {
   return ZegoUIKitPrebuiltCallService.uninit();
};

export { onUserLogin, onUserLogout };
