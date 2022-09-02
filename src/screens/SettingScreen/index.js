import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {
  storeIconsBottomTabFN,
  toggleOnlineStatus,
} from '../../redux/actions/Auth';
import {
  CONVERSATIONS,
  NOTIFICATIONS,
  RECENT_SEARCHES,
  FOLLOW_REQUESTS,
} from '../../redux/constants';
import {ActivityIndicator} from 'react-native-paper';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export default function SettingScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);

  async function logOut() {
    setLoader(true);
    toggleOnlineStatus('0');

    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing app data.');
    }

    try {
      messaging()
        .unsubscribeFromTopic('notifyAll')
        .then(() => console.log('Unsubscribed fom the topic!'));
    } catch (exception) {
      return false;
    }

    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (e) {}

    await AsyncStorage.removeItem('@userName');
    await AsyncStorage.removeItem('@userPass');

    dispatch(storeIconsBottomTabFN(8));

    global.btnColor1 = '#FFE299';
    global.btnColor2 = '#F6B202';
    global.WhichTab = '0';
    global.btnTxt = '#000000';
    global.iconBottomSelected = require('../../images/Tabbar.png');
    global.profileBGgl = require('../../images/profileBG.png');

    dispatch({type: CONVERSATIONS, data: []});
    dispatch({type: NOTIFICATIONS, data: []});
    dispatch({type: RECENT_SEARCHES, data: []});
    dispatch({type: FOLLOW_REQUESTS, data: []});

    navigation.reset({
      index: 0,
      routes: [{name: 'Onboarding'}],
    });

    return true;
  }

  return (
    <View
      style={{
        flex: 1,
        paddingLeft: '5%',
        paddingTop: '5%',
        backgroundColor: global.colorPrimary,
      }}>
      <ScrollView>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProfileScreen')}>
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
            Settings
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfileScreen')}>
          <View
            style={{
              marginTop: 15,
              paddingBottom: 10,
              width: '100%',
              height: 70,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: '#868686',
              borderBottomWidth: 0.5,
            }}>
            <View
              style={{
                width: 50,
                height: 50,
                backgroundColor: global.colorSecondary,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{height: 25, width: 18, tintColor: global.colorIcon}}
                resizeMode="stretch"
                source={require('../../images/person.png')}
              />
            </View>

            <View style={{width: '65%', height: 60, marginLeft: 10}}>
              <Text
                style={{
                  color: global.colorTextPrimary,
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginTop: 4,
                  fontFamily: global.fontSelect,
                }}>
                {' '}
                Account Details
              </Text>
              <Text
                numberOfLines={2}
                ellipsizeMode="head"
                style={{
                  color: global.colorTextPrimary,
                  fontSize: 13,
                  marginTop: 2,
                  fontFamily: global.fontSelect,
                }}>
                {' '}
                {global.userData.name}
              </Text>
            </View>

            <View
              style={{
                width: '15%',
                height: 60,
                marginLeft: 'auto',
                flexDirection: 'row',
              }}>
              <Image
                style={{
                  height: 15,
                  width: 9,
                  tintColor: global.colorTextPrimary,
                  alignSelf: 'center',
                  marginLeft: '10%',
                }}
                resizeMode="stretch"
                source={require('../../images/farward.png')}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('SettingDetailNotification')}>
          <View
            style={{
              marginTop: 15,
              paddingBottom: 10,
              width: '100%',
              height: 70,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: '#868686',
              borderBottomWidth: 0.5,
            }}>
            <View
              style={{
                width: 50,
                height: 50,
                backgroundColor: global.colorSecondary,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{height: 25, width: 18, tintColor: global.colorIcon}}
                resizeMode="stretch"
                source={require('../../images/bellIcon.png')}
              />
            </View>

            <View style={{width: '65%', height: 60, marginLeft: 10}}>
              <Text
                style={{
                  color: global.colorTextPrimary,
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginTop: 4,
                  fontFamily: global.fontSelect,
                }}>
                {' '}
                Notifications
              </Text>
              <Text
                style={{
                  color: global.colorTextPrimary,
                  fontSize: 13,
                  marginTop: 2,
                  fontFamily: global.fontSelect,
                }}>
                {' '}
                Enable/Disable
              </Text>
            </View>

            <View
              style={{
                width: '15%',
                height: 60,
                marginLeft: 'auto',
                flexDirection: 'row',
              }}>
              <Image
                style={{
                  height: 15,
                  width: 9,
                  tintColor: global.colorTextPrimary,
                  alignSelf: 'center',
                  marginLeft: '10%',
                }}
                resizeMode="stretch"
                source={require('../../images/farward.png')}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('FAQScreen')}>
          <View
            style={{
              marginTop: 15,
              paddingBottom: 10,
              width: '100%',
              height: 70,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: '#868686',
              borderBottomWidth: 0.5,
            }}>
            <View
              style={{
                width: 50,
                height: 50,
                backgroundColor: global.colorSecondary,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{height: 27, width: 27, tintColor: global.colorIcon}}
                resizeMode="stretch"
                source={require('../../images/faq.png')}
              />
            </View>

            <View style={{width: '65%', height: 60, marginLeft: 10}}>
              <Text
                style={{
                  color: global.colorTextPrimary,
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginTop: 4,
                  fontFamily: global.fontSelect,
                }}>
                {' '}
                FAQs
              </Text>
              <Text
                style={{
                  color: global.colorTextPrimary,
                  fontSize: 13,
                  marginTop: 2,
                  fontFamily: global.fontSelect,
                }}>
                {' '}
                Frequently asked questions
              </Text>
            </View>

            <View
              style={{
                width: '15%',
                height: 60,
                marginLeft: 'auto',
                flexDirection: 'row',
              }}>
              <Image
                style={{
                  height: 15,
                  width: 9,
                  tintColor: global.colorTextPrimary,
                  alignSelf: 'center',
                  marginLeft: '10%',
                }}
                resizeMode="stretch"
                source={require('../../images/farward.png')}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => logOut()}>
          <View
            style={{
              marginTop: 15,
              paddingBottom: 10,
              width: '100%',
              height: 70,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: '#868686',
              borderBottomWidth: 0.5,
            }}>
            <View
              style={{
                width: 50,
                height: 50,
                backgroundColor: global.colorSecondary,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{height: 22, width: 20, tintColor: global.colorIcon}}
                resizeMode="stretch"
                source={require('../../images/logout.png')}
              />
            </View>

            <View style={{width: '65%', height: 60, marginLeft: 10}}>
              <Text
                style={{
                  color: global.colorTextPrimary,
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginTop: 4,
                  fontFamily: global.fontSelect,
                }}>
                {' '}
                Logout
              </Text>
              <Text
                style={{
                  color: global.colorTextPrimary,
                  fontSize: 13,
                  marginTop: 2,
                  fontFamily: global.fontSelect,
                }}>
                {' '}
                I will come back soon
              </Text>
            </View>

            <View
              style={{
                width: '15%',
                height: 60,
                marginLeft: 'auto',
                flexDirection: 'row',
              }}>
              {loader ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Image
                  style={{
                    height: 15,
                    width: 9,
                    tintColor: global.colorTextPrimary,
                    alignSelf: 'center',
                    marginLeft: '10%',
                  }}
                  resizeMode="stretch"
                  source={require('../../images/farward.png')}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tinyLogo: {
    width: 30,
    height: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 25,
    marginBottom: 25,
  },
});
