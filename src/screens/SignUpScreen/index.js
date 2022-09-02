import React, {useState, useRef} from 'react';
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
import PickerComponent from '../../component/Picker';
import ButtonLargeIndicator from '../../component/ButtonLargeIndicator';
import Toast from 'react-native-toast-message';
import {isStrongPassword} from '../../Utility/Utils';

var emailLowerCase = '';

export default function SignUpScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordconfirm, setPasswordconfirm] = useState('');
  const [name, setName] = useState('');
  const [loader, setLoader] = useState(false);
  const [passwordShowHide, setPasswordShowHide] = useState(true);
  const [confirmPasswordShowHide, setConfirmPasswordShowHide] = useState(true);

  //New Codding because of OTP
  function validation() {
    setLoader(true);

    if (email == '') {
      setLoader(false);
      Toast.show({
        type: 'error',
        text2: 'Please enter your email!',
      });
    } else if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      setLoader(false);
      Toast.show({
        type: 'error',
        text2: 'Please enter a valid email!',
      });
    } else if (password == '') {
      setLoader(false);
      Toast.show({
        type: 'error',
        text2: 'Please enter a password!',
      });
    } else if (!isStrongPassword(password)) {
      setLoader(false);
      Toast.show({
        type: 'error',
        text2: 'Password is weak',
      });
    } else if (name == '') {
      setLoader(false);
      Toast.show({
        type: 'error',
        text2: 'Please enter your name!',
      });
    } else if (password != passwordconfirm) {
      setLoader(false);
      Toast.show({
        type: 'error',
        text2: 'Passwords do not match!',
      });
    } else {
      global.OtpData = [
        {
          full_name: name,
          email: email.toLowerCase().trim(),
          password: password.trim(),
        },
      ];

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

          if (responseJson.Status == 200) {
            navigation.navigate('VerifyEmail', {
              action: 'sign-up',
              email: email,
            });
          }
        })
        .catch(error => {
          Toast.show({
            type: 'error',
            text2: 'Please check your internet connection.',
          });
          setLoader(false);
          console.error(error);
        });
    }
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: '5%',
        paddingTop: '5%',
        backgroundColor: '#0B0213',
      }}>
      <ScrollView style={{padding: 10}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={styles.tinyLogo}
              source={require('../../images/back1.png')}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.title]}> Sign up</Text>
        <Text style={[styles.textTheme, {marginTop: 10, marginBottom: 30}]}>
          Let's create an account on memee to enjoy memes.
        </Text>

        <Text style={styles.textTheme}>YOUR FULL NAME</Text>
        <Input
          placeholder="Full Name"
          onChangeText={text => setName(text)}
          value={name}
          secureTextEntry={false}
        />

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
            {passwordShowHide == false ? (
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

        <Text style={styles.textTheme}>CONFIRM PASSWORD</Text>
        <View style={{flexDirection: 'row', marginLeft: '2%'}}>
          <View style={{width: '75%'}}>
            <Input
              placeholder="Password"
              onChangeText={text => setPasswordconfirm(text)}
              value={passwordconfirm}
              secureTextEntry={confirmPasswordShowHide}
            />
          </View>

          <View
            style={{
              width: '22%',
              marginLeft: '-4%',
              justifyContent: 'center',
              alignItems: 'flex-end',
              borderBottomColor: '#454545',
              borderBottomWidth: 1,
            }}>
            {confirmPasswordShowHide == false ? (
              <TouchableOpacity
                onPress={() =>
                  setConfirmPasswordShowHide(!confirmPasswordShowHide)
                }>
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
                onPress={() =>
                  setConfirmPasswordShowHide(!confirmPasswordShowHide)
                }>
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

        <View style={{marginTop: '10%'}}>
          {loader == false ? (
            <ButtonLarge
              title="Sign Up"
              onPress={() => validation()}
              bgClrFirst={global.btnColor1}
              bgClrSecond={global.btnColor2}
              txtClr={global.btnTxt}
              font={global.fontSelect}
            />
          ) : (
            <ButtonLargeIndicator
              title=""
              onPress={() => navigation.navigate('')}
              bgClrFirst={global.btnColor1}
              bgClrSecond={global.btnColor2}
              txtClr={global.btnTxt}
            />
          )}
        </View>

        <View
          style={{flexDirection: 'row', alignSelf: 'center', marginTop: 20}}>
          <Text style={styles.textTheme}>Already on memee?</Text>

          <Text
            style={[styles.txtdown2, {fontFamily: global.fontSelect}]}
            onPress={() => navigation.navigate('LoginScreen')}>
            Signin
          </Text>
        </View>

        <Text
          style={[
            styles.textTheme,
            {
              width: '80%',
              textAlign: 'center',
              alignSelf: 'center',
              marginTop: 10,
              marginBottom: 20,
            },
          ]}>
          By continuing you agree Memee’s Terms of Services & Privacy Policy.
        </Text>
      </ScrollView>
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
  textTheme: {
    color: '#707070',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 20,
    marginStart: 20,
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
    // marginBottom: '10%',
  },
  txtdown2: {
    color: '#FBC848',
    marginTop: '5%',
    alignSelf: 'center',
    // marginBottom: '10%',
    marginLeft: 10,
  },
  tinyLogo: {
    width: 30,
    height: 20,
    marginTop: 10,
    tintColor: '#ffffff',
  },
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
