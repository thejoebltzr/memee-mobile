import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import ButtonLarge from '../../component/ButtonLarge';
import ButtonLargeIndicator from '../../component/ButtonLargeIndicator';
import Toast from 'react-native-toast-message';
import Input from '../../component/InputField';

function ForgetPassword({navigation}) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  function getOTPToReset() {
    if (email.trim().length == 0) {
      Toast.show({
        type: 'error',
        text2: 'Please enter your email!',
      });
      return;
    } else if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      Toast.show({
        type: 'error',
        text2: 'Please enter a valid email!',
      });
      return;
    }

    let body = JSON.stringify({
      email: email.toLowerCase(),
      action: 'forget-password',
    });

    /* console.log(body) */

    setLoading(true);

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
        /* console.log(responseJson); */
        setLoading(false);

        if (responseJson.Status == 200) {
          navigation.navigate('VerifyEmail', {
            action: 'forget-password',
            email: email,
          });
          setLoading(false);
        } else {
          Toast.show({
            type: 'error',
            text2: responseJson.Message,
          });
          setLoading(false);
        }
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text2: 'Please check your internet connection.',
        });
        setLoading(false);
        console.log(error);
      });
  }

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
          Forgot Password
        </Text>
        <Text
          style={[
            styles.smallText,
            {fontFamily: global.fontSelect, color: '#C1C1C1'},
          ]}>
          You'll receive a 04 digit code to verify email.
        </Text>

        <Text style={styles.textTheme}>ENTER EMAIL</Text>
        <Input
          placeholder="iammemee@memee.com"
          onChangeText={text => setEmail(text)}
          value={email}
          secureTextEntry={false}
        />

        <View style={{height: 10}} />

        {loading == false ? (
          <ButtonLarge
            title="Continue"
            onPress={() => getOTPToReset()}
            bgClrFirst={global.btnColor1}
            bgClrSecond={global.btnColor2}
            txtClr={global.btnTxt}
          />
        ) : (
          <ButtonLargeIndicator
            title="Continue"
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

export default ForgetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0213',
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

  textTheme: {
    color: '#707070',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 50,
    marginStart: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '120%',
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
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
});
