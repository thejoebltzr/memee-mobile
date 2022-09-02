import React, { useState, useEffect, useRef } from 'react';
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
  Dimensions,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import ButtonLarge from '../../component/ButtonLarge';
import { generateUID, currentDateFN } from '../../Utility/Utils';
import ImagePicker from 'react-native-image-picker';
import InputMultilineBig from '../../component/InputMultiLineBig';
import RNFetchBlob from 'rn-fetch-blob';
import { RNS3 } from 'react-native-aws3';
import ButtonLargeIndicator from '../../component/ButtonLargeIndicator';
import { navigateToHome } from '../../Utility/Utils';
import Toast from 'react-native-toast-message';
import { getBucketOptions } from '../../Utility/Utils';
import storage from '@react-native-firebase/storage';

import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';



export default function NewPost(routes) {
  const navigation = useNavigation();

  const [post, setPost] = useState('');
  const [indicatButton, setIndicatButton] = useState(false);
  const [filePath, setFilePath] = useState('');
  const [fileType, setFileType] = useState('');
  const [videoHeight,setVideoHeight] = useState(300);

  var player = useRef();

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

  useEffect(() => {
    console.log("File URI", routes.route.params.uri, "File TYPE", routes.route.params.type)
    if (routes && routes.route && routes.route.params)
      setFilePath(routes.route.params.uri);
    setFileType(routes.route.params.type)
  }, []);

  function uploadImageToS3() {
    setIndicatButton(true);

    const file = fileType == 'photo' ? {
      uri: filePath,
      name: generateUID() + '.jpg',
      type: 'image/jpeg',
    } : {
      uri: filePath,
      name: generateUID() + '.mp4',
      type: 'video/mp4',
    };

    let reference = storage().ref(file.name);
    let task = reference.putFile(file.uri);

    task
      .then(response => {
        console.log('Image uploaded to the bucket!');
        reference.getDownloadURL().then(response => {
          /* console.log('Image downloaded from the bucket!', response); */
          postUploadFN(response);
        });
      })
      .catch(e => {
        console.log('uploading image error => ', e);
        Toast.show({
          type: 'error',
          text2: 'Unable to post. Please try again later!',
        });
      });

    /* 
    RNS3.put(file, getBucketOptions('posts'))
      .then(response => {
        if (response.status !== 201)
          throw new Error('Failed to upload image to S3');
        console.log(response.body.postResponse.location);
        postUploadFN(response.body.postResponse.location);
      })
      .catch(error => {
        setIndicatButton(false);
        console.error(error);
        Toast.show({
          type: 'error',
          text2: 'Unable to post. Please try again later!',
        });
      }); */
  }

  function postUploadFN(location) {
    console.log("LOCATION: ", location);
    var currentDate = currentDateFN();
    var unicodeString = '';
    console.log('post', post);
    for (var i = 0; i < post.length; i++) {
      var theUnicode = post.charCodeAt(i).toString(16).toUpperCase();
      while (theUnicode.length < 4) {
        theUnicode = '0' + theUnicode;
      }
      theUnicode = '\\u' + theUnicode;
      unicodeString += theUnicode;
    }
    fetch(global.address + 'AddPost', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
      body: JSON.stringify({
        userID: global.userData.user_id,
        ImgUrl: location,
        description: unicodeString,
        dateTime: currentDate,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.Status == '201') {
          setPost('');
          global.refresh = true;
          navigation.navigate('Dashboard');
        }
        setIndicatButton(false);
      })
      .catch(error => {
        setIndicatButton(false);
        console.error(error);
        Toast.show({
          type: 'error',
          text2: 'Something went wrong. Please try again later!',
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
      <ScrollView style={{ padding: 10 }}>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <TouchableOpacity onPress={() => navigatFN()}>
            <Image
              style={[styles.tinyLogo, { tintColor: global.colorIcon }]}
              source={require('../../images/back1.png')}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.title,
              { fontFamily: global.fontSelect, color: global.colorIcon },
            ]}>
            {' '}
            New post
          </Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <View>
            <Avatar
              rounded
              size="medium"
              source={{ uri: global.userData.imgurl }}
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

        <View style={{ marginLeft: -10, marginBottom: 10 }}>
          <InputMultilineBig
            placeholder="Type text here...."
            onChangeText={text => setPost(text)}
            value={post}
            secureTextEntry={false}
            color={global.colorTextPrimary}
          />
        </View>
        {
          fileType == 'photo' ? <Image source={{ uri: filePath }} style={styles.imageStyle} /> :
            // <Video
            //   source={{ uri: filePath }}
            //   ref={player}
            //   resizeMode='contain'
            //   style={{ height: 300, margin: 5 }}
            // />
            <VideoPlayer
             
              source={{ uri: filePath }}
              disableFullscreen
              disableBack
              controlTimeout={2500}
              tapAnywhereToPause={true}
              showOnStart={true}

              style={{
                width: '100%',
                height: videoHeight
              }}
              resizeMode='contain'
              paused={false}
              onLoad={response => {
                const { width, height } = response.naturalSize;
                const heightScaled = height * (Dimensions.get("screen").width / width);
                if (heightScaled < 300) {
                  setVideoHeight(heightScaled)
                } 
              }}

            />
        }

        {indicatButton == false ? (
          <ButtonLarge
            title="Post Now"
            onPress={() => uploadImageToS3()}
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

        <View style={{ marginBottom: 70 }}></View>
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
