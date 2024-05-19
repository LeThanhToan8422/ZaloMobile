import ZegoUIKitPrebuiltCallService, {
   GROUP_VIDEO_CALL_CONFIG,
   GROUP_VOICE_CALL_CONFIG,
   ONE_ON_ONE_VIDEO_CALL_CONFIG,
   ONE_ON_ONE_VOICE_CALL_CONFIG,
   ZegoInvitationType,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { ZegoMenuBarButtonName } from '@zegocloud/zego-uikit-prebuilt-call-rn/lib/commonjs/services/defines';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';

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
         requireConfig: (data) => {
            const callConfig =
               data.invitees.length > 1
                  ? ZegoInvitationType.videoCall === data.type
                     ? GROUP_VIDEO_CALL_CONFIG
                     : GROUP_VOICE_CALL_CONFIG
                  : ZegoInvitationType.videoCall === data.type
                  ? ONE_ON_ONE_VIDEO_CALL_CONFIG
                  : ONE_ON_ONE_VOICE_CALL_CONFIG;
            return {
               ...callConfig,
               useSpeakerWhenJoining: false,
               // layout: {
               //    mode: ZegoLayoutMode.pictureInPicture,
               //    config: {
               //       smallViewBackgroundColor: '#333437',
               //       largeViewBackgroundColor: '#4A4B4D',
               //       smallViewBackgroundImage: 'your_server_image_url',
               //       largeViewBackgroundImage: 'your_server_image_url',
               //    },
               // },
               topMenuBarConfig: {
                  buttons: [ZegoMenuBarButtonName.minimizingButton],
               },
            };
         },
         notifyWhenAppRunningInBackgroundOrQuit: true,
         isIOSSandboxEnvironment: true,
      }
   );
};

const onUserLogout = async () => {
   return ZegoUIKitPrebuiltCallService.uninit();
};

export { onUserLogin, onUserLogout };
