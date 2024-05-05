import { CameraView, useCameraPermissions } from 'expo-camera/next';
import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles';
import { socket } from '../../utils/socket';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { Icon, IconButton } from 'react-native-paper';
import { FlashMode } from 'expo-camera';

export const Camera = ({ navigation, route }) => {
   const [facing, setFacing] = useState('back');
   const [flash, setFlash] = useState(FlashMode.off);
   const [permission, requestPermission] = useCameraPermissions();
   const cameraRef = useRef(null);
   const user = useSelector((state) => state.user.user);

   useEffect(() => {
      (async () => {
         if (!permission?.granted) requestPermission();
      })();
   }, []);

   const closeCamera = () => {
      navigation.goBack();
   };

   const handleTakePhoto = async () => {
      if (cameraRef.current) {
         const photo = await cameraRef.current.takePhotoAsync();
         console.log(photo);
      }
   };

   const handleToggleFlash = () => {
      setFlash((prevFlash) => {
         return prevFlash === FlashMode.off ? FlashMode.on : FlashMode.off;
      });
   };

   const handleSwitchCamera = () => {
      setFacing(facing === 'back' ? 'front' : 'back');
   };

   const handleScanQRCode = ({ data }) => {
      if (data === 'Đăng nhập QRCode') {
         socket.emit('Client-Register-QR-Code', { id: user.id });
         setFacing('front');
         navigation.goBack();
         Toast.show({
            type: 'success',
            text1: 'Đăng nhập trên web thành công',
            position: 'bottom',
         });
      }
   };

   return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
         <CameraView
            style={{ flex: 1 }}
            facing={facing}
            flash={flash}
            ref={cameraRef}
            barcodeScannerSettings={{
               barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={handleScanQRCode}
         >
            <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 16, marginVertical: 28 }}>
               <IconButton
                  mode="contained-tonal"
                  icon="close"
                  size={16}
                  color="#fff"
                  onPress={closeCamera}
                  style={{ marginRight: 'auto' }}
               />
               <IconButton mode="contained-tonal" icon="flash" size={16} color="#fff" onPress={handleToggleFlash} />
               <IconButton
                  mode="contained-tonal"
                  icon="camera-switch"
                  size={16}
                  color="#fff"
                  onPress={handleSwitchCamera}
               />
               {route.params.type === 'qr' ? (
                  <></>
               ) : (
                  <View>
                     {/* Icon Take photo */}
                     <IconButton
                        mode="contained-tonal"
                        icon="camera"
                        size={28}
                        color="#fff"
                        style={styles.takePhoto}
                        onPress={handleTakePhoto}
                     />
                  </View>
               )}
            </View>
         </CameraView>
      </View>
   );
};
