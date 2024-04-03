import React from 'react';
import { BaseToast } from 'react-native-toast-message';

const toastProps = {
   text1NumberOfLines: 2,
};

export const toastConfig = {
   success: (props) => (
      <BaseToast
         {...props}
         {...toastProps}
         style={[
            toastProps.style,
            {
               borderLeftColor: '#69C779',
            },
         ]}
      />
   ),
   error: (props) => (
      <BaseToast
         {...props}
         {...toastProps}
         style={[
            toastProps.style,
            {
               borderLeftColor: '#EF494A',
            },
         ]}
      />
   ),
   warning: (props) => (
      <BaseToast
         {...props}
         {...toastProps}
         style={[
            toastProps.style,
            {
               borderLeftColor: '#FFC107',
            },
         ]}
      />
   ),
};
