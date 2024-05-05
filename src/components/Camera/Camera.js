import { CameraView, useCameraPermissions } from 'expo-camera/next';
import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles';

export const Camera = ({ navigation }) => {
   const [facing, setFacing] = useState('back');
   const [permission, requestPermission] = useCameraPermissions();
   const cameraRef = useRef(null);

   useEffect(() => {
      (async () => {
         if (!permission.granted) requestPermission();
         setFacing('front');
      })();
   }, []);

   const closeCamera = () => {
      setFacing('back');
      navigation.goBack();
   };

   return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
         <CameraView style={{ flex: 1 }} facing={facing} ref={cameraRef}>
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'transparent', margin: 64 }}>
               <TouchableOpacity style={{ flex: 1, alignSelf: 'flex-end', alignItems: 'center' }} onPress={closeCamera}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>Close Camera</Text>
               </TouchableOpacity>
            </View>
         </CameraView>
      </View>
   );
};
