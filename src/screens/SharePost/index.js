import React, {useState, useEffect} from 'react';
// import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  MaskedViewIOS,
  Modal,
  BackHandler,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ImageBackground,
  ViewBase,
  TextInput,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import ButtonLarge from '../../component/ButtonLarge';
import {generateUID, currentDateFN} from '../../Utility/Utils';
import ImagePicker from 'react-native-image-picker';
import InputMultilineBig from '../../component/InputMultiLineBig';
import RNFetchBlob from 'rn-fetch-blob';
import {RNS3} from 'react-native-aws3';
import ButtonLargeIndicator from '../../component/ButtonLargeIndicator';
import {navigateToHome} from '../../Utility/Utils';
import Toast from 'react-native-toast-message';

export default function SharePost() {
  const navigation = useNavigation();

  const [post, setPost] = useState('');
  const [indicatButton, setIndicatButton] = useState(false);
  const [filePath, setFilePath] = useState({});

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  function postUploadFN() {
    var desc = '';
    if (post == '') {
      desc = global.sharePost.description;
    } else {
      desc = post;
    }
    setIndicatButton(true);
    var currentDate = currentDateFN();
    var unicodeString = '';
    console.log('desc', desc);
    for (var i = 0; i < desc.length; i++) {
      var theUnicode = desc.charCodeAt(i).toString(16).toUpperCase();
      while (theUnicode.length < 4) {
        theUnicode = '0' + theUnicode;
      }
      theUnicode = '\\u' + theUnicode;
      unicodeString += theUnicode;
    }
    fetch(global.address + 'SharePost', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
      body: JSON.stringify({
        postId: global.sharePost.post_id,
        userId: global.userData.user_id,
        dateTime: currentDate,
        imgUrl: global.sharePost.img_url,
        description: unicodeString,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        /* console.log('Amna', responseJson); */
        if (responseJson.Status == '200') {
          setPost('');
          setIndicatButton(false);
          global.refresh = true;
          navigation.navigate('Dashboard');
        }
      })
      .catch(error => {
        setIndicatButton(false);
        console.error(error);
        Toast.show({
          type: 'error',
          text2: 'Unable to post. Please try again later!',
        });
      });
  }

  function navigatFN() {
    global.homeScreenShow = '5';
    navigation.navigate('Dashboard');
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: global.colorPrimary,
        marginBottom: -30,
      }}>
      <ScrollView style={{padding: 10}}>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <TouchableOpacity onPress={() => navigatFN()}>
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
            Share post
          </Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <View>
            <Avatar
              rounded
              size="medium"
              source={{uri: global.userData.imgurl}}
            />
          </View>

          <View>
            <Text
              style={{
                color: global.colorTextPrimary,
                marginTop: 10,
                marginLeft: 15,
                fontSize: 16,
                fontFamily: global.fontSelect,
                fontWeight: 'bold',
              }}>
              {global.userData.name}
            </Text>
            <Text
              style={{
                color: global.colorTextPrimary,
                marginLeft: 15,
                fontFamily: global.fontSelect,
              }}>
              {global.userData.bio}
            </Text>
          </View>
        </View>

        <View style={{marginLeft: -10, marginBottom: 10}}>
          <InputMultilineBig
            placeholder="Type text here...."
            onChangeText={text => setPost(text)}
            value={post}
            secureTextEntry={false}
            color={global.colorTextPrimary}
          />
        </View>

        <Image
          source={{uri: global.sharePost.img_url}}
          style={styles.imageStyle}
        />

        {indicatButton == false ? (
          <ButtonLarge
            title="Post Now"
            onPress={() => postUploadFN()}
            bgClrFirst={global.btnColor1}
            bgClrSecond={global.btnColor2}
            txtClr={global.btnTxt}
            font={global.fontSelect}
          />
        ) : (
          <ButtonLargeIndicator
            title="Post Now"
            onPress={() => navigation.navigate('')}
            bgClrFirst={global.btnColor1}
            bgClrSecond={global.btnColor2}
            txtClr={global.btnTxt}
          />
        )}

        <View style={{marginBottom: 70}}></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tinyLogo: {
    width: 30,
    height: 20,
    marginTop: 10,
    tintColor: '#ffffff',
  },
  title: {
    fontSize: 25,
    color: '#E6E6E6',
    marginBottom: 25,
  },
  imageStyle: {
    width: 150,
    height: 150,
    margin: 5,
  },

  //modal

  button: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    elevation: 2,
    marginRight: '-72%',
    marginTop: '-11%',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#0B0213',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
});
