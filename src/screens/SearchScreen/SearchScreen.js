import axios from 'axios';
import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import SearchItem from '../../components/SearchItem';

export const SearchScreen = ({ navigation, route }) => {
   const SERVER_HOST = Constants.expoConfig.extra.SERVER_HOST;
   const search = route.params.search;
   const [data, setData] = useState(null);

   useEffect(() => {
      navigation.setOptions({
         title: `Tìm kiếm: ${search}`,
         headerTitleStyle: { fontSize: 18, fontWeight: '400' },
      });
      (async () => {
         const res = await axios.get(`${SERVER_HOST}/users/friends/7/${search}`);
         if (res.data.length !== 0) setData(res.data);
         else {
            const resPhone = await axios.get(`${SERVER_HOST}/users/phone/${search}`);
            if (resPhone.data || resPhone.data.length) setData([resPhone.data]);
            else setData([]);
         }
      })();
   }, []);

   return (
      <View>
         {data &&
            (data.length ? (
               <FlatList
                  data={data}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <SearchItem data={item} navigation={navigation} />}
               />
            ) : (
               <Text style={{ fontSize: 16, padding: 8 }}>Không tìm thấy người dùng</Text>
            ))}
      </View>
   );
};
