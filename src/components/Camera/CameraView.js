import { Camera, CameraType } from 'expo-camera';
import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import styles from './styles';

export const CameraView = ({ navigation }) => {
   const [type, setType] = useState(CameraType.front);
   const [permission, requestPermission] = Camera.useCameraPermissions();

   const openCamera = () => {
      if (!permission.granted) requestPermission();
      setType(CameraType.front);
   };

   const closeCamera = () => {
      setType(CameraType.back);
      navigation.goBack();
   };

   return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
         <Camera style={{ flex: 1 }} type={type}>
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'transparent', margin: 64 }}>
               <TouchableOpacity style={{ flex: 1, alignSelf: 'flex-end', alignItems: 'center' }} onPress={closeCamera}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>Close Camera</Text>
               </TouchableOpacity>
            </View>
         </Camera>
      </View>
   );
};
