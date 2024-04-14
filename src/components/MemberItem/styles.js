import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
   iconKeyContainer: {
      backgroundColor: '#333',
      opacity: 0.8,
      width: 22,
      height: 22,
      borderRadius: 11,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: -4,
      right: -4,
      transform: [{ rotate: '90deg' }],
   },
});

export default styles;
