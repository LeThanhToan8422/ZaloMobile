import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      rowGap: 30,
   },
   logo: {
      width: 96,
      height: 32,
   },
   languageContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 250,
   },
   buttonLang: {
      borderRadius: 0,
   },
   buttonText: {
      color: '#586067',
   },
   buttonActive: {
      borderBottomWidth: 1,
      borderBottomColor: '#000',
      color: '#000',
   },
});

export default styles;
