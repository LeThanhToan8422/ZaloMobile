import notifee, { AndroidImportance, AndroidStyle, AuthorizationStatus } from '@notifee/react-native';

async function checkNotificationPermission() {
   const settings = await notifee.requestPermission();
   if (settings.authorizationStatus == AuthorizationStatus.DENIED) {
      notifee.openNotificationSettings();
   }
}

async function onDisplayNotification(title, body, largeIcon) {
   const channelId = await notifee.createChannel({
      id: 'message',
      name: 'Message Channel',
      importance: AndroidImportance.HIGH,
   });

   const params = {
      channelId,
      largeIcon,
      circularLargeIcon: true,
      pressAction: {
         id: 'default',
      },
   };
   const isImage = /(jpg|jpeg|png|bmp|bmp)$/i.test(body.split('.').pop());
   isImage && (params.style = { type: AndroidStyle.BIGPICTURE, picture: body });

   await notifee.displayNotification({
      title,
      body: !isImage ? body : '[Hình ảnh]',
      android: params,
   });
}

export { onDisplayNotification, checkNotificationPermission };
