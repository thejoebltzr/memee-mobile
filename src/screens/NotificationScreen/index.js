import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  BackHandler,
  Image,
  ToastAndroid,
  Modal,
  Pressable,
} from 'react-native';
import ActivityNotification from '../ActivityNotification';
import LinearGradient from 'react-native-linear-gradient';
import Inbox from '../Inbox';

global.navigateNotification = -1;
var checkNavi = 0;

export default function NotificationScreen({navigation}) {
  const [btncolor1_1, setBtncolor1_1] = useState(global.btnColor1);
  const [btncolor1_2, setBtncolor1_2] = useState(global.btnColor2);
  const [txtcolor1, setTxtcolor1] = useState('#000000');

  const [btncolor2_1, setBtncolor2_1] = useState('#201E23');
  const [btncolor2_2, setBtncolor2_2] = useState('#201E23');
  const [txtcolor2, setTxtcolor2] = useState('#ABABAD');

  const [postNo, setPostNo] = useState('1');

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
    const unsubscribe = navigation.addListener('focus', () => {
      if (global.navigateNotification == -1) {
        checkNavi = 1;
      } else {
        checkNavi = global.navigateNotification;
      }
      SelectedBtnFN(checkNavi);
    });

    return unsubscribe;
  }, [navigation]);

  function SelectedBtnFN(btnNo) {
    global.navigateNotification = btnNo;
    setPostNo(btnNo);

    /* console.log("screen No...")
        console.log(postNo) */

    if (btnNo == 1) {
      setBtncolor1_1(global.btnColor1);
      setBtncolor1_2(global.btnColor2);

      setBtncolor2_1(global.tabNotSelectedColor);
      setBtncolor2_2(global.tabNotSelectedColor);

      setTxtcolor1(global.btnTxt);
      setTxtcolor2(global.tabNotSelectedTextColor);
    } else {
      setBtncolor1_1(global.tabNotSelectedColor);
      setBtncolor1_2(global.tabNotSelectedColor);

      setBtncolor2_1(global.btnColor1);
      setBtncolor2_2(global.btnColor2);

      setTxtcolor1(global.tabNotSelectedTextColor);
      setTxtcolor2(global.btnTxt);
    }
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
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
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
          Inbox
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: global.tabColor,
          width: '96%',
          height: 60,
          alignSelf: 'center',
          borderRadius: 30,
          marginBottom: 20,
        }}>
        <TouchableOpacity
          onPress={() => SelectedBtnFN(1)}
          style={{width: '50%'}}>
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
                Activity
              </Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => SelectedBtnFN(2)}
          style={{width: '50%'}}>
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
                Message
              </Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </View>
      {postNo == 1 ? <ActivityNotification /> : null}
      {postNo == 2 ? <Inbox /> : null}
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
});
