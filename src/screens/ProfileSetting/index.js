import React, {useState, useEffect} from 'react';
// import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  Image,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {currentDateFN, asignImageToProductsFN} from '../../Utility/Utils';
import {useDispatch, useSelector} from 'react-redux';
import {storeIconsBottomTabFN} from '../../redux/actions/Auth';
import ThemeButton from '../../component/ThemeButton';

var windowWidth = Dimensions.get('window').width;
export default function ProfileSetting(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [btncolor1, setBtncolor1] = useState(global.btnColor1);
  const [btncolor2, setbtncolor2] = useState(global.btnColor2);
  const [btnText, setbtnText] = useState(global.btnText);
  const [btnTextColor, setbtnTextColor] = useState(global.btnTxt);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleBottom, setModalVisibleBottom] = useState(false);
  const [modalFontVisible, setFontModalVisible] = useState(false);

  const [selectFonts, setSelectFonts] = useState(global.fontSelect);

  const [profileTheme, setProfileTheme] = useState(global.themeData);
  const [profileBackground, setProfileBackground] = useState('');
  const [BackgroundOverLay, setBackgroundOverLay] = useState('');
  const [bottomTabicon, setBottomTabicon] = useState('');
  const [buttonPurchased, setButtonPurchased] = useState('');
  const [fontPurchased, setFontPurchased] = useState('');
  const [selectIcon, setSelectIcon] = useState(global.iconBottomSelected);

  useEffect(() => {
    purchaseIconGet();
  }, []);

  async function purchaseIconGet() {
    await fetch(
      global.address +
        'GetPurchasedItems/' +
        global.userData.user_id +
        '/' +
        global.userData.download_number,
      {
        method: 'get',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authToken: global.token,
        },
      },
    )
      .then(response => response.json())
      .then(async responseJson => {
        var proBackgrounVar = [];
        var ovverlayBackgrounVar = [];
        var iconsVar = [];
        var buttonsVar = [];
        var fontVar = [];

        for (let i = 0; i < responseJson.PurchasedItems.length; i++) {
          if (responseJson.PurchasedItems[i].type == 'profile_background') {
            var valueToPush = {};
            valueToPush['item_code'] = responseJson.PurchasedItems[i].item_code;
            valueToPush['datetime'] = responseJson.PurchasedItems[i].datetime;
            valueToPush['item_id'] = responseJson.PurchasedItems[i].item_id;
            valueToPush['purchase_id'] =
              responseJson.PurchasedItems[i].purchase_id;
            valueToPush['type'] = responseJson.PurchasedItems[i].type;
            if (
              global.itemCodeProfileBG ==
              responseJson.PurchasedItems[i].item_code
            ) {
              valueToPush['isSelected'] = true;
            } else {
              valueToPush['isSelected'] = false;
            }
            valueToPush['img'] = asignImageToProductsFN(
              responseJson.PurchasedItems[i].item_code,
              responseJson.PurchasedItems[i].type,
            );
            proBackgrounVar.push(valueToPush);
          }

          if (responseJson.PurchasedItems[i].type == 'background_overlay') {
            var valueToPush = {};
            valueToPush['item_code'] = responseJson.PurchasedItems[i].item_code;
            valueToPush['datetime'] = responseJson.PurchasedItems[i].datetime;
            valueToPush['item_id'] = responseJson.PurchasedItems[i].item_id;
            valueToPush['purchase_id'] =
              responseJson.PurchasedItems[i].purchase_id;
            valueToPush['type'] = responseJson.PurchasedItems[i].type;
            if (
              global.itemCodeOverLay == responseJson.PurchasedItems[i].item_code
            ) {
              valueToPush['isSelected'] = true;
            } else {
              valueToPush['isSelected'] = false;
            }
            valueToPush['img'] = asignImageToProductsFN(
              responseJson.PurchasedItems[i].item_code,
              responseJson.PurchasedItems[i].type,
            );
            ovverlayBackgrounVar.push(valueToPush);
          }

          if (responseJson.PurchasedItems[i].type == 'icon') {
            var valueToPush = {};
            valueToPush['item_code'] = responseJson.PurchasedItems[i].item_code;
            valueToPush['datetime'] = responseJson.PurchasedItems[i].datetime;
            valueToPush['item_id'] = responseJson.PurchasedItems[i].item_id;
            valueToPush['purchase_id'] =
              responseJson.PurchasedItems[i].purchase_id;
            valueToPush['type'] = responseJson.PurchasedItems[i].type;
            valueToPush['img'] = asignImageToProductsFN(
              responseJson.PurchasedItems[i].item_code,
              responseJson.PurchasedItems[i].type,
            )[0].imag;
            iconsVar.push(valueToPush);
          }

          if (responseJson.PurchasedItems[i].type == 'button') {
            var valueToPush = {};
            valueToPush['item_code'] = responseJson.PurchasedItems[i].item_code;
            valueToPush['datetime'] = responseJson.PurchasedItems[i].datetime;
            valueToPush['item_id'] = responseJson.PurchasedItems[i].item_id;
            valueToPush['purchase_id'] =
              responseJson.PurchasedItems[i].purchase_id;
            valueToPush['type'] = responseJson.PurchasedItems[i].type;
            valueToPush['img'] = asignImageToProductsFN(
              responseJson.PurchasedItems[i].item_code,
              responseJson.PurchasedItems[i].type,
            )[0].imag;
            buttonsVar.push(valueToPush);
          }

          if (responseJson.PurchasedItems[i].type == 'font') {
            /* console.log(responseJson.PurchasedItems[i]); */
            var valueToPush = {};
            valueToPush['item_code'] = responseJson.PurchasedItems[i].item_code;
            valueToPush['datetime'] = responseJson.PurchasedItems[i].datetime;
            valueToPush['item_id'] = responseJson.PurchasedItems[i].item_id;
            valueToPush['purchase_id'] =
              responseJson.PurchasedItems[i].purchase_id;
            valueToPush['type'] = responseJson.PurchasedItems[i].type;
            valueToPush['font'] = asignImageToProductsFN(
              responseJson.PurchasedItems[i].item_code,
              responseJson.PurchasedItems[i].type,
            )[0].font;
            fontVar.push(valueToPush);
          }
        }

        /* const freeThemes = [
          {
            datetime: undefined,
            img: require('../../images/roygbivTabBar.png'),
            item_code: 'free_icon_roygbiv_pink_1',
            item_id: 'free-icon-roygbivpink-1',
            purchase_id: undefined,
            type: 'icon',
          },
          {
            datetime: undefined,
            img: require('../../images/roygbivOrangeTabBar.png'),
            item_code: 'free_icon_roygbiv_orange_1',
            item_id: 'free-icon-roygbivorange-1',
            purchase_id: undefined,
            type: 'icon',
          },
          {
            datetime: undefined,
            img: require('../../images/theme2TabBar.png'),
            item_code: 'free_icon_theme_2',
            item_id: 'free-icon-theme-2',
            purchase_id: undefined,
            type: 'icon',
          },
          {
            datetime: undefined,
            img: require('../../images/theme3TabBar.png'),
            item_code: 'free_icon_theme_3',
            item_id: 'free-icon-theme-3',
            purchase_id: undefined,
            type: 'icon',
          },
          {
            datetime: undefined,
            img: require('../../images/theme4TabBar.png'),
            item_code: 'free_icon_theme_4',
            item_id: 'free-icon-theme-4',
            purchase_id: undefined,
            type: 'icon',
          },
          {
            datetime: undefined,
            img: require('../../images/theme1TabBar.png'),
            item_code: 'free_icon_theme_1',
            item_id: 'free-icon-theme-1',
            purchase_id: undefined,
            type: 'icon',
          },
        ];

        const freeButtons = [
          {
            item_code: 'free_button_roygbiv_pink_1',
            datetime: undefined,
            item_id: 'free-button-roygbivpink-1',
            purchase_id: undefined,
            type: 'button',
            img: require('../../images/genericButton.png'),
          },
          {
            item_code: 'free_button_roygbiv_orange_1',
            datetime: undefined,
            item_id: 'free-button-roygbivorange-1',
            purchase_id: undefined,
            type: 'button',
            img: require('../../images/genericButton.png'),
          },
          {
            item_code: 'free_button_theme_2',
            datetime: undefined,
            item_id: 'free-icon-theme-2',
            purchase_id: undefined,
            type: 'button',
            img: require('../../images/genericButton.png'),
          },
          {
            item_code: 'free_button_theme_3',
            datetime: undefined,
            item_id: 'free-icon-theme-3',
            purchase_id: undefined,
            type: 'button',
            img: require('../../images/genericButton.png'),
          },
          {
            item_code: 'free_button_theme_4',
            datetime: undefined,
            item_id: 'free-icon-theme-4',
            purchase_id: undefined,
            type: 'button',
            img: require('../../images/genericButton.png'),
          },
          {
            item_code: 'free_icon_theme_1',
            datetime: undefined,
            item_id: 'free-icon-theme-1',
            purchase_id: undefined,
            type: 'button',
            img: require('../../images/genericButton.png'),
          },
        ];

        const freeFonts = [
          {
            datetime: undefined,
            font: 'ProductSans-Bold',
            item_code: 'free_font_ProductSans',
            item_id: 'free_font_ProductSans',
            purchase_id: undefined,
            type: 'font',
          },
          {
            datetime: undefined,
            font: 'PTSans-Bold',
            item_code: 'free_font_PTSans',
            item_id: 'free_font_PTSans',
            purchase_id: undefined,
            type: 'font',
          },
          {
            datetime: undefined,
            font: 'Unna-Bold',
            item_code: 'free_font_Unna',
            item_id: 'free_font_Unna',
            purchase_id: undefined,
            type: 'font',
          },
        ];

        for (let index = 0; index < freeFonts.length; index++) {
          const freeFont = freeFonts[index];
          fontVar.push(freeFont);
        }

        for (let j = 0; j < freeButtons.length; j++) {
          const freeButton = freeButtons[j];
          buttonsVar.push(freeButton);
        }

        for (let index = 0; index < freeThemes.length; index++) {
          const freeTheme = freeThemes[index];
          iconsVar.push(freeTheme);
        } */

        //console.log('buttonsVar var', buttonsVar);

        setFontPurchased(fontVar);
        setButtonPurchased(buttonsVar);
        setBottomTabicon(iconsVar);
        setProfileBackground(proBackgrounVar);
        setBackgroundOverLay(ovverlayBackgrounVar);
      })
      .catch(error => {
        console.error(error);
      });
  }

  async function btnDesignFN(btnNo) {
    setModalVisible(false);

    if (buttonPurchased[btnNo].item_code == 'the_100_theme_button') {
      await AsyncStorage.setItem('@btnclr1', '#FFFFFF');
      await AsyncStorage.setItem('@btnclr2', '#FFFFFF');
      await AsyncStorage.setItem('@btntxtclr', '#000000');
      await AsyncStorage.setItem('@btntxt', 'Buttons');
      global.btnColor1 = '#FFFFFF';
      global.btnColor2 = '#FFFFFF';
      global.btnText = 'Buttons';
      setBtncolor1('#FFFFFF');
      setbtncolor2('#FFFFFF');
      setbtnText('Buttons');
      setbtnTextColor('#000000');
      global.btnTxt = '#000000';
    } else if (buttonPurchased[btnNo].item_code == 'save_earth_theme_button') {
      await AsyncStorage.setItem('@btnclr1', '#78AC6B');
      await AsyncStorage.setItem('@btnclr2', '#49843A');
      await AsyncStorage.setItem('@btntxtclr', '#ffffff');
      await AsyncStorage.setItem('@btntxt', 'Buttons');
      global.btnColor1 = '#78AC6B';
      global.btnColor2 = '#49843A';
      global.btnText = 'Buttons';
      setBtncolor1('#78AC6B');
      setbtncolor2('#49843A');
      setbtnText('Buttons');
      setbtnTextColor('#ffffff');
      global.btnTxt = '#ffffff';
    } else if (buttonPurchased[btnNo].item_code == 'memee_theme_white_button') {
      await AsyncStorage.setItem('@btnclr1', '#ffffff');
      await AsyncStorage.setItem('@btnclr2', '#ffffff');
      await AsyncStorage.setItem('@btntxtclr', '#000000');
      await AsyncStorage.setItem('@btntxt', 'Buttons');
      global.btnColor1 = '#ffffff';
      global.btnColor2 = '#ffffff';
      global.btnText = 'Buttons';
      setBtncolor1('#ffffff');
      setbtncolor2('#ffffff');
      setbtnText('Buttons');
      setbtnTextColor('#000000');
      global.btnTxt = '#000000';
    } else if (buttonPurchased[btnNo].item_code == 'unicorn_theme_button') {
      await AsyncStorage.setItem('@btnclr1', '#C83A6B');
      await AsyncStorage.setItem('@btnclr2', '#8D0E3A');
      await AsyncStorage.setItem('@btntxtclr', '#ffffff');
      await AsyncStorage.setItem('@btntxt', 'Buttons');
      global.btnColor1 = '#C83A6B';
      global.btnColor2 = '#8D0E3A';
      global.btnText = 'Buttons';
      setBtncolor1('#C83A6B');
      setbtncolor2('#8D0E3A');
      setbtnText('Buttons');
      setbtnTextColor('#ffffff');
      global.btnTxt = '#ffffff';
    } else if (buttonPurchased[btnNo].item_code == 'new_year_theme_button') {
      await AsyncStorage.setItem('@btnclr1', '#413781');
      await AsyncStorage.setItem('@btnclr2', '#413781');
      await AsyncStorage.setItem('@btntxtclr', '#ffffff');
      await AsyncStorage.setItem('@btntxt', 'Buttons');
      global.btnColor1 = '#413781';
      global.btnColor2 = '#413781';
      global.btnText = 'Buttons';
      setBtncolor1('#413781');
      setbtncolor2('#413781');
      setbtnText('Buttons');
      setbtnTextColor('#ffffff');
      global.btnTxt = '#ffffff';
    } else if (buttonPurchased[btnNo].item_code == 'space_theme_button') {
      await AsyncStorage.setItem('@btnclr1', '#5D33AD');
      await AsyncStorage.setItem('@btnclr2', '#171A59');
      await AsyncStorage.setItem('@btntxtclr', '#ffffff');
      await AsyncStorage.setItem('@btntxt', 'Buttons');
      global.btnColor1 = '#5D33AD';
      global.btnColor2 = '#171A59';
      global.btnText = 'Buttons';
      setBtncolor1('#5D33AD');
      setbtncolor2('#171A59');
      setbtnText('Buttons');
      setbtnTextColor('#ffffff');
      global.btnTxt = '#ffffff';
    } else if (
      buttonPurchased[btnNo].item_code == 'memee_theme_generic_button'
    ) {
      await AsyncStorage.setItem('@btnclr1', '#FFD524');
      await AsyncStorage.setItem('@btnclr2', '#ECB602');
      await AsyncStorage.setItem('@btntxtclr', '#000000');
      await AsyncStorage.setItem('@btntxt', 'Buttons');
      global.btnColor1 = '#FFD524';
      global.btnColor2 = '#ECB602';
      global.btnText = 'Buttons';
      setBtncolor1('#FFD524');
      setbtncolor2('#ECB602');
      setbtnText('Buttons');
      setbtnTextColor('#000000');
      global.btnTxt = '#000000';
    } else if (
      buttonPurchased[btnNo].item_code == 'free_button_roygbiv_pink_1'
    ) {
      await AsyncStorage.setItem('@btnclr1', '#EC6161');
      await AsyncStorage.setItem('@btnclr2', '#EC6161');
      await AsyncStorage.setItem('@btntxtclr', '#ffffff');
      await AsyncStorage.setItem('@btntxt', 'Buttons');
      global.btnColor1 = '#EC6161';
      global.btnColor2 = '#EC6161';
      global.btnText = 'Buttons';
      setBtncolor1('#EC6161');
      setbtncolor2('#EC6161');
      setbtnText('Buttons');
      setbtnTextColor('#ffffff');
      global.btnTxt = '#ffffff';
    } else if (
      buttonPurchased[btnNo].item_code == 'free_button_roygbiv_orange_1'
    ) {
      await AsyncStorage.setItem('@btnclr1', '#FF8C00');
      await AsyncStorage.setItem('@btnclr2', '#FF8C00');
      await AsyncStorage.setItem('@btntxtclr', '#000000');
      await AsyncStorage.setItem('@btntxt', 'Buttons');
      global.btnColor1 = '#FF8C00';
      global.btnColor2 = '#FF8C00';
      global.btnText = 'Buttons';
      setBtncolor1('#FF8C00');
      setbtncolor2('#FF8C00');
      setbtnText('Buttons');
      setbtnTextColor('#000000');
      global.btnTxt = '#000000';
    } else if (buttonPurchased[btnNo].item_code == 'free_button_theme_2') {
      await AsyncStorage.setItem('@btnclr1', '#1EDAAD');
      await AsyncStorage.setItem('@btnclr2', '#00AF85');
      await AsyncStorage.setItem('@btntxtclr', '#ffffff');
      await AsyncStorage.setItem('@btntxt', 'Buttons');
      global.btnColor1 = '#1EDAAD';
      global.btnColor2 = '#00AF85';
      global.btnText = 'Buttons';
      setBtncolor1('#1EDAAD');
      setbtncolor2('#00AF85');
      setbtnText('Buttons');
      setbtnTextColor('#ffffff');
      global.btnTxt = '#ffffff';
    } else if (buttonPurchased[btnNo].item_code == 'free_button_theme_3') {
      await AsyncStorage.setItem('@btnclr1', '#F23F58');
      await AsyncStorage.setItem('@btnclr2', '#D4233B');
      await AsyncStorage.setItem('@btntxtclr', '#ffffff');
      await AsyncStorage.setItem('@btntxt', 'Buttons');
      global.btnColor1 = '#F23F58';
      global.btnColor2 = '#D4233B';
      global.btnText = 'Buttons';
      setBtncolor1('#F23F58');
      setbtncolor2('#D4233B');
      setbtnText('Buttons');
      setbtnTextColor('#ffffff');
      global.btnTxt = '#ffffff';
    } else if (buttonPurchased[btnNo].item_code == 'free_button_theme_4') {
      await AsyncStorage.setItem('@btnclr1', '#FFF62A');
      await AsyncStorage.setItem('@btnclr2', '#FFF62A');
      await AsyncStorage.setItem('@btntxtclr', '#040216');
      await AsyncStorage.setItem('@btntxt', 'Buttons');
      global.btnColor1 = '#FFF62A';
      global.btnColor2 = '#FFF62A';
      global.btnText = 'Buttons';
      setBtncolor1('#FFF62A');
      setbtncolor2('#FFF62A');
      setbtnText('Buttons');
      setbtnTextColor('#040216');
      global.btnTxt = '#040216';
    } else if (buttonPurchased[btnNo].item_code == 'free_button_theme_1') {
      await AsyncStorage.setItem('@btnclr1', '#BE31FF');
      await AsyncStorage.setItem('@btnclr2', '#8900C9');
      await AsyncStorage.setItem('@btntxtclr', '#FFFFFF');
      await AsyncStorage.setItem('@btntxt', 'Buttons');
      global.btnColor1 = '#BE31FF';
      global.btnColor2 = '#8900C9';
      global.btnText = 'Buttons';
      setBtncolor1('#BE31FF');
      setbtncolor2('#8900C9');
      setbtnText('Buttons');
      setbtnTextColor('#FFFFFF');
      global.btnTxt = '#FFFFFF';
    }
  }

  async function profileBgFN(index) {
    for (let i = 0; i < profileBackground.length; i++) {
      if (index == i) {
        profileBackground[i].isSelected = true;
      } else {
        profileBackground[i].isSelected = false;
      }
    }
    setProfileBackground([...profileBackground]);

    global.itemCodeProfileBG = profileBackground[index].item_code;
    global.profileBGgl = asignImageToProductsFN(
      profileBackground[index].item_code,
      profileBackground[index].type,
    );
    await AsyncStorage.setItem(
      '@profileItemCode',
      profileBackground[index].item_code,
    );
    await AsyncStorage.setItem('@profileType', profileBackground[index].type);
  }

  async function OverlayFN(index) {
    for (let i = 0; i < BackgroundOverLay.length; i++) {
      if (index == i) {
        BackgroundOverLay[i].isSelected = true;
      } else {
        BackgroundOverLay[i].isSelected = false;
      }
    }
    setBackgroundOverLay([...BackgroundOverLay]);

    global.itemCodeOverLay = BackgroundOverLay[index].item_code;
    await AsyncStorage.setItem(
      '@overlayItemCodee',
      BackgroundOverLay[index].item_code,
    );
    if (
      BackgroundOverLay[index].item_code ==
      'memee_theme_white_background_overlay'
    ) {
      await AsyncStorage.setItem('@overlay1', '#492C5B88');
      // await AsyncStorage.setItem('@overlay2', "#4A0D3F33");
      await AsyncStorage.setItem('@overlay3', '#B9A4C633');
      global.overlay1 = '#492C5B88';
      // global.overlay2 = "#4A0D3F33";
      global.overlay3 = '#B9A4C633';
    } else if (
      BackgroundOverLay[index].item_code == 'the_100_theme_background_overlay'
    ) {
      await AsyncStorage.setItem('@overlay1', '#492C5B88');
      // await AsyncStorage.setItem('@overlay2', "#4A0D3F33");
      await AsyncStorage.setItem('@overlay3', '#B9A4C633');
      global.overlay1 = '#492C5B88';
      // global.overlay2 = "#4A0D3F33";
      global.overlay3 = '#B9A4C633';
    } else if (
      BackgroundOverLay[index].item_code == 'unicorn_theme_background_overlay'
    ) {
      await AsyncStorage.setItem('@overlay1', '#00000088');
      // await AsyncStorage.setItem('@overlay2', "#4A0D3F33");
      await AsyncStorage.setItem('@overlay3', '#00000088');
      global.overlay1 = '#00000088';
      // global.overlay2 = "#4A0D3F33";
      global.overlay3 = '#00000088';
    } else if (
      BackgroundOverLay[index].item_code == 'space_theme_backgroung_overlay'
    ) {
      await AsyncStorage.setItem('@overlay1', '#341A4988');
      // await AsyncStorage.setItem('@overlay2', "#4A0D3F33");
      await AsyncStorage.setItem('@overlay3', '#03010544');
      global.overlay1 = '#341A4988';
      // global.overlay2 = "#4A0D3F33";
      global.overlay3 = '#03010544';
    } else if (
      BackgroundOverLay[index].item_code ==
      'save_earth_theme_background_overlay'
    ) {
      await AsyncStorage.setItem('@overlay1', '#42877644');
      // await AsyncStorage.setItem('@overlay2', "#4A0D3F33");
      await AsyncStorage.setItem('@overlay3', '#2C595B88');
      global.overlay1 = '#42877644';
      // global.overlay2 = "#4A0D3F33";
      global.overlay3 = '#2C595B88';
    } else if (
      BackgroundOverLay[index].item_code ==
      'save_earth_theme_background_overlay'
    ) {
      await AsyncStorage.setItem('@overlay1', '#42877644');
      // await AsyncStorage.setItem('@overlay2', "#4A0D3F33");
      await AsyncStorage.setItem('@overlay3', '#2C595B88');
      global.overlay1 = '#42877644';
      // global.overlay2 = "#4A0D3F33";
      global.overlay3 = '#2C595B88';
    } else if (
      BackgroundOverLay[index].item_code == 'new_year_theme_background_overlay'
    ) {
      await AsyncStorage.setItem('@overlay1', '#492C5B88');
      // await AsyncStorage.setItem('@overlay2', "#4A0D3F33");
      await AsyncStorage.setItem('@overlay3', '#B9A4C622');
      global.overlay1 = '#492C5B88';
      // global.overlay2 = "#4A0D3F33";
      global.overlay3 = '#B9A4C622';
    }

    global.bgOverlay = BackgroundOverLay;
  }

  function bottomTabModelFN() {
    setModalVisibleBottom(true);
  }

  async function bottomTabColorChangeFN(index) {
    setSelectIcon(bottomTabicon[index].img);
    global.iconBottomSelected = bottomTabicon[index].img;
    await AsyncStorage.setItem(
      '@bottOmIconItemCode',
      bottomTabicon[index].item_code,
    );
    global.iconItemCode = bottomTabicon[index].item_code;

    if (bottomTabicon[index].item_code == 'space_theme_icon') {
      dispatch(storeIconsBottomTabFN(1));
      global.WhichTab = '1';
    } else if (bottomTabicon[index].item_code == 'unicorn_theme_icon') {
      dispatch(storeIconsBottomTabFN(2));
      global.WhichTab = '1';
    } else if (bottomTabicon[index].item_code == 'the_100_theme_icon') {
      dispatch(storeIconsBottomTabFN(3));
      await AsyncStorage.setItem('@btnclr1', '#FFFFFF');
      await AsyncStorage.setItem('@btnclr2', '#FFFFFF');
      await AsyncStorage.setItem('@btntxtclr', '#000000');
      await AsyncStorage.setItem('@btntxt', 'Buttons');
      global.btnColor1 = '#FFFFFF';
      global.btnColor2 = '#FFFFFF';
      global.btnText = 'Buttons';
      setBtncolor1('#FFFFFF');
      setbtncolor2('#FFFFFF');
      setbtnText('Buttons');
      setbtnTextColor('#000000');
      global.btnTxt = '#000000';
      global.WhichTab = '1';
    } else if (bottomTabicon[index].item_code == 'new_year_theme_icon') {
      dispatch(storeIconsBottomTabFN(4));
      global.WhichTab = '1';
    } else if (bottomTabicon[index].item_code == 'save_earth_theme_icon') {
      dispatch(storeIconsBottomTabFN(5));
      global.WhichTab = '1';
    } else if (bottomTabicon[index].item_code == 'memee_theme_white_icon') {
      dispatch(storeIconsBottomTabFN(6));
      global.WhichTab = '1';
    } else if (bottomTabicon[index].item_code == 'main_theme_icon') {
      dispatch(storeIconsBottomTabFN(7));
      global.WhichTab = '0';
    } else if (bottomTabicon[index].item_code == 'memee_theme_generic_icon') {
      dispatch(storeIconsBottomTabFN(8));
      await AsyncStorage.setItem('@btnclr1', '#FFD524');
      await AsyncStorage.setItem('@btnclr2', '#ECB602');
      await AsyncStorage.setItem('@btntxtclr', '#000000');
      await AsyncStorage.setItem('@btntxt', 'Buttons');
      global.btnColor1 = '#FFD524';
      global.btnColor2 = '#ECB602';
      global.btnText = 'Buttons';
      setBtncolor1('#FFD524');
      setbtncolor2('#ECB602');
      setbtnText('Buttons');
      setbtnTextColor('#000000');
      global.btnTxt = '#000000';
      global.WhichTab = '0';
    } else if (bottomTabicon[index].item_code == 'free_icon_roygbiv_pink_1') {
      dispatch(storeIconsBottomTabFN(9));
      await AsyncStorage.setItem('@btnclr1', '#EC6161');
      await AsyncStorage.setItem('@btnclr2', '#EC6161');
      await AsyncStorage.setItem('@btntxtclr', '#ffffff');
      await AsyncStorage.setItem('@btntxt', 'Buttons');
      global.btnColor1 = '#EC6161';
      global.btnColor2 = '#EC6161';
      global.btnText = 'Buttons';
      setBtncolor1('#EC6161');
      setbtncolor2('#EC6161');
      setbtnText('Buttons');
      setbtnTextColor('#ffffff');
      global.btnTxt = '#ffffff';
      global.WhichTab = '1';
    } else if (bottomTabicon[index].item_code == 'free_icon_roygbiv_orange_1') {
      dispatch(storeIconsBottomTabFN(10));
      await AsyncStorage.setItem('@btnclr1', '#FF8C00');
      await AsyncStorage.setItem('@btnclr2', '#FF8C00');
      await AsyncStorage.setItem('@btntxtclr', '#000000');
      await AsyncStorage.setItem('@btntxt', 'Buttons');
      global.btnColor1 = '#FF8C00';
      global.btnColor2 = '#FF8C00';
      global.btnText = 'Buttons';
      setBtncolor1('#FF8C00');
      setbtncolor2('#FF8C00');
      setbtnText('Buttons');
      setbtnTextColor('#000000');
      global.btnTxt = '#000000';
      global.WhichTab = '1';
    } else if (bottomTabicon[index].item_code == 'free_icon_theme_2') {
      dispatch(storeIconsBottomTabFN(11));
      await AsyncStorage.setItem('@btnclr1', '#1EDAAD');
      await AsyncStorage.setItem('@btnclr2', '#00AF85');
      await AsyncStorage.setItem('@btntxtclr', '#ffffff');
      await AsyncStorage.setItem('@btntxt', 'Buttons');
      global.btnColor1 = '#1EDAAD';
      global.btnColor2 = '#00AF85';
      global.btnText = 'Buttons';
      setBtncolor1('#1EDAAD');
      setbtncolor2('#00AF85');
      setbtnText('Buttons');
      setbtnTextColor('#ffffff');
      global.btnTxt = '#ffffff';
      global.WhichTab = '1';
    } else if (bottomTabicon[index].item_code == 'free_icon_theme_3') {
      dispatch(storeIconsBottomTabFN(12));
      await AsyncStorage.setItem('@btnclr1', '#F23F58');
      await AsyncStorage.setItem('@btnclr2', '#D4233B');
      await AsyncStorage.setItem('@btntxtclr', '#ffffff');
      await AsyncStorage.setItem('@btntxt', 'Buttons');
      global.btnColor1 = '#F23F58';
      global.btnColor2 = '#D4233B';
      global.btnText = 'Buttons';
      setBtncolor1('#F23F58');
      setbtncolor2('#D4233B');
      setbtnText('Buttons');
      setbtnTextColor('#ffffff');
      global.btnTxt = '#ffffff';
      global.WhichTab = '1';
    } else if (bottomTabicon[index].item_code == 'free_icon_theme_4') {
      dispatch(storeIconsBottomTabFN(13));
      await AsyncStorage.setItem('@btnclr1', '#FFF62A');
      await AsyncStorage.setItem('@btnclr2', '#FFF62A');
      await AsyncStorage.setItem('@btntxtclr', '#040216');
      await AsyncStorage.setItem('@btntxt', 'Buttons');
      global.btnColor1 = '#FFF62A';
      global.btnColor2 = '#FFF62A';
      global.btnText = 'Buttons';
      setBtncolor1('#FFF62A');
      setbtncolor2('#FFF62A');
      setbtnText('Buttons');
      setbtnTextColor('#040216');
      global.btnTxt = '#040216';
      global.WhichTab = '1';
    } else if (bottomTabicon[index].item_code == 'free_icon_theme_1') {
      dispatch(storeIconsBottomTabFN(14));
      await AsyncStorage.setItem('@btnclr1', '#BE31FF');
      await AsyncStorage.setItem('@btnclr2', '#8900C9');
      await AsyncStorage.setItem('@btntxtclr', '#FFFFFF');
      await AsyncStorage.setItem('@btntxt', 'Buttons');
      global.btnColor1 = '#BE31FF';
      global.btnColor2 = '#8900C9';
      global.btnText = 'Buttons';
      setBtncolor1('#BE31FF');
      setbtncolor2('#8900C9');
      setbtnText('Buttons');
      setbtnTextColor('#FFFFFF');
      global.btnTxt = '#FFFFFF';
      global.WhichTab = '1';
    } else {
      console.log('wronge item code');
    }
    setModalVisibleBottom(!modalVisibleBottom);
  }

  async function themeSelectFN(index) {
    for (let i = 0; i < profileTheme.length; i++) {
      if (index == i) {
        profileTheme[i].isSelected = true;
      } else {
        profileTheme[i].isSelected = false;
      }
    }
    setProfileTheme(prevMovies => [...profileTheme]);
    if (index == 0) {
      await AsyncStorage.setItem('@whichTheme', '0');
      bottomTabColorChangeFN(1);
      btnDesignFN(2);
      profileBgFN(6);

      global.CommentPostClr = '#FFCD2F';
    } else {
      await AsyncStorage.setItem('@whichTheme', '1');
      bottomTabColorChangeFN(3);
      btnDesignFN(4);
      profileBgFN(4);
      global.CommentPostClr = '#A378F6';
    }
  }

  async function selectFontFN(index) {
    if (fontPurchased[index].item_code == 'font1') {
      await AsyncStorage.setItem('@whichFontFam', 'Arial');
      global.fontSelect = 'Arial';
      setSelectFonts('Arial');
    } else if (fontPurchased[index].item_code == 'font2') {
      await AsyncStorage.setItem('@whichFontFam', 'DancingScript-Bold');
      global.fontSelect = 'DancingScript-Bold';
      setSelectFonts('DancingScript-Bold');
    } else if (fontPurchased[index].item_code == 'font3') {
      await AsyncStorage.setItem('@whichFontFam', 'Unkempt-Bold');
      global.fontSelect = 'Unkempt-Bold';
      setSelectFonts('Unkempt-Bold');
    } else if (fontPurchased[index].item_code == 'free_font_ProductSans') {
      await AsyncStorage.setItem('@whichFontFam', 'ProductSans-Bold');
      global.fontSelect = 'ProductSans-Bold';
      setSelectFonts('ProductSans-Bold');
    } else if (fontPurchased[index].item_code == 'free_font_PTSans') {
      await AsyncStorage.setItem('@whichFontFam', 'PTSans-Bold');
      global.fontSelect = 'PTSans-Bold';
      setSelectFonts('PTSans-Bold');
    } else if (fontPurchased[index].item_code == 'free_font_Unna') {
      await AsyncStorage.setItem('@whichFontFam', 'Unna-Bold');
      global.fontSelect = 'Unna-Bold';
      setSelectFonts('Unna-Bold');
    }
    setFontModalVisible(false);
  }

  return (
    <View
      style={{
        flex: 1,
        paddingLeft: '5%',
        paddingTop: '5%',
        backgroundColor: global.colorPrimary,
      }}>
      <ScrollView>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProfileScreen')}>
            <Image
              style={[styles.tinyLogo, {tintColor: global.colorIcon}]}
              source={require('../../images/back1.png')}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 25,
              color: global.colorIcon,
              marginBottom: 25,
              fontFamily: selectFonts,
            }}>
            {' '}
            Customize Profile
          </Text>
        </View>

        <Text
          style={{
            color: global.colorTextPrimary,
            marginLeft: 5,
            marginBottom: 10,
            marginTop: 10,
            fontFamily: selectFonts,
          }}>
          Profile Background
        </Text>

        <FlatList
          horizontal={true}
          data={profileBackground}
          renderItem={({item, index}) => (
            <View style={{marginLeft: 10}}>
              <TouchableOpacity onPress={() => profileBgFN(index)}>
                <ImageBackground
                  source={item.img}
                  style={{width: 120, height: 180}}
                  imageStyle={{borderRadius: 20}}
                  resizeMode="cover">
                  {item.isSelected == true ? (
                    <Image
                      style={{
                        width: 25,
                        height: 25,
                        marginTop: 6,
                        marginLeft: '4%',
                      }}
                      resizeMode="stretch"
                      source={require('../../images/GroupBlue.png')}
                    />
                  ) : null}

                  {item.img2 != '-1' ? (
                    <Image
                      style={{
                        width: 33,
                        height: 33,
                        marginTop: 19,
                        marginLeft: '19%',
                      }}
                      resizeMode="stretch"
                      source={item.img2}
                    />
                  ) : null}
                </ImageBackground>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id}
          style={{borderRadius: 100, marginTop: 3}}
        />

        <Text
          style={{
            color: global.colorTextPrimary,
            marginLeft: 5,
            marginBottom: 10,
            marginTop: 10,
            fontFamily: selectFonts,
          }}>
          Background Overlay
        </Text>

        <FlatList
          horizontal={true}
          data={BackgroundOverLay}
          renderItem={({item, index}) => (
            <View
              style={{
                marginLeft: 10,
                width: 110,
                height: 165,
                borderRadius: 25,
                backgroundColor: item.color,
              }}>
              <TouchableOpacity onPress={() => OverlayFN(index)}>
                <ImageBackground
                  source={item.img}
                  style={{width: 110, height: 165}}
                  resizeMode="stretch">
                  {item.isSelected == true ? (
                    <Image
                      style={{
                        width: 25,
                        height: 25,
                        marginTop: 10,
                        marginLeft: 10,
                      }}
                      resizeMode="stretch"
                      source={require('../../images/GroupBlue.png')}
                    />
                  ) : null}
                </ImageBackground>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id}
          style={{borderRadius: 100, marginTop: 3}}
        />

        <Text
          style={{
            color: global.colorTextPrimary,
            marginLeft: 5,
            marginTop: 15,
            fontFamily: selectFonts,
          }}>
          Icons
        </Text>

        <TouchableOpacity
          style={{alignSelf: 'center', height: 90, marginBottom: 9}}
          onPress={() => bottomTabModelFN()}>
          <ImageBackground
            source={selectIcon}
            style={{width: (windowWidth * 90) / 100, height: '100%'}}
            resizeMode="contain"></ImageBackground>
        </TouchableOpacity>

        <Text
          style={{
            color: global.colorTextPrimary,
            marginLeft: 5,
            marginBottom: 10,
            marginTop: 10,
            fontFamily: selectFonts,
          }}>
          Buttons
        </Text>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <LinearGradient
            colors={[btncolor1, btncolor2]}
            style={{
              width: '94%',
              height: 62,
              alignSelf: 'center',
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
              {btnText}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text
          style={{
            color: global.colorTextPrimary,
            marginLeft: 5,
            marginBottom: 10,
            marginTop: 10,
            fontFamily: selectFonts,
          }}>
          Fonts
        </Text>

        <TouchableOpacity
          style={{marginBottom: 15}}
          onPress={() => setFontModalVisible(true)}>
          <View
            style={{
              borderColor: '#4A4A4A',
              borderWidth: 1,
              borderRadius: 40,
              width: '94%',
              height: 62,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: global.colorTextPrimary,
                fontSize: 17,
                fontFamily: selectFonts,
              }}>
              I love memee app
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Button Modal start */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={[
                styles.modalText,
                {fontFamily: selectFonts, marginBottom: 15},
              ]}>
              Custom Buttons
            </Text>

            <FlatList
              data={buttonPurchased}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => btnDesignFN(index)}
                  style={{marginBottom: 15}}>
                  <ThemeButton item={item} selectFonts={selectFonts} />
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </Modal>

      {/* Button Modal End */}

      {/* font Modal start */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalFontVisible}
        onRequestClose={() => {
          setFontModalVisible(!modalFontVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.modalText, {fontFamily: selectFonts}]}>
              Custom Fonts
            </Text>

            <FlatList
              data={fontPurchased}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => selectFontFN(index)}
                  style={{
                    borderColor: '#4A4A4A',
                    borderWidth: 1,
                    borderRadius: 40,
                    marginTop: 20,
                    width: 210,
                    height: 62,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 17,
                      fontFamily: item.font,
                    }}>
                    I love memee app
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </Modal>

      {/* font Modal End */}

      {/* Bottom Tab Modal start */}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleBottom}
        onRequestClose={() => {
          setModalVisibleBottom(!modalVisibleBottom);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.modalText, {fontFamily: selectFonts}]}>
              Custom icons
            </Text>

            <FlatList
              data={bottomTabicon}
              renderItem={({item, index}) => (
                <TouchableOpacity onPress={() => bottomTabColorChangeFN(index)}>
                  <Image
                    source={item.img}
                    style={styles.buttomStyle}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </Modal>

      {/* Bottom Tab Modal End */}
    </View>
  );
}

const styles = StyleSheet.create({
  tinyLogo: {
    width: 30,
    height: 20,
    marginTop: 10,
    tintColor: '#ffffff',
  },
  title: {
    fontSize: 25,
    color: '#E6E6E6',
    marginBottom: 25,
  },
  bottom: {
    backgroundColor: '#960C3C',
    flexDirection: 'row',
    height: 35,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    marginTop: 'auto',
  },
  first: {
    // backgroundColor: '#ffffff',
    width: '17.5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchstyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  third: {
    // backgroundColor: '#000000',
    width: '26%',
    justifyContent: 'center',
  },
  ovalBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDD368',
    width: 25,
    height: 25,
    borderRadius: 40,
    marginTop: -35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    elevation: 16,
  },
  tinyLogoOB: {
    width: 10,
    height: 10,
    tintColor: '#000000',
  },
  forth: {
    // backgroundColor: '#ffffff',
    width: '22.5%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  centeredView: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30%',
    height: '65%',
  },
  modalView: {
    margin: 20,
    // borderColor: '#FBC848',
    // borderWidth: 1,

    backgroundColor: '#201E23',
    borderRadius: 15,
    minHeight: 100,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  modalText: {
    marginBottom: 0,
    marginTop: 5,
    textAlign: 'center',
    color: '#ffffff',
  },

  // Buttom Style
  buttomStyle: {
    height: 75,
    width: (windowWidth * 70) / 100,
    marginTop: 20,
    justifyContent: 'center',
    alignSelf: 'center',
  },

  // Buttons Style
  buttonStyle: {
    backgroundColor: '#FBC848',
    height: 50,
    width: 200,
    marginTop: 30,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 22,
    elevation: 10,
  },
  buttonTitleStyle: {
    textAlign: 'center',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#000000',
  },

  buttonStyle2: {
    backgroundColor: '#C12F62',
    height: 50,
    width: 200,
    marginTop: 30,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 22,
    elevation: 10,
  },
  buttonTitleStyle2: {
    textAlign: 'center',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#fff',
  },

  buttonStyle3: {
    // backgroundColor: '#AB0B13',
    height: 50,
    width: 200,
    marginTop: 30,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 22,
    elevation: 10,
  },
  buttonTitleStyle3: {
    textAlign: 'center',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#fff',
  },

  //modal Style

  buttonToast: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    elevation: 2,
    marginRight: '-72%',
    marginTop: '-11%',
  },
  buttonOpenToast: {
    backgroundColor: '#F194FF',
  },
  buttonCloseToast: {
    backgroundColor: '#0B0213',
  },
  textStyleToast: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
});
