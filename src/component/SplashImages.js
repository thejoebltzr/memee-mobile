import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import React from 'react';

var randomNum = '';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SplashImages = () => {
  randomNum = Math.floor(Math.random() * 5 + 1);
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image
        source={
          randomNum == 1
            ? require('../images/Splash1.png')
            : randomNum == 2
            ? require('../images/Splash2.png')
            : randomNum == 3
            ? require('../images/Splash3.png')
            : randomNum == 4
            ? require('../images/Splash4.png')
            : require('../images/Splash5.png')
        }
        resizeMode="cover"
        style={{height: windowHeight, width: windowWidth, alignSelf: 'center'}}
      />
    </View>
  );
};

export default SplashImages;

const styles = StyleSheet.create({});
