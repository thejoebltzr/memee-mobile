import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import ButtonLarge from '../../component/ButtonLarge';
import ButtonLargeIndicator from '../../component/ButtonLargeIndicator';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {currentDateFN} from '../../Utility/Utils';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

function VerifyEmail({navigation, route}) {
  const [code, setcode] = useState('');
  const [loader, setLoader] = useState(false);
  const {action, email} = route.params;

  function verifyOTP() {
    setLoader(true);

    fetch(global.address + 'VerifyOTP', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        email: email,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        /* console.log(responseJson); */
        setLoader(false);

        if (responseJson.Status == 200) {
          if (action == 'sign-up') proceedSignUp();
          else if (action == 'forget-password')
            navigation.navigate('NewPassword', {email: email});
        } else {
          Toast.show({
            type: 'error',
            text2: 'Invalid OTP!',
          });
        }
      })
      .catch(error => {
        console.error(error);
        setLoader(false);
      });
  }

  function proceedSignUp() {
    let body = JSON.stringify({
      userName: global.OtpData[0].full_name,
      email: global.OtpData[0].email,
      userPassword: global.OtpData[0].password,
      userImage:
        'https://www.cognite.com/hubfs/raw_assets/public/tc_custom/images/unknown_user.jpg',
      loginType: 'Email',
    });

    /* console.log(body); */

    fetch(global.address + 'RegisterUser', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    })
      .then(response => response.json())
      .then(async responseJson => {
        setLoader(false);
        /* console.log(responseJson); */
        if (responseJson.Status == 201) {
          await AsyncStorage.setItem('@userName', global.OtpData[0].email);
          await AsyncStorage.setItem('@userPass', global.OtpData[0].password);
          await AsyncStorage.setItem('@fullName', '');
          await AsyncStorage.setItem('@userDate', '');
          await AsyncStorage.setItem('@userImg', '');
          await AsyncStorage.setItem('@userLoginType', 'Email');
          global.token = responseJson.Token;
          loginData();
        } else if (responseJson.Status == 200) {
          Toast.show({
            type: 'error',
            text2: 'This email is already registered.',
          });
        } else if (responseJson.Status == 409) {
          Toast.show({
            type: 'error',
            text2: responseJson.Message,
          });
        } else {
          Toast.show({
            type: 'error',
            text2: 'Something went wrong',
          });
        }
      })
      .catch(error => {
        console.error(error);
        setLoader(false);
      });
  }

  function loginData() {
    fetch(global.address + 'getLoggedInUser', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
      body: JSON.stringify({
        email: global.OtpData.email,
        password: global.OtpData.password,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        global.userData = responseJson;
        /* console.log('Sign Up Data...');
        console.log(global.userData); */
        setLoader(false);
        navigation.replace('Dashboard');
      })
      .catch(error => {
        console.error(error);
        setLoader(false);
      });
  }
  const resentOPT = () => {
    let body = JSON.stringify({
      email: email.toLowerCase().trim(),
      action: 'sign-up',
    });
    /* console.log(body); */

    fetch(global.address + 'SendOTP', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    })
      .then(response => response.json())
      .then(responseJson => {
        setLoader(false);
        /* console.log(responseJson); */
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text2: 'Please check your internet connection.',
        });
        setLoader(false);
        console.error(error);
      });
  };
  return (
    <View style={styles.container}>
      <ScrollView style={{padding: 10}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={styles.tinyLogo}
              source={require('../../images/back1.png')}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.headingText, {fontFamily: global.fontSelect}]}>
          Verify Email
        </Text>
        <Text
          style={[
            styles.smallText,
            {fontFamily: global.fontSelect, color: '#C1C1C1'},
          ]}>
          Code is sent to
          <Text
            style={[
              styles.smallText,
              {fontFamily: global.fontSelect, fontWeight: 'bold'},
            ]}>
            {' '}
            {email}{' '}
          </Text>
        </Text>

        <OTPInputView
          style={styles.otpInputSyle1}
          pinCount={4}
          keyboardType="phone-pad"
          // value = {code}
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeFilled={code => {
            setcode(code);
          }}
        />
        <Text
          style={[
            styles.smallText,
            {
              alignSelf: 'center',
              marginLeft: 0,
              marginTop: 0,
              fontFamily: global.fontSelect,
              color: '#C1C1C1',
            },
          ]}>
          Didn't receive code?
        </Text>
        <TouchableOpacity style={styles.resendButton} onPres={resentOPT}>
          <Text
            style={[
              styles.resendText,
              {
                fontFamily: global.fontSelect,
                color: '#FFFFFF',
                fontWeight: 'bold',
              },
            ]}>
            Resend OTP
          </Text>
        </TouchableOpacity>
        <View style={{height: 20}} />

        {loader == false ? (
          <ButtonLarge
            title="Verify Email"
            onPress={() => verifyOTP()}
            bgClrFirst={global.btnColor1}
            bgClrSecond={global.btnColor2}
            txtClr={global.btnTxt}
            font={global.fontSelect}
          />
        ) : (
          <ButtonLargeIndicator
            title="Verify Account"
            onPress={() => navigation.navigate('')}
            bgClrFirst={global.btnColor1}
            bgClrSecond={global.btnColor2}
            txtClr={global.btnTxt}
          />
        )}
      </ScrollView>
    </View>
  );
}

export default VerifyEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0213',
  },
  tinyLogo: {
    width: 30,
    height: 20,
    marginTop: 10,
    tintColor: '#ffffff',
  },
  headingText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#E6E6E6',
    fontFamily: 'Gilroy-Bold',
    marginLeft: '5%',
    marginTop: 30,
  },
  smallText: {
    fontSize: 14,
    color: '#E6E6E6',
    fontFamily: 'Gilroy-Regular',
    marginLeft: '5%',
    marginTop: 5,
  },
  otpInputSyle: {
    width: '80%',
    height: 50,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 25,
  },
  otpInputSyle1: {
    width: '80%',
    height: 50,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 25,
  },
  underlineStyleBase: {
    width: 55,
    height: 55,
    borderWidth: 0,
    borderWidth: 1,
    borderRadius: 13,
    borderColor: '#292929',
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'Gilroy-Regular',
    fontSize: 20,
    fontWeight: 'bold',
  },
  underlineStyleHighLighted: {
    borderColor: '#FFFFFF',
  },
  resendButton: {
    marginTop: 10,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  resendText: {
    fontSize: 14,
    color: '#FBC848',
    fontFamily: 'Gilroy-Regular',
    textDecorationLine: 'underline',
  },

  //modal Style

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
