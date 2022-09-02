import React, {useState} from 'react';
// import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ToastAndroid,
  Modal,
  Pressable,
} from 'react-native';
import Input from '../../component/InputField';
import ButtonLarge from '../../component/ButtonLarge';
import ButtonLargeIndicator from '../../component/ButtonLargeIndicator';
import Toast from 'react-native-toast-message';

export default function NewPassword({navigation, route}) {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [indicatButton, setIndicatButton] = useState(false);
  const [passwordShowHide, setPasswordShowHide] = useState(true);
  const [confirmPasswordShowHide, setConfirmPasswordShowHide] = useState(true);
  const {email} = route.params;

  function resetPassword() {
    setIndicatButton(true);

    if (password == '' || password2 == '') {
      setIndicatButton(false);
      Toast.show({
        type: 'error',
        text2: 'Please enter a password',
      });
    } else if (password == password2) {
      fetch(global.address + 'UpdatePassword', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          // 'authToken': global.token
        },
        body: JSON.stringify({
          password: password,
          email: email,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          setIndicatButton(false);
          if (responseJson.Status == 200) {
            navigation.navigate('LoginScreen');
            Toast.show({
              type: 'success',
              text2: 'Password reset successfully',
            });
          } else {
            /* console.log(responseJson); */
            Toast.show({
              type: 'error',
              text1: 'Something went wrong',
              text2: 'Try using a different password',
            });
          }
        })
        .catch(error => {
          setIndicatButton(false);
          console.error(error);
        });
    } else {
      setIndicatButton(false);
      Toast.show({
        type: 'error',
        text2: "Passwords don't match",
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
      <ScrollView>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={styles.tinyLogo}
              source={require('../../images/back1.png')}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.headingText, {fontFamily: global.fontSelect}]}>
          New Password
        </Text>

        <Text style={{fontFamily: global.fontSelect}}>
          Your new password must be different from previous used password
        </Text>

        <Text style={{color: '#fff', marginLeft: '5%'}}>NEW PASSWORD</Text>
        <View style={{flexDirection: 'row', marginLeft: '2%'}}>
          <View style={{width: '75%'}}>
            <Input
              placeholder="Password"
              onChangeText={text => setPassword2(text)}
              value={password2}
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

        <Text style={{color: '#fff', marginLeft: '5%', marginTop: 20}}>
          CONFIRM NEW PASSWORD
        </Text>
        <View style={{flexDirection: 'row', marginLeft: '2%'}}>
          <View style={{width: '75%'}}>
            <Input
              placeholder="Password"
              onChangeText={text => setPassword(text)}
              value={password}
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
            {!confirmPasswordShowHide ? (
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

        {indicatButton == false ? (
          <ButtonLarge
            title="Reset Password"
            onPress={() => resetPassword()}
            bgClrFirst={global.btnColor1}
            bgClrSecond={global.btnColor2}
            txtClr={global.btnTxt}
            font={global.fontSelect}
          />
        ) : (
          <ButtonLargeIndicator
            title="Reset Password"
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

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    color: '#E6E6E6',
    marginBottom: 25,
    marginTop: 25,
  },

  headingText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#E6E6E6',
    fontFamily: 'Gilroy-Bold',
    marginLeft: '5%',
    marginTop: 30,
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
