import { Camera, CameraType } from 'expo-camera';
import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles';
import { BarCodeScanner } from 'expo-barcode-scanner';

export const CameraView = ({ navigation }) => {
   const [type, setType] = useState(CameraType.front);
   const [permission, requestPermission] = Camera.useCameraPermissions();
   const cameraRef = useRef(null);

   useEffect(() => {
      (async () => {
         if (!permission?.granted) requestPermission();
         setType(CameraType.front);
      })();
   }, []);

   const closeCamera = () => {
      setType(CameraType.back);
      navigation.goBack();
   };

   return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
         <Camera
            style={{ flex: 1 }}
            type={type}
            ref={cameraRef}
            barCodeScannerSettings={{
               barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
            }}
         >
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'transparent', margin: 64 }}>
               <TouchableOpacity style={{ flex: 1, alignSelf: 'flex-end', alignItems: 'center' }} onPress={closeCamera}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>Close Camera</Text>
               </TouchableOpacity>
            </View>
         </Camera>
      </View>
   );
};
