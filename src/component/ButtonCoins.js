import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ButtonCoins = ({title, onPress, showAdd, font}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={styles.buttonStyle}>
      <LinearGradient
        colors={[global.addCoinsBtnColor1, global.addCoinsBtnColor2]}
        style={{
          height: 50,
          minWidth: 120,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          alignSelf: 'center',
          borderRadius: 22,
        }}>
        {showAdd == '1' ? null : (
          <View style={styles.addCircle}>
            <Text style={{fontSize: 17, marginTop: -3}}>+</Text>
          </View>
        )}
        <Text style={[styles.buttonTitleStyle, {fontFamily: font}]}>
          {title}
        </Text>
        <Image
          style={{height: 22, width: 22, marginRight: 10}}
          resizeMode="stretch"
          source={require('../images/Coin.png')}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: '#60E654',
    height: 50,
    minWidth: 120,
    marginTop: -20,
    marginRight: 13,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    borderRadius: 22,
    elevation: 10,
    flexDirection: 'row',
  },
  buttonTitleStyle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginLeft: 'auto',
    marginRight: 4,
    marginLeft: 4,
  },
  addCircle: {
    width: 22,
    height: 22,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});

export default ButtonCoins;
