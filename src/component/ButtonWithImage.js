import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ButtonWithImage = ({
  img,
  title,
  onPress,
  bgClrFirst,
  bgClrSecond,
  txtClr,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={styles.buttonStyle}>
      <LinearGradient
        colors={[bgClrFirst, bgClrSecond]}
        style={styles.buttonContentContainer}>
        <Image style={styles.tinyLogo} source={img} />
        <Text
          style={{
            textAlign: 'left',
            fontFamily: 'OpenSans-SemiBold',
            fontSize: 16,
            paddingLeft: 5,
            color: txtClr,
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
    height: 65,
    width: '90%',
    marginTop: 30,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 32,
    elevation: 10,
    // flexDirection: 'row',
  },
  buttonTitleStyle: {
    textAlign: 'center',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#000000',
  },
  tinyLogo: {
    width: 30,
    height: 30,
    marginRight: '10%',
  },
  buttonContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: 65,
    borderRadius: 32,
    paddingLeft: '15%',
  },
});

export default ButtonWithImage;
