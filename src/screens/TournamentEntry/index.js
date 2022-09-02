import React, {useState, useEffect, useRef} from 'react';
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
import {Avatar} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import ButtonLarge from '../../component/ButtonLarge';
import {
  generateUID,
  currentDateFN,
  heightScaleByWidth,
} from '../../Utility/Utils';
import ImagePicker from 'react-native-image-picker';
import InputMultilineBig from '../../component/InputMultiLineBig';
import RNFetchBlob from 'rn-fetch-blob';
import {RNS3} from 'react-native-aws3';
import ButtonLargeIndicator from '../../component/ButtonLargeIndicator';
import {navigateToHome} from '../../Utility/Utils';
import Toast from 'react-native-toast-message';
import {getBucketOptions} from '../../Utility/Utils';
import storage from '@react-native-firebase/storage';

import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';

import {PESDK} from 'react-native-photoeditorsdk';

var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;

export default function TournamentEntry(routes) {
  const navigation = useNavigation();

  const [post, setPost] = useState('');
  const [indicatButton, setIndicatButton] = useState(false);
  const [filePath, setFilePath] = useState('');
  const [fileType, setFileType] = useState('');
  const [details, setDetails] = useState(null);

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
    if (routes && routes.route && routes.route.params)
      setFilePath(routes.route.params.uri);
    setFileType(routes.route.params.type);
    setDetails(routes.route.params.details);
  }, []);

  function openPhotoEditor(uri) {
    PESDK.openEditor({uri: uri}).then(
      result => {
        setFilePath(result.image);
      },
      error => {
        console.log(error);
      },
    );
  }

  function setStatusJoined() {
    fetch(global.address + 'EnrollInTournament/' + global.userData.user_id, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        //console.log(responseJson);
        global.userData.participated_in_tournament = 1;
        setIndicatButton(false);
        navigation.navigate('CongratsScreen');
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

  /* function checkIfJoined() {
    fetch(global.address + 'JoinTournament', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
      body: JSON.stringify({
        user_id: global.userData.user_id,
        post_id: -1,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        //console.log(responseJson);
        if (responseJson.Status == 200) {
          return false;
        } else {
          Toast.show({
            type: 'error',
            text2: responseJson.Message,
          });
          return true;
        }
      });
  } */

  function joinTournament(post_id) {
    fetch(global.address + 'JoinTournament', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
      body: JSON.stringify({
        user_id: global.userData.user_id,
        post_id: post_id,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        //console.log('joinTournament responseJson', responseJson);
        if (responseJson.Status == 200) {
          setStatusJoined();
        } else {
          setIndicatButton(false);
          Toast.show({
            type: 'error',
            text2: responseJson.Message,
          });
        }
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

  function uploadUmageToFirebase() {
    setIndicatButton(true);

    /* if (checkIfJoined()) {
      return;
    } */

    const file =
      fileType == 'photo'
        ? {
            uri: filePath,
            name: generateUID() + '.jpg',
            type: 'image/jpeg',
          }
        : {
            uri: filePath,
            name: generateUID() + '.mp4',
            type: 'video/mp4',
          };

    let reference = storage().ref(file.name);
    let task = reference.putFile(file.uri);

    task
      .then(response => {
        //console.log('Image uploaded to the bucket!');
        reference.getDownloadURL().then(response => {
          //console.log('Image downloaded from the bucket!', response);
          postUploadFN(response);
        });
      })
      .catch(e => {
        setIndicatButton(false);
        console.log('uploading image error => ', e);
        Toast.show({
          type: 'error',
          text2: 'Unable to post. Please try again later!',
        });
      });
  }

  function postUploadFN(location) {
    //console.log('LOCATION: ', location);
    var currentDate = currentDateFN();
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
        description: '',
        dateTime: currentDate,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.Status == '201') {
          setPost('');

          //console.log('responseJson', responseJson);

          // get post id and proceed with joining the tournament
          joinTournament(responseJson.post_id);

          //return;
        }
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

  /* function navigatFN() {
    global.homeScreenShow = '5';
    navigation.navigate('Dashboard');
  }
 */
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: global.colorPrimary,
        marginBottom: -30,
      }}>
      <ScrollView style={{paddingTop: 10}}>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 10,
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={{width: 40, height: 40, resizeMode: 'contain'}}
              source={require('../../images/backCircle.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openPhotoEditor(filePath)}>
            <Image
              style={{width: 40, height: 40, resizeMode: 'contain'}}
              source={require('../../images/editButton.png')}
            />
          </TouchableOpacity>
        </View>

        <View style={{marginVertical: 20}}>
          <Image
            source={{uri: filePath}}
            style={{
              width: windowWidth,
              height:
                heightScaleByWidth(
                  windowWidth,
                  details?.width || windowWidth,
                  details?.height,
                ) || windowHeight * 0.6,
              margin: 0,
            }}
          />
        </View>
        <View style={{marginHorizontal: 20}}>
          {indicatButton == false ? (
            <ButtonLarge
              title="Post Entry"
              onPress={() => uploadUmageToFirebase()}
              bgClrFirst={global.btnColor1}
              bgClrSecond={global.btnColor2}
              txtClr={global.btnTxt}
              font={global.fontSelect}
            />
          ) : (
            <ButtonLargeIndicator
              title="Post Entry"
              onPress={() => navigation.navigate('')}
              bgClrFirst={global.btnColor1}
              bgClrSecond={global.btnColor2}
              txtClr={global.btnTxt}
            />
          )}
        </View>
        <View style={{marginBottom: 70}}></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    color: '#E6E6E6',
    marginBottom: 25,
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
