import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import SimpleInput from '../../component/SimpleTextInput';
import {useFocusEffect} from '@react-navigation/native';
const axios = require('axios');
import Toast from 'react-native-toast-message';

export default function NewMessage({navigation}) {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTxt, setSearchTxt] = useState('');
  const [followingList, setFollowingList] = useState('');
  const [myuserList, setMyuserList] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      /* console.log('Screen was focused'); */
      userListShowFN();
      // Do something when the screen is focused
      return () => {
        /* console.log('Screen was unfocused'); */
      };
    }, []),
  );

  function userListShowFN() {
    fetch(global.address + 'GetFollowedUsersList/' + global.userData.user_id, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        /* console.log('\n following called.... \n', responseJson.Requests); */
        setMyuserList(responseJson.Requests);
        setFollowingList(responseJson.Requests);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(true);
      });
  }

  const searchUserFN = text => {
    /* console.log('text', text); */

    setSearchTxt(text);
    
    if(!isLoading){
      var seachedUser = myuserList?.filter(function search(user) {
        return (
          user.name.toUpperCase().includes(text.toUpperCase()) ||
          user.email.toUpperCase().includes(text.toUpperCase())
        );
      });
      setFollowingList(seachedUser);
    }
    
  };

  function openChat(user) {
    console.log('openChat', user);
    let users = [];
    users.push({userId: global.userData.user_id, name: global.userData.name});
    users.push({userId: user.following_id, name: user.name});
    console.log('users', users);
    navigation.navigate('ChatScreen', {
      user: {
        _id: user.following_id,
        receiver_id: user.following_id,
        conversationId: user.following_id,
        name: user.name,
        img: user.img,
        online: user.online,
      },
    });

    // axios({
    //   method: 'post',
    //   url: `${global.address}createConversation`,
    //   data: users,
    // })
    //   .catch(error => {
    //     // loginError()
    //     console.log('GLOBAL er ', error);
    //     Toast.show({
    //       type: 'error',
    //       text2: 'Something went wrong',
    //     });
    //   })
    //   .then(Response => {
    //     console.log('products Response: WITH TOKEN', Response.data);
    //     navigation.navigate('ChatScreen', {
    //       conversationId: Response.data.ConversationID,
    //       name: Response.data.Title,
    //       image: user.img,
    //     });

    //     console.log('conversationId', Response.data.ConversationID);
    //   });
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: '5%',
        paddingTop: '5%',
        backgroundColor: global.colorPrimary,
      }}>
      {/* <ScrollView> */}
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={[styles.tinyLogo, {tintColor: global.colorIcon}]}
            source={require('../../images/back1.png')}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.title,
            {fontFamily: global.fontSelect, color: global.colorIcon},
          ]}>
          {' '}
          New message
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: global.searchInputColor,
          width: '96%',
          height: 60,
          alignSelf: 'center',
          alignItems: 'center',
          borderRadius: 30,
          marginBottom: 20,
        }}>
        <Text style={{color: '#fff', marginLeft: '7%'}}>To: </Text>
        <View style={{width: '75%', marginTop: -8}}>
          <SimpleInput
            color={global.searchInputTextColor}
            placeholder=""
            onChangeText={text => searchUserFN(text)}
            value={searchTxt}
            secureTextEntry={false}
          />
        </View>
      </View>

      <FlatList
        data={followingList}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={{flexDirection: 'row', marginBottom: 20}}
            onPress={() => openChat(item)}>
            <View>
              {item.img != '' ? (
                <Image
                  source={{uri: item.img}}
                  style={[styles.addFriendImage, {}]}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={require('../../images/person1.png')}
                  style={[styles.addFriendImage, {}]}
                  resizeMode="cover"
                />
              )}
            </View>
            <View style={{marginLeft: '5%', marginTop: '1%'}}>
              <Text
                style={[styles.addText, {textAlign: 'left', color: colorIcon}]}>
                {item.name}
              </Text>
              <Text style={[styles.nameText, {color: colorTextPrimary}]}>
                {item.email}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />

      {/* </ScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    color: '#E6E6E6',
    marginBottom: 25,
  },
  tinyLogo: {
    width: 30,
    height: 20,
    marginTop: 10,
    tintColor: '#ffffff',
  },
  addFriendImage: {height: 50, width: 50, borderRadius: 50 / 2},
});
