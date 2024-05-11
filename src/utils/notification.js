import notifee, { AndroidImportance } from '@notifee/react-native';

async function onDisplayNotification(title, body, largeIcon) {
   await notifee.requestPermission();

   const channelId = await notifee.createChannel({
      id: 'message',
      name: 'Message Channel',
      importance: AndroidImportance.HIGH,
   });

   await notifee.displayNotification({
      title,
      body,
      android: {
         channelId,
         largeIcon,
         pressAction: {
            id: 'default',
         },
      },
   });
}

export { onDisplayNotification };
