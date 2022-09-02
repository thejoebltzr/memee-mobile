import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  ToastAndroid,
  Modal,
  Dimensions,
  Pressable,
} from 'react-native';

var coins = '';
var windowWidth = Dimensions.get('window').width;
export default function CoinsConfirmation({navigation, route}) {
  const [coinsPurchased, setCoinsPurchased] = useState('');

  useEffect(() => {
    coins = route.params?.coins || 0;

    setCoinsPurchased(coins);
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: global.colorPrimary}}>
      <View style={{flexDirection: 'row', marginLeft: '4%', marginTop: 10}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={[styles.tinyLogo, {tintColor: global.colorIcon}]}
            source={require('../../images/back1.png')}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: global.colorPrimary,
        }}>
        <Image
          style={{
            width: (windowWidth * 98) / 100,
            height: (windowWidth * 160) / 100,
            marginTop: -(windowWidth * 60) / 100,
          }}
          source={require('../../images/Group46634.png')}
          resizeMode="stretch"
        />
        <Text
          style={{
            color: global.colorTextPrimary,
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: -(windowWidth * 40) / 100,
            marginBottom: 10,
          }}>
          Congratulations
        </Text>
        <Text
          style={{
            color: global.colorTextPrimary,
            opacity: 0.5,
            fontSize: 15,
            width: '80%',
            textAlign: 'center',
          }}>
          You have successfully purchased {coinsPurchased} Coins.
        </Text>
        n
      </View>
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
