import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

var btnClr = global.btnColor;
const ButtonLarge = ({
  title,
  onPress,
  bgClrFirst,
  bgClrSecond,
  txtClr,
  font,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={{
        height: 50,
        width: '100%',
        marginTop: 15,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 22,
        elevation: 10,
      }}>
      <LinearGradient
        colors={[bgClrFirst, bgClrSecond]}
        style={{
          height: 50,
          width: '100%',
          justifyContent: 'center',
          alignSelf: 'center',
          borderRadius: 22,
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontFamily: font,
            fontSize: 16,
            color: txtClr,
            fontWeight: 'bold',
          }}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: '#FBC848',
    height: 50,
    width: '90%',
    marginTop: 15,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 22,
    elevation: 10,
  },
  buttonTitleStyle: {
    textAlign: 'center',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: global.btnTxt,
  },
});

export default ButtonLarge;
