import React from 'react';
import { Image, Text, View } from 'react-native';
import styles from './styles';

export const SliderItem = ({ item }) => {
   const { title, description, image } = item;
   return (
      <View style={styles.container}>
         <View>
            <Image style={styles.image} source={image} />
         </View>
         <View style={{ justifyContent: 'center', alignItems: 'center', rowGap: 12 }}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
         </View>
      </View>
   );
};
