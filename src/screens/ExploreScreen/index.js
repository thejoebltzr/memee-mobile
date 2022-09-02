import React, {useState, useEffect} from 'react';
// import { useState } from 'react';
import {
  View,
  Text,
  RefreshControl,
  TextInput,
  PermissionsAndroid,
  Modal,
  TouchableOpacity,
  BackHandler,
  MaskedViewIOS,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ImageBackground,
  ViewBase,
} from 'react-native';
import ButtonCoins from '../../component/ButtonCoins';
import {Avatar} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import TrendingPostExplore from '../TrendingPostExplore';
import SearchScreen from '../SearchScreen';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import BottomNavBar from '../../component/BottomNavBar';

var showScreen = false;
global.searchText = '';
export default function ExploreScreen(props) {
  const navigation = useNavigation();
  const {coinsStored, ImageBottoms, notifications} = useSelector(
    ({authRed}) => authRed,
  );

  const [searcTxt, setSearcTxt] = useState('');
  const [whichTabSt, setWhichTabSt] = useState({});
  const [dBottomFont, setdBottomFont] = useState(global.fontSelect);

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
    setWhichTabSt(global.WhichTab);
    setdBottomFont(global.fontSelect);
    const unsubscribe = navigation.addListener('focus', () => {
      setdBottomFont(global.fontSelect);
      setdBottomFont(global.fontSelect);

      //Screen Navigation
      global.TabButton = 2;
      showScreen = false;
      setSearcTxt('');
      setWhichTabSt(global.WhichTab);
    });
    return unsubscribe;
  }, [navigation]);
  function checkSearchTxtFN(text) {
    setSearcTxt(text);
    global.searchText = text;

    if (text == '') {
      showScreen = false;
    } else {
      showScreen = true;
      text = text.replace('#', '');
      searchFN(text);
    }
  }

  function searchFN(text) {
    fetch(global.address + 'SearchTop/' + text, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        /* console.log(' Searching .. ', responseJson); */

        global.responseTop = responseJson;
      })
      .catch(error => {
        console.error(error);
      });
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
      <ScrollView style={{marginBottom: 0}}>
        <View style={styles.topView}>
          <TouchableOpacity>
            <View style={{width: 145, height: 38}}>
              <Text
                style={{
                  fontFamily: global.fontSelect,
                  fontSize: 25,
                  color: global.colorIcon,
                  marginLeft: 10,
                  marginTop: 4,
                }}>
                Explore
              </Text>
            </View>
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

        <View
          style={{
            flexDirection: 'row',
            height: 55,
            width: '92%',
            backgroundColor: global.searchInputColor,
            alignSelf: 'center',
            borderRadius: 32,
          }}>
          <TouchableOpacity>
            <Image
              style={{height: 25, width: 25, marginTop: 15, marginLeft: 15, color: 'black'}}
              resizeMode="stretch"
              source={require('../../images/search.png')}
            />
          </TouchableOpacity>
          <TextInput
            style={{
              marginLeft: 5,
              color: global.searchInputTextColor,
              width: '78%',
              fontFamily: global.fontSelect,
            }}
            placeholder="Search hashtags, users"
            placeholderTextColor={global.searchInputPlaceholderTextColor}
            value={searcTxt}
            onChangeText={text => checkSearchTxtFN(text)}
            secureTextEntry={false}
          />
        </View>

        {showScreen == false ? (
          <TrendingPostExplore {...props} navigation={navigation} />
        ) : (
          <SearchScreen {...props} navigation={navigation} />
        )}
      </ScrollView>

      <BottomNavBar
        onPress={index => activeTab(index)}
        themeIndex={ImageBottoms}
        navigation={navigation}
        navIndex={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topView: {
    width: '100%',
    height: 85,
    paddingTop: 15,
    paddingLeft: 12,
    flexDirection: 'row',
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
