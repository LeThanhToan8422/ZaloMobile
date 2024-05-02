import Constants from 'expo-constants';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import styles from './styles';
import SearchItem from '../../components/SearchItem';

export const SearchScreen = ({ navigation, route }) => {
   const SERVER_HOST = Constants.manifest.extra.SERVER_HOST;
   const search = route.params.search;
   const [data, setData] = useState([]);

   useEffect(() => {
      getData();
   }, []);

   const getData = async () => {
      const res = await axios.get(`${SERVER_HOST}/users/friends/7/${search}`);
      if (res.data) setData(res.data);
   };

   return (
      <View>
         {data.length ? (
            <FlatList
               data={data}
               keyExtractor={(item) => item.id}
               renderItem={({ item }) => <SearchItem data={item} navigation={navigation} />}
            />
         ) : (
            <Text style={{ fontSize: 16, padding: 8 }}>Không tìm thấy người dùng</Text>
         )}
      </View>
   );
};
