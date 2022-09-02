import React, {useState, useEffect} from 'react';
// import { useState } from 'react';
import {
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  BackHandler,
  Dimensions,
  PermissionsAndroid,
  Modal,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ImageBackground,
  ViewBase,
} from 'react-native';
import ButtonCoins from '../../component/ButtonCoins';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import BottomNavBar from '../../component/BottomNavBar';
import TounamentScreen from '../TournamentScreen';
import Store from '../Store';
import LinearGradient from 'react-native-linear-gradient';
import JudgeScreen from '../JudgeScreen';

global.navigateTournament = -1;
var checkNavi = 0;

export default function Tournament(props) {
  const navigation = useNavigation();

  const {coinsStored, ImageBottoms, notifications} = useSelector(
    ({authRed}) => authRed,
  );

  const [btncolor1_1, setBtncolor1_1] = useState(global.btnColor1);
  const [btncolor1_2, setBtncolor1_2] = useState(global.btnColor1);
  const [txtcolor1, setTxtcolor1] = useState(global.btnTxt);

  const [btncolor2_1, setBtncolor2_1] = useState('#201E23');
  const [btncolor2_2, setBtncolor2_2] = useState('#201E23');
  const [txtcolor2, setTxtcolor2] = useState('#ABABAD');

  const [btncolor3_1, setBtncolor3_1] = useState('#201E23');
  const [btncolor3_2, setBtncolor3_2] = useState('#201E23');
  const [txtcolor3, setTxtcolor3] = useState('#ABABAD');
  const [dBottomFont, setdBottomFont] = useState(global.fontSelect);
  const [modalVisible, setModalVisible] = useState(false);

  const [postNo, setPostNo] = useState('2');

  useEffect(() => {
    setdBottomFont(global.fontSelect);
    SelectedBtnFN(2);
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
    // console.log("coinsStored", coinsStored)
    setdBottomFont(global.fontSelect);
    const unsubscribe = navigation.addListener('focus', () => {
      setdBottomFont(global.fontSelect);
      console.log('global.navigateTournament', global.navigateTournament);
      if (global.navigateTournament == -1) {
        checkNavi = 2;
      } else {
        checkNavi = global.navigateTournament;
      }
      SelectedBtnFN(checkNavi);
    });

    return unsubscribe;
  }, [navigation]);

  function SelectedBtnFN(btnNo) {
    global.navigateTournament = btnNo;
    setPostNo(btnNo);

    if (btnNo == 1) {
      setBtncolor1_1(global.btnColor1);
      setBtncolor1_2(global.btnColor2);

      setBtncolor2_1(global.tabNotSelectedColor);
      setBtncolor2_2(global.tabNotSelectedColor);

      setBtncolor3_1(global.tabNotSelectedColor);
      setBtncolor3_2(global.tabNotSelectedColor);

      setTxtcolor1(global.btnTxt);
      setTxtcolor2(global.tabNotSelectedTextColor);
      setTxtcolor3(global.tabNotSelectedTextColor);
    } else if (btnNo == 2) {
      setBtncolor1_1(global.tabNotSelectedColor);
      setBtncolor1_2(global.tabNotSelectedColor);

      setBtncolor2_1(global.btnColor1);
      setBtncolor2_2(global.btnColor2);

      setBtncolor3_1(global.tabNotSelectedColor);
      setBtncolor3_2(global.tabNotSelectedColor);

      setTxtcolor1(global.tabNotSelectedTextColor);
      setTxtcolor2(global.btnTxt);
      setTxtcolor3(global.tabNotSelectedTextColor);
    } else if (btnNo == 3) {
      setBtncolor1_1(global.tabNotSelectedColor);
      setBtncolor1_2(global.tabNotSelectedColor);

      setBtncolor2_1(global.tabNotSelectedColor);
      setBtncolor2_2(global.tabNotSelectedColor);

      setBtncolor3_1(global.btnColor1);
      setBtncolor3_2(global.btnColor2);

      setTxtcolor1(global.tabNotSelectedTextColor);
      setTxtcolor2(global.tabNotSelectedTextColor);
      setTxtcolor3(global.btnTxt);
    } else {
      setBtncolor1_1(global.btnColor1);
      setBtncolor1_2(global.btnColor2);

      setBtncolor2_1(global.tabNotSelectedColor);
      setBtncolor2_2(global.tabNotSelectedColor);

      setBtncolor3_1(global.tabNotSelectedColor);
      setBtncolor3_2(global.tabNotSelectedColor);

      setTxtcolor1(global.btnTxt);
      setTxtcolor2(global.tabNotSelectedTextColor);
      setTxtcolor3(global.tabNotSelectedTextColor);
    }
  }

  // for bottom tab
  function activeTab(counter) {
    global.TabButton = counter;
    if (counter == 1) {
      navigation.navigate('Dashboard');
    } else if (counter == 2) {
      navigation.navigate('ExploreScreen');
    } else if (counter == 3) {
      navigation.navigate('Tournament');
    } else if (counter == 4) {
      global.profileID = global.userData.user_id;
      navigation.navigate('ProfileScreen');
    }
  }

  return (
    <View
      style={{flex: 1, backgroundColor: global.colorPrimary, marginBottom: 0}}>
      <ScrollView style={{marginBottom: -25}}>
        <View style={styles.topView}>
          <Text
            numberOfLines={1}
            style={{
              width: '30%',
              fontSize: 20,
              fontWeight: '800',
              color: global.colorTextPrimary,
              marginLeft: 7,
              marginTop: 6,
              marginRight: 10,
              fontFamily: global.fontSelect,
            }}>
            Tournament
          </Text>
          <View
            style={{width: '70%', flexDirection: 'row', marginLeft: 'auto'}}>
            <TouchableOpacity
              onPress={() => setModalVisible(!modalVisible)}
              style={{marginTop: 12, marginLeft: 'auto'}}>
              <Image
                style={{height: 25, width: 25, tintColor: global.colorIcon}}
                resizeMode="stretch"
                source={require('../../images/InfoCircle.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('NotificationScreen')}
              style={{marginLeft: 'auto'}}>
              <Image
                style={{
                  height: 50,
                  width: 30,
                  tintColor: global.colorIcon,
                  marginRight: 10,
                }}
                resizeMode="contain"
                source={
                  notifications.some(n => n.status == 0)
                    ? require('../../images/notifications.png')
                    : require('../../images/no_notifications.png')
                }
              />
            </TouchableOpacity>

            <ButtonCoins
              title={coinsStored}
              font={global.fontSelect}
              onPress={() => navigation.navigate('AddCoins')}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: global.tabColor,
            width: '93%',
            height: 60,
            alignSelf: 'center',
            borderRadius: 30,
            marginBottom: 20,
          }}>
          <TouchableOpacity
            onPress={() => SelectedBtnFN(1)}
            style={{width: '33%'}}>
            <View
              style={{
                height: 60,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <LinearGradient
                colors={[btncolor1_1, btncolor1_2]}
                style={{
                  height: 60,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  borderRadius: 30,
                }}>
                <Text style={{color: txtcolor1, fontFamily: global.fontSelect}}>
                  Tournament
                </Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => SelectedBtnFN(2)}
            style={{width: '34%'}}>
            <View
              style={{
                height: 60,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <LinearGradient
                colors={[btncolor2_1, btncolor2_2]}
                style={{
                  height: 60,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  borderRadius: 30,
                }}>
                <Text style={{color: txtcolor2, fontFamily: global.fontSelect}}>
                  Store
                </Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => SelectedBtnFN(3)}
            style={{width: '33%'}}>
            <View
              style={{
                height: 60,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <LinearGradient
                colors={[btncolor3_1, btncolor3_2]}
                style={{
                  height: 60,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  borderRadius: 30,
                }}>
                <Text style={{color: txtcolor3, fontFamily: global.fontSelect}}>
                  Judge
                </Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </View>

        {postNo == 1 ? <TounamentScreen /> : null}

        {postNo == 2 ? <Store /> : null}

        {postNo == 3 ? <JudgeScreen /> : null}
      </ScrollView>

      <Modal
        animationType=""
        transparent={true}
        presentationStyle="overFullScreen"
        visible={modalVisible}
        onRequestClose={() => {
          // alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{marginLeft: 'auto', marginTop: -25, marginRight: -23}}>
              <Image
                style={{height: 40, width: 40}}
                resizeMode="stretch"
                source={require('../../images/cross.png')}
              />
            </TouchableOpacity>

            <Text style={[styles.modalText, {fontFamily: global.fontSelect}]}>
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
          </View>
        </View>
      </Modal>

      <BottomNavBar
        onPress={index => activeTab(index)}
        themeIndex={ImageBottoms}
        navigation={navigation}
        navIndex={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    color: '#E6E6E6',
    marginBottom: 15,
  },

  tinyLogo: {
    width: 30,
    height: 30,
    marginTop: 10,
    marginRight: 10,
    tintColor: '#222222',
    alignSelf: 'flex-end',
  },

  Logo: {
    width: 350,
    height: 350,
    marginTop: 10,
    alignSelf: 'center',
  },
  topView: {
    width: '100%',
    height: 85,
    // backgroundColor: '#ffffff',
    paddingTop: 15,
    paddingLeft: 12,
    flexDirection: 'row',
  },

  image: {
    height: 380,
    width: '100%',
    resizeMode: 'stretch',
    // justifyContent: "center"
  },
  text: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000a0',
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
    color: 'black',
    fontWeight: '800',
    textAlign: 'center',
  },
  modalText: {
    marginTop: 0,
    marginBottom: 15,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // bottom tab design
  bottom: {
    backgroundColor: '#272727',
    flexDirection: 'row',
    height: 80,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  first: {
    // backgroundColor: '#ffffff',
    width: '17.5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forth: {
    // backgroundColor: '#ffffff',
    width: '22%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  third: {
    // backgroundColor: '#000000',
    width: '26%',
    justifyContent: 'center',
  },

  tinyLogo: {
    width: 30,
    height: 30,
  },
  tinyLogoOB: {
    width: 80,
    height: 80,
    // tintColor: '#000000'
    marginTop: -20,
  },
  tinyLogothird: {
    width: 60,
    height: 60,
    tintColor: '#FBC848',
    marginTop: -27,
  },
  touchstyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txticon: {
    color: '#FBC848',
    fontSize: 11,
  },
  ovalBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDD368',
    width: 65,
    height: 65,
    borderRadius: 40,
    marginTop: -40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    elevation: 16,
  },

  // modal CSS new post
  centeredViewNewPost: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '6%',
  },
  modalViewNewPost: {
    margin: 20,
    // borderColor: '#FBC848',
    // borderWidth: 1,
    backgroundColor: '#201E23',
    borderRadius: 15,
    padding: 20,
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
  modalViewImgPickerNewPost: {
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
  modalViewbioNewPost: {
    margin: 20,
    // borderColor: '#FBC848',
    // borderWidth: 1,
    backgroundColor: '#201E23',
    width: '70%',
    height: 270,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    justifyContent: 'space-evenly',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonNewPost: {
    borderRadius: 25,

    elevation: 2,
    marginRight: '1%',
    marginTop: '1%',
  },
  buttonOpenNewPost: {
    backgroundColor: '#FBC848',
    alignSelf: 'center',
  },
  buttonCloseNewPost: {
    backgroundColor: '#0B0213',
  },
  textStyleNewPost: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  modalTextNewPost: {
    marginBottom: 0,
    marginTop: 0,
    textAlign: 'center',
  },
});
