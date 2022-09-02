import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  MaskedViewIOS,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ImageBackground,
  ViewBase,
} from 'react-native';
import {Avatar} from 'react-native-elements';

var searchTxtchk = '';
export default function AccountsScreen({navigation}) {
  const [searchData, setSearchData] = useState('');

  useEffect(() => {
    setInterval(function () {
      // searchFN()
      assignAcount();
    }, 2000);
  }, []);

  function assignAcount() {
    if (global.responseTop) setSearchData(global.responseTop.Users);
  }

  function navigateToProfile(index) {
    /* console.log(searchData[index].user_id) */

    global.profileID = searchData[index].user_id;
    navigation.navigate('ProfileScreen');

    global.searchText = '';
    searchTxtchk = '';
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: global.colorPrimary,
        paddingHorizontal: 5,
      }}>
      <FlatList
        data={searchData}
        renderItem={({item, index}) => (
          <TouchableOpacity onPress={() => navigateToProfile(index)}>
            <View
              style={{
                marginTop: 15,
                paddingBottom: 10,
                width: '100%',
                height: 70,
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomColor: global.resultsBorderBottomColor,
                borderBottomWidth: 1,
              }}>
              <Avatar rounded size="medium" source={{uri: item.imgurl}} />

              <View style={{width: '65%', height: 60, marginLeft: 10}}>
                <Text
                  style={{
                    color: global.colorTextPrimary,
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginTop: 4,
                  }}>
                  {' '}
                  {item.name}
                </Text>
                <Text
                  style={{
                    color: global.colorTextPrimary,
                    fontSize: 13,
                    marginTop: 2,
                  }}>
                  {item.bio}
                </Text>
              </View>

              <View
                style={{
                  width: '15%',
                  height: 60,
                  marginLeft: 'auto',
                  flexDirection: 'row',
                }}></View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        style={{borderRadius: 100, marginTop: 10, marginRight: 5}}
      />
    </View>
  );
}
