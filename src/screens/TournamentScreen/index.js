import React, {useState, useEffect} from 'react';
// import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  ScrollView,
  Image,
  ToastAndroid,
  Modal,
  Pressable,
} from 'react-native';
import ButtonLarge from '../../component/ButtonLarge';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  requestCameraPermission,
  requestExternalWritePermission,
} from '../../Utility/Utils';

// import PhotoEditor from 'react-native-photo-editor'

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;
export default function TounamentScreen(props) {
  const navigation = useNavigation();
  const [showImagePickerDialog, setShowImagePickerDialog] = useState(false);
  const currentDateTime = new Date();
  const currentMonth = currentDateTime.getMonth();
  const currentYear = currentDateTime.getFullYear();

  let options = {
    mediaType: 'photo',
    maxWidth: 512,
    maxHeight: 512,
    quality: 1,
  };

  const [indicatButton, setIndicatButton] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [enterTournament, setEnterTournament] = useState('');

  useEffect(() => {
    /* console.log(global.userData); */
    setEnterTournament(global.userData.participated_in_tournament);
  }, []);

  const checkIfJoinedTournament = () => {
    fetch(global.address + 'checkUserJoinedTournament', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
      body: JSON.stringify({
        user_id: global.userData.user_id,
        month: months[currentMonth],
        year: currentYear,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        //console.log('checkIfJoinedTournament', responseJson);
        if (responseJson?.Data?.joined_already) {
          Toast.show({
            type: 'info',
            text2: `Already joined the tournament for the month of ${months[currentMonth]}!`,
          });
        } else {
          setShowImagePickerDialog(!showImagePickerDialog);
        }
      })
      .catch(error => {
        console.error('checkIfJoinedTournament', error);
        Toast.show({
          type: 'error',
          text2: 'Something went wrong. Please try again later!',
        });
      });
  };

  const openCamera = async () => {
    setShowImagePickerDialog(false);
    let isStoragePermitted = await requestExternalWritePermission();
    let isCameraPermitted = await requestCameraPermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        /* console.log('Response = ', response); */

        if (response.didCancel) {
          // alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          // alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          // alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          // alert(response.errorMessage);
          return;
        }

        let source = response.assets[0];
        navigation.navigate('TournamentEntry', {
          uri: source.uri,
          type: 'photo',
          details: source,
        });
      });
    }
  };

  function openGallery() {
    setShowImagePickerDialog(false);
    launchImageLibrary(options, response => {
      /* console.log('Response = ', response); */

      if (response.didCancel) {
        // alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        // alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        // alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        // alert(response.errorMessage);
        return;
      }

      let source = response.assets[0];
      //openPhotoEditor(source.uri, source);
      navigation.navigate('TournamentEntry', {
        uri: source.uri,
        type: 'photo',
        details: source,
      });
    });
  }

  function enterIntoTournamentFN() {
    checkIfJoinedTournament();
    setModalVisible(!modalVisible);
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: '5%',
        paddingTop: '5%',
        backgroundColor: global.colorPrimary,
        marginBottom: 50,
      }}>
      <ScrollView>
        {/* <TouchableOpacity onPress={() => setModalVisible(true)}> */}
        <ImageBackground
          source={require('../../images/MaskGroup1.png')}
          style={{
            width: windowWidth - (windowWidth * 10) / 100,
            height: (windowWidth * 37) / 100,
          }}
          resizeMode="stretch">
          <Image
            style={{
              width: (windowWidth * 18) / 100,
              height: (windowWidth * 5.4) / 100,
              alignSelf: 'flex-end',
              marginRight: 29,
              marginTop: 18,
            }}
            resizeMode="stretch"
            source={require('../../images/amazon.png')}
          />

          <Image
            style={{
              width: windowWidth - (windowWidth * 67) / 100,
              height: (windowWidth * 8) / 100,
              alignSelf: 'center',
              marginTop: 18,
              marginLeft: '10%',
            }}
            resizeMode="stretch"
            source={require('../../images/Gold.png')}
          />

          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              marginLeft: '10%',
              fontSize: (windowWidth * 4) / 100,
              fontWeight: 'bold',
              color: '#fff',
              marginTop: 5,
              fontFamily: global.fontSelect,
            }}>
            100$ Gift Card
          </Text>
        </ImageBackground>
        {/* </TouchableOpacity> */}

        {/* <TouchableOpacity onPress={() => setModalVisible(true)}> */}
        <ImageBackground
          source={require('../../images/MaskGroup2.png')}
          style={{
            width: windowWidth - (windowWidth * 10) / 100,
            height: (windowWidth * 37) / 100,
            marginTop: 10,
          }}
          resizeMode="stretch">
          <Image
            style={{
              width: (windowWidth * 18) / 100,
              height: (windowWidth * 5.4) / 100,
              alignSelf: 'flex-end',
              marginRight: 29,
              marginTop: 18,
            }}
            resizeMode="stretch"
            source={require('../../images/amazon.png')}
          />

          <Image
            style={{
              width: windowWidth - (windowWidth * 67) / 100,
              height: (windowWidth * 8) / 100,
              alignSelf: 'center',
              marginTop: 18,
              marginLeft: '12.5%',
            }}
            resizeMode="stretch"
            source={require('../../images/Silver.png')}
          />
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              marginLeft: '7%',
              fontSize: (windowWidth * 4) / 100,
              fontWeight: 'bold',
              color: '#fff',
              marginTop: 5,
              fontFamily: global.fontSelect,
            }}>
            50$ Gift Card
          </Text>
        </ImageBackground>
        {/* </TouchableOpacity> */}

        {/* <TouchableOpacity onPress={() => setModalVisible(true)}> */}
        <ImageBackground
          source={require('../../images/MaskGroup3.png')}
          style={{
            width: windowWidth - (windowWidth * 10) / 100,
            height: (windowWidth * 37) / 100,
            marginTop: 10,
          }}
          resizeMode="stretch">
          <Image
            style={{
              width: (windowWidth * 18) / 100,
              height: (windowWidth * 5.4) / 100,
              alignSelf: 'flex-end',
              marginRight: 29,
              marginTop: 18,
            }}
            resizeMode="stretch"
            source={require('../../images/amazon.png')}
          />

          <Image
            style={{
              width: windowWidth - (windowWidth * 67) / 100,
              height: (windowWidth * 8) / 100,
              alignSelf: 'center',
              marginTop: 18,
              marginLeft: '20%',
            }}
            resizeMode="stretch"
            source={require('../../images/Bronze.png')}
          />

          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              marginLeft: '7%',
              fontSize: (windowWidth * 4) / 100,
              fontWeight: 'bold',
              color: '#fff',
              marginTop: 5,
            }}>
            20$ Gift Card
          </Text>
        </ImageBackground>
        {/* </TouchableOpacity> */}
        <ButtonLarge
          title="View all ranking prizes"
          onPress={() => navigation.navigate('RankingScreen')}
          bgClrFirst="#BF73FBff"
          bgClrSecond="#8E2CDBff"
          font={global.fontSelect}
          txtClr="#fff"
        />

        <ButtonLarge
          title="Enter Tournament"
          onPress={() => setModalVisible(true)}
          bgClrFirst={global.btnColor1}
          bgClrSecond={global.btnColor2}
          font={global.fontSelect}
          txtClr={global.btnTxt}
        />

        <View style={{margin: 50}}></View>
      </ScrollView>

      <Modal
        animationType=""
        transparent={true}
        presentationStyle="overFullScreen"
        visible={modalVisible}
        /* visible={true} */
        onRequestClose={() => {
          // alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => setModalVisible(!modalVisible)}
              style={{position: 'absolute', right: 0, top: -20, zIndex: 999}}>
              <Image
                source={require('../../images/cross.png')}
                style={{width: 40, height: 40}}></Image>
            </TouchableOpacity>
            <Text
              style={[
                styles.modalText,
                {
                  fontFamily: global.fontSelect,
                  marginBottom: 20,
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: 'white',
                },
              ]}>
              Rules & Regulations
            </Text>

            <Text
              style={{
                color: '#fff',
                fontSize: 13,
                textAlign: 'center',
                fontFamily: global.fontSelect,
              }}>
              During the tournament all participants are expected to behave
              professionally and should avoid abusive language/gestures/
              question umpires decisions.
            </Text>

            <Text
              style={{
                color: '#fff',
                fontSize: 13,
                textAlign: 'center',
                marginTop: 15,
                fontFamily: global.fontSelect,
              }}>
              The Team Captain is responsible for informing all of the teammates
              about when the team will be playing and on what dates.
            </Text>

            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => enterIntoTournamentFN()}>
              <LinearGradient
                colors={[global.btnColor1, global.btnColor2]}
                /* colors={['white', 'yellow']} */
                style={{
                  borderRadius: 25,
                  paddingVertical: 13,
                  paddingHorizontal: 40,
                }}>
                <Text
                  style={[
                    styles.textStyle,
                    {fontFamily: global.fontSelect, color: global.btnTxt},
                  ]}>
                  Agree
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showImagePickerDialog}
        onRequestClose={() => {
          setShowImagePickerDialog(!showImagePickerDialog);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalViewImgPicker}>
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 18,
                marginBottom: '15%',
                marginTop: '3%',
              }}>
              Select File
            </Text>

            <TouchableOpacity
              style={{marginBottom: '8%'}}
              onPress={() => openCamera()}>
              <Text style={{color: '#fff', opacity: 0.5, fontSize: 16}}>
                Take photo...
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{marginBottom: '6%'}}
              onPress={() => openGallery()}>
              <Text style={{color: '#fff', opacity: 0.5, fontSize: 16}}>
                Choose Photo from library...
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonOpen, {marginTop: '20%'}]}
              onPress={() => setShowImagePickerDialog(false)}>
              <LinearGradient
                colors={[global.btnColor1, global.btnColor2]}
                style={{
                  paddingHorizontal: 27,
                  paddingVertical: 15,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderRadius: 22,
                }}>
                <Text style={[styles.modalText, {color: global.btnTxt}]}>
                  Close
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    color: '#E6E6E6',
    marginBottom: 25,
  },
  txt: {
    color: '#E6E6E6',
    marginTop: 20,
    marginLeft: '4%',
    marginBottom: '14%',
  },
  txtbelow: {
    color: '#E6E6E6',
    marginTop: '12%',
    alignSelf: 'center',
    marginBottom: '5%',
  },
  txtdown: {
    color: '#E6E6E6',
    marginTop: '5%',
    alignSelf: 'center',
    marginBottom: '10%',
  },
  txtdown2: {
    color: '#FBC848',
    marginTop: '5%',
    alignSelf: 'center',
    marginBottom: '10%',
    marginLeft: 10,
  },
  tinyLogo: {
    width: 30,
    height: 20,
    marginTop: 10,
    tintColor: '#ffffff',
  },

  //Modal CSS
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#292929',
    borderRadius: 23,
    padding: 35,
    width: '80%',
    borderColor: '#fff',
    borderWidth: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 25,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    // backgroundColor: "#2196F3",
    marginTop: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: '800',
    textAlign: 'center',
  },
  modalText: {
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalViewImgPicker: {
    margin: 20,
    height: 300,
    width: '65%',
    backgroundColor: '#201E23',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '6%',
  },
  modalText: {
    marginBottom: 0,
    marginTop: 0,
    textAlign: 'center',
  },
  buttonOpen: {
    backgroundColor: '#FBC848',
    alignSelf: 'center',
  },
  button: {
    borderRadius: 25,
    elevation: 2,
    marginRight: '1%',
    marginTop: '1%',
  },
});
