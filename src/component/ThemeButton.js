import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';

var windowWidth = Dimensions.get('window').width;

const ThemeButton = ({item, selectFonts}) => {
  const [gradient, setGradient] = useState(['white', 'white']);
  const [btnTextColor, setBtnTextColor] = useState('black');
  const [set, setSet] = useState(false);

  useEffect(() => {
    if (item && !set) {
      switch (item.item_code) {
        case 'the_100_theme_button':
          setGradient(['#FFFFFF', '#FFFFFF']);
          setBtnTextColor('#000000');
          setSet(true);
          break;
        case 'unicorn_theme_button':
          setGradient(['#C83A6B', '#8D0E3A']);
          setBtnTextColor('#ffffff');
          setSet(true);
          break;
        case 'new_year_theme_button':
          setGradient(['#413781', '#413781']);
          setBtnTextColor('#ffffff');
          setSet(true);
          break;
        case 'space_theme_button':
          setGradient(['#5D33AD', '#171A59']);
          setBtnTextColor('#ffffff');
          setSet(true);
          break;
        case 'memee_theme_generic_button':
          setGradient(['#FFD524', '#ECB602']);
          setBtnTextColor('#000000');
          setSet(true);
          break;
        case 'free_button_roygbiv_pink_1':
          setGradient(['#EC6161', '#EC6161']);
          setBtnTextColor('#ffffff');
          setSet(true);
          break;
        case 'free_button_roygbiv_orange_1':
          setGradient(['#FF8C00', '#FF8C00']);
          setBtnTextColor('#000000');
          setSet(true);
          break;
        case 'free_button_theme_2':
          setGradient(['#1EDAAD', '#00AF85']);
          setBtnTextColor('#ffffff');
          setSet(true);
          break;
        case 'free_button_theme_3':
          setGradient(['#F23F58', '#D4233B']);
          setBtnTextColor('#ffffff');
          setSet(true);
          break;
        case 'free_button_theme_4':
          setGradient(['#FFF62A', '#FFF62A']);
          setBtnTextColor('#040216');
          setSet(true);
          break;
        case 'free_button_theme_1':
          setGradient(['#BE31FF', '#8900C9']);
          setBtnTextColor('#FFFFFF');
          setSet(true);
          break;
        default:
          setSet(false);
      }
    }
  }, [gradient, btnTextColor]);
  return (
    <LinearGradient
      colors={[gradient[0], gradient[1]]}
      style={{
        width: windowWidth * 0.7,
        height: 62,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
      }}>
      <Text
        style={{
          color: btnTextColor,
          fontSize: 17,
          fontFamily: selectFonts,
        }}>
        {item.item_code.replace(/_/g, ' ')}
      </Text>
    </LinearGradient>
  );
};

export default ThemeButton;
