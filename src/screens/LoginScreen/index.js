import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import Input from '../../component/InputField';
import ButtonLarge from '../../component/ButtonLarge';
import ButtonLargeIndicator from '../../component/ButtonLargeIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {coinsRecordFN} from '../../redux/actions/Auth';
import Toast from 'react-native-toast-message';
import {Settings} from 'react-native-fbsdk-next';
import {toggleOnlineStatus} from '../../redux/actions/Auth';

Settings.initializeSDK();
global.userData = [];
export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [indicatButton, setIndicatButton] = useState(false);
  const [passwordShowHide, setPasswordShowHide] = useState(true);

  const dispatch = useDispatch();

  function validation() {
    setIndicatButton(true);

    var emailLowerCase = email.toLowerCase().trim();

    if (email == '') {
      setIndicatButton(false);
      Toast.show({
        type: 'error',
        test1: 'Alert!',
        text2: 'Please enter a valid email',
      });
    } else if (password == '') {
      setIndicatButton(false);
      Toast.show({
        type: 'error',
        test1: 'Alert!',
        text2: 'Please enter a valid password',
      });
    } else {
      /* console.log(global.address + 'login'); */
      fetch(global.address + 'login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailLowerCase,
          password: password,
        }),
      })
        .then(response => response.json())
        .then(async responseJson => {
          setIndicatButton(false);
          if (responseJson.Status == 400) {
            Toast.show({
              type: 'error',
              text2: 'Invalid credentials.',
            });
          } else {
            await AsyncStorage.setItem('@userName', emailLowerCase);
            await AsyncStorage.setItem('@userPass', password);
            await AsyncStorage.setItem('@fullName', '');
            await AsyncStorage.setItem('@userDate', '');
            await AsyncStorage.setItem('@userImg', '');
            await AsyncStorage.setItem('@userLoginType', 'Email');

            /* console.log(
              'global.token = responseJson.Token',
              responseJson.Token,
            ); */

            global.token = responseJson.Token;

            loginData();
          }
        })
        .catch(error => {
          Toast.show({
            type: 'error',
            text2: 'Please check your internet connection.',
          });
          setIndicatButton(false);
          console.error(error);
        });
    }
  }

  function loginData() {
    console.log(
      global.address + 'getLoggedInUser',
      JSON.stringify({
        email: email,
        password: password,
      }),
    );
    fetch(global.address + 'getLoggedInUser', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson == 'Wrong number of segments') {
          Toast.show({
            type: 'error',
            text2: 'Internal Server Error',
          });
          return;
        }
        global.userData = responseJson;
        /* console.log('global.userData = responseJson;', responseJson); */
        dispatch(coinsRecordFN(global.userData.coins));
        toggleOnlineStatus('1');
        navigation.navigate('Dashboard');
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: '5%',
        paddingTop: '5%',
        backgroundColor: '#0B0213',
      }}>
      <ScrollView>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={styles.tinyLogo}
              source={require('../../images/back1.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.title}> Sign in</Text>
        </View>
        <Text style={[styles.textTheme, {marginTop: 10, marginBottom: 30}]}>
          Enter email and password to get signed in.
        </Text>

        <Text style={styles.textTheme}>YOUR EMAIL</Text>
        <Input
          placeholder="iammemee@memee.com"
          onChangeText={text => setEmail(text)}
          value={email}
          secureTextEntry={false}
        />

        <Text style={styles.textTheme}>YOUR PASSWORD</Text>
        <View style={{flexDirection: 'row', marginLeft: '2%'}}>
          <View style={{width: '75%'}}>
            <Input
              placeholder="Password"
              onChangeText={text => setPassword(text)}
              value={password}
              secureTextEntry={passwordShowHide}
            />
          </View>

          <View
            style={{
              width: '22%',
              justifyContent: 'center',
              alignItems: 'flex-end',
              marginLeft: '-4%',
              borderBottomColor: '#454545',
              borderBottomWidth: 1,
            }}>
            {!passwordShowHide ? (
              <TouchableOpacity
                onPress={() => setPasswordShowHide(!passwordShowHide)}>
                <Image
                  style={{
                    height: 24,
                    width: 25,
                    marginLeft: 0,
                    marginTop: 15,
                    tintColor: '#BABABA',
                  }}
                  resizeMode="stretch"
                  source={require('../../images/invisible.png')}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => setPasswordShowHide(!passwordShowHide)}>
                <Image
                  style={{
                    height: 24,
                    width: 25,
                    marginLeft: 0,
                    marginTop: 15,
                    tintColor: '#BABABA',
                  }}
                  resizeMode="stretch"
                  source={require('../../images/visible.png')}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
          <Text
            style={[
              styles.txtdown2,
              {
                marginLeft: 'auto',
                marginRight: 20,
                marginBottom: '2%',
                fontFamily: global.fontSelect,
              },
            ]}>
            Forgot password?
          </Text>
        </TouchableOpacity>
        {indicatButton == false ? (
          <ButtonLarge
            title="Sign in"
            onPress={() => validation()}
            bgClrFirst={global.btnColor1}
            bgClrSecond={global.btnColor2}
            txtClr={global.btnTxt}
            font={global.fontSelect}
          />
        ) : (
          <ButtonLargeIndicator
            title="Sign in"
            onPress={() => navigation.navigate('')}
            bgClrFirst={global.btnColor1}
            bgClrSecond={global.btnColor2}
            txtClr={global.btnTxt}
          />
        )}
      </ScrollView>
      <View style={{flexDirection: 'row', alignSelf: 'center'}}>
        <Text style={[styles.txtdown, {fontWeight: 'bold', color: '#707070'}]}>
          New to memee?
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('SignUpScreen')}
          style={{marginTop: '4%'}}>
          <Text style={[styles.txtdown2, {fontFamily: global.fontSelect}]}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.txtdown,
          {
            color: '#707070',
            fontWeight: 'bold',
            marginTop: -25,
            textAlign: 'center',
            width: '80%',
          },
        ]}>
        By continuing you agree Memee’s Terms of Services & Privacy Policy.{' '}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#E6E6E6',
    marginTop: 25,
    marginStart: 10,
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
    fontWeight: 'bold',
  },
  tinyLogo: {
    width: 30,
    height: 20,
    marginTop: 10,
    tintColor: '#ffffff',
  },

  textTheme: {
    color: '#707070',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 20,
    marginStart: 20,
  },
  button: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    elevation: 2,
    marginRight: '-72%',
    marginTop: '-11%',
  },
});
