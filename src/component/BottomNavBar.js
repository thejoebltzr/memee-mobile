import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
  Platform,
  NativeModules,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  PESDK,
  PhotoEditorModal,
  Configuration,
} from 'react-native-photoeditorsdk';
import {
  requestCameraPermission,
  requestExternalWritePermission,
} from '../Utility/Utils';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

var windowWidth = Dimensions.get('window').width;

//Banuba Video Editor
const {VideoEditorModule} = NativeModules;

const openEditor = (): Promise<{videoUri: string} | null> => {
  return VideoEditorModule.openVideoEditor();
};

export const openVideoEditor = async (): Promise<string | null> => {
  const response = await openEditor();

  console.log('response', response);

  if (!response) {
    return null;
  }

  return response?.videoUri;
};

async function getAndroidExportResult() {
  return await VideoEditorModule.openVideoEditor();
}
//End Video Editor

const BottomNavBar = ({themeIndex, navIndex, onPress, navigation}) => {
  const [showImagePickerDialog, setShowImagePickerDialog] = useState(false);

  let options = {
    mediaType: 'photo',
    maxWidth: 512,
    maxHeight: 512,
    quality: 1,
  };

  let gradientColors = [];
  let icons = [];
  let iconsSelected = [];
  let centerIcon = null;
  let selectedColor = '';
  let unselectedColor = '';

  global.colorPrimary = '#0D0219';
  global.colorSecondary = '#292929';
  global.colorInput = '#292929';
  global.colorTextPrimary = '#C1C1C1';
  global.colorTextSecondary = '#FFFFFF';
  global.colorTextActive = '#FFCD2F';
  global.colorIcon = '#FFFFFF';
  global.gradientColors = ['#292929', '#292929'];

  if (themeIndex == 1) {
    gradientColors = ['#5D33AD', '#171A59'];

    icons.push(require('../images/earthBlue.png'));
    icons.push(require('../images/exploreBlue.png'));
    icons.push(require('../images/prizeBlue.png'));
    icons.push(require('../images/profileBlue.png'));

    iconsSelected = icons;
    centerIcon = require('../images/postBlue.png');

    selectedColor = '#BB77F0';
    unselectedColor = '#654E77';

    global.gradientColors = ['#5D33AD', '#171A59'];
  } else if (themeIndex == 2) {
    gradientColors = ['#C83A6B', '#8D0E3A'];

    icons.push(require('../images/UniconHome.png'));
    icons.push(require('../images/uniconExplor.png'));
    icons.push(require('../images/uniconCup.png'));
    icons.push(require('../images/Uniconprofile.png'));

    iconsSelected = icons;
    centerIcon = require('../images/uniconMain.png');

    selectedColor = '#FFC7DA';
    unselectedColor = '#EE6293';
  } else if (themeIndex == 3) {
    /* the_100_theme_icon */
    gradientColors = ['#FFD524', '#ECB602'];

    icons.push(require('../images/Home100.png'));
    icons.push(require('../images/earth100.png'));
    icons.push(require('../images/trophy100.png'));
    icons.push(require('../images/profile1000.png'));

    iconsSelected.push(require('../images/Homefilled.png'));
    iconsSelected.push(require('../images/globeFilled.png'));
    iconsSelected.push(require('../images/trophy100Filled.png'));
    iconsSelected.push(require('../images/person100.png'));

    centerIcon = require('../images/M100.png');

    selectedColor = '#000000';
    unselectedColor = '#FFFFFF';

    global.colorPrimary = '#ECB602';
    global.colorSecondary = '#FFDE7E';
    global.colorInput = '#FFFFFF';
    global.colorTextPrimary = '#292929';
    global.colorTextSecondary = '#FFFFFF';
    global.colorTextActive = '#FFFFFF';
    global.colorIcon = '#292929';
    global.gradientColors = ['#FFDE7E', '#FFDE7E'];

    // ! SET COLORS HERE FOR NEW THEMES ! //

    // tab color for dashboard `following | New Memes | Trending` || Tournament || Notification Inbox
    global.tabSelectedColor = '#EC6161';
    global.tabNotSelectedColor = '#201E23';
    global.tabColor = '#201E23';
    global.tabSelectedTextColor = '#FFFFFF';
    global.tabNotSelectedTextColor = '#B6B6B6';

    // add coins color (two colors because default is gradient with 2 colors)
    global.addCoinsBtnColor1 = '#73FF66';
    global.addCoinsBtnColor2 = '#19850F';

    // like, comment and share
    global.postInteractionsTextColor = '#000000';
    global.postInteractionsBG = require('../images/rectangle100theme.png');

    // inputs
    global.searchInputColor = '#FFFFFF';
    global.searchInputTextColor = '#959595';
    global.searchInputPlaceholderTextColor = '#959595';
    global.commentInputColor = '#000000';
    global.commentInputPlaceholderTextColor = '#9B9B9B';
    global.commentInputTextColor = '#FFFFFF';
    global.inputColor = '#000000';
    global.inputPlaceholderTextColor = '#9B9B9B';
    global.inputTextColor = '#FFFFFF';
    global.editProfileInputBorderBottom = '#FFFFFF';

    // trending tags in search color (gradient)
    global.selectedTagsColor1 = '#000000';
    global.selectedTagsColor2 = '#000000';
    global.notSelectedTagsColor1 = '#ECB602';
    global.notSelectedTagsColor2 = '#ECB602';
    global.selectedTagText = '#FFFFFF';
    global.notSelectedTagText = '#000000';
    global.tagsBorderColor = '#000000';

    // buttons
    global.followBtnBG1 = '#000000';
    global.followBtnBG2 = '#000000';
    global.followBtnTextColor = '#FFFFFF';
    global.confirmBtnBG1 = '#000000';
    global.confirmBtnBG2 = '#000000';
    global.confirmBtnTextColor = '#FFFFFF';
    global.declineButtonBG = '#FFDE7E';
    global.declineButtonTextColor = '#000000';

    // text button post text color (ex. post comment)
    global.postTextComment = '#FFFFFF';

    // explore (TOP SCREEN)
    global.resultsBorderBottomColor = '#ECB602';

    // notification inbox > activity tab
    global.activityBorderBottomColor = '#1B1B1B';
    global.followRequestCountBG = '#695CFF';
    global.followRequestCountTextColor = '#FFFFFF';

    // message tab
    global.messageBG = '#f4a8a4';

    // organize badges screen
    global.filterBtnColor = '#000000';
    global.earnedBadgesGradientColors = ['#FFDE7E', '#FFDE7E'];
    global.lockedBadgesBG = '#f4a8a4';
    global.lockedBadgesAboveTop2 = '#292929';
    global.lockedBadgesTitleColor = '#FFFFFF';
    global.lockedBadgesSubTitleColor = '#FFFFFF';
    global.lockedBadgesRarityColor = '#FFFFFF';
    global.lockedBadgesPointsColor = '#FFFFFF';
    global.filterSelectedBtn1 = '#000000';
    global.filterSelectedBtn2 = '#000000';
    global.filterNotSelectedBtn1 = '#ECB602';
    global.filterNotSelectedBtn3 = '#ECB602';
    global.filterSelectedText = '#FFFFFF';
    global.filterNotSelectedTagText = '#000000';
    global.filterTagsBorderColor = '#000000';

    // Edit Profile Screen
    global.editProfileBorderColor = '#FFF62A';
  } else if (themeIndex == 4) {
    /* new_year_theme_icon */
    gradientColors = ['#413781', '#413781'];

    icons.push(require('../images/NewYearHome.png'));
    icons.push(require('../images/newYearExplore.png'));
    icons.push(require('../images/newYearPriz.png'));
    icons.push(require('../images/newYearPerson.png'));

    iconsSelected = icons;
    centerIcon = require('../images/newYearMain.png');

    selectedColor = '#FFFFFF';
    unselectedColor = '#B1CCAA';
  } else if (themeIndex == 5) {
    /* save_earth_theme_icon */
    gradientColors = ['#78AC6B', '#49843A'];

    icons.push(require('../images/saveEarthHome.png'));
    icons.push(require('../images/saveEarthExplore.png'));
    icons.push(require('../images/saveEarthPrize.png'));
    icons.push(require('../images/saveEarthPerson.png'));

    iconsSelected = icons;
    centerIcon = require('../images/saveEarthMain.png');

    selectedColor = '#FFFFFF';
    unselectedColor = '#B1CCAA';
  } else if (themeIndex == 6) {
    /* memee_theme_white_icon */
    gradientColors = ['#FFFFFF', '#FFFFFF'];

    icons.push(require('../images/whitehomeWhiteTheme.png'));
    icons.push(require('../images/whiteexploreWhite.png'));
    icons.push(require('../images/whiteTournamentWhite.png'));
    icons.push(require('../images/whiteprofileWhite.png'));

    iconsSelected = icons;
    centerIcon = require('../images/whiteMainM.png');

    selectedColor = '#FFD03B';
    unselectedColor = '#000000';
  } else if (themeIndex == 9) {
    /* free roygbiv_pink_theme */
    gradientColors = ['#EC6161', '#EC6161'];

    global.cust_item_code = 'roygbiv-pink';

    icons.push(require('../images/roygbiv1Home.png'));
    icons.push(require('../images/roygbiv1Explore.png'));
    icons.push(require('../images/roygbiv1Tourna.png'));
    icons.push(require('../images/roygbiv1Profile.png'));

    iconsSelected.push(require('../images/mainHomFille.png'));
    iconsSelected.push(require('../images/roygbiv1GlobeFilled.png'));
    iconsSelected.push(require('../images/trophyFilledmain.png'));
    iconsSelected.push(require('../images/personMainFilled.png'));

    centerIcon = require('../images/mainM.png');

    selectedColor = '#FFCD2F';
    unselectedColor = '#FFFFFF';

    // setting colors from previous developer
    global.colorPrimary = '#EC8989';
    global.colorSecondary = '#f4a8a4';
    global.colorInput = '#FFFFFF';
    global.colorTextPrimary = '#FFFFFF';
    global.colorTextSecondary = '#FFFFFF';
    global.colorTextActive = '#FFFFFF';
    global.colorIcon = '#FFFFFF';
    global.gradientColors = ['#292929', '#292929'];

    // ! SET COLORS HERE FOR NEW THEMES ! //

    // tab color for dashboard `following | New Memes | Trending` || Tournament || Notification Inbox
    global.tabSelectedColor = '#EC6161';
    global.tabNotSelectedColor = '#f4a8a4';
    global.tabColor = '#f4a8a4';
    global.tabSelectedTextColor = '#FFFFFF';
    global.tabNotSelectedTextColor = '#FFFFFF';

    // add coins color (two colors because default is gradient with 2 colors)
    global.addCoinsBtnColor1 = '#EC6161';
    global.addCoinsBtnColor2 = '#EC6161';

    // like, comment and share
    global.postInteractionsTextColor = '#FFFFFF';
    global.postInteractionsBG = require('../images/roygbiv1Rectangle.png');

    // inputs
    global.searchInputColor = '#f4a8a4';
    global.searchInputTextColor = '#FFFFFF';
    global.searchInputPlaceholderTextColor = '#FFDFDF';
    global.commentInputColor = '#f4a8a4';
    global.commentInputPlaceholderTextColor = '#FFDFDF';
    global.commentInputTextColor = '#FFFFFF';
    global.inputColor = '#f4a8a4';
    global.inputPlaceholderTextColor = '#FFDFDF';
    global.inputTextColor = '#FFFFFF';
    global.editProfileInputBorderBottom = '#FFFFFF';

    // trending tags in search color (gradient)
    global.selectedTagsColor1 = '#EC6161';
    global.selectedTagsColor2 = '#EC6161';
    global.notSelectedTagsColor1 = '#f4a8a4';
    global.notSelectedTagsColor2 = '#f4a8a4';
    global.selectedTagText = '#FFFFFF';
    global.notSelectedTagText = '#FFFFFF';
    global.tagsBorderColor = '#FFFFFF';

    // text button post text color (ex. post comment)
    global.postTextComment = '#FFCD2F';

    // explore (TOP SCREEN)
    global.resultsBorderBottomColor = '#EC8989';

    // buttons
    global.followBtnBG1 = global.btnColor1;
    global.followBtnBG2 = global.btnColor2;
    global.followBtnTextColor = global.btnTxt;
    global.confirmBtnBG1 = global.btnColor1;
    global.confirmBtnBG2 = global.btnColor2;
    global.confirmBtnTextColor = global.btnTxt;
    global.declineButtonBG = '#000000';
    global.declineButtonTextColor = '#FFFFFF';

    // notification inbox > activity tab
    global.activityBorderBottomColor = '#FFFFFF';
    global.followRequestCountBG = '#FF0000';
    global.followRequestCountTextColor = '#FFFFFF';

    // message tab
    global.messageBG = '#f4a8a4';

    // organize badges screen
    global.filterBtnColor = '#EC6161';
    global.earnedBadgesGradientColors = ['#f4a8a4', '#f4a8a4'];
    global.lockedBadgesBG = '#f4a8a4';
    global.lockedBadgesAboveTop2 = '#292929';
    global.lockedBadgesTitleColor = '#FFFFFF';
    global.lockedBadgesSubTitleColor = '#FFFFFF';
    global.lockedBadgesRarityColor = '#FFFFFF';
    global.lockedBadgesPointsColor = '#FFFFFF';
    global.filterSelectedBtn1 = '#000000';
    global.filterSelectedBtn2 = '#000000';
    global.filterNotSelectedBtn1 = '#ECB602';
    global.filterNotSelectedBtn3 = '#ECB602';
    global.filterSelectedText = '#FFFFFF';
    global.filterNotSelectedTagText = '#000000';
    global.filterTagsBorderColor = '#000000';

    // Edit Profile Screen
    global.editProfileBorderColor = '#FFF62A';
  } else if (themeIndex == 10) {
    /* free roygbiv_pink_theme */
    gradientColors = ['#FF8C00', '#FF8C00'];

    global.cust_item_code = 'roygbiv-orange';

    icons.push(require('../images/roygbiv1Home.png'));
    icons.push(require('../images/roygbiv1Explore.png'));
    icons.push(require('../images/roygbiv1Tourna.png'));
    icons.push(require('../images/roygbiv1Profile.png'));

    iconsSelected.push(require('../images/mainHomFille.png'));
    iconsSelected.push(require('../images/roygbiv1GlobeFilled.png'));
    iconsSelected.push(require('../images/trophyFilledmain.png'));
    iconsSelected.push(require('../images/personMainFilled.png'));

    centerIcon = require('../images/mainM.png');

    selectedColor = '#FFCD2F';
    unselectedColor = '#FFFFFF';

    // setting colors from previous developer
    global.colorPrimary = '#F7A745';
    global.colorSecondary = 'rgba(255, 255, 255, 0.2)';
    global.colorInput = '#FFFFFF';
    global.colorTextPrimary = '#FFFFFF';
    global.colorTextSecondary = '#FFFFFF';
    global.colorTextActive = '#FFFFFF';
    global.colorIcon = '#FFFFFF';
    global.gradientColors = ['rgba(20, 19, 37, 1)', 'rgba(20, 19, 37, 1)'];

    // ! SET COLORS HERE FOR NEW THEMES ! //

    // tab color for dashboard `following | New Memes | Trending` || Tournament || Notification Inbox
    global.tabSelectedColor = '#FF8C00';
    global.tabNotSelectedColor = 'transparent';
    global.tabColor = 'rgba(255, 255, 255, 0.4)';
    global.tabSelectedTextColor = '#000000';
    global.tabNotSelectedTextColor = '#000000';

    // add coins color (two colors because default is gradient with 2 colors)
    global.addCoinsBtnColor1 = 'rgba(255, 140, 0, 1)';
    global.addCoinsBtnColor2 = 'rgba(255, 140, 0, 1)';

    // like, comment and share
    global.postInteractionsTextColor = '#FFFFFF';
    global.postInteractionsBG = require('../images/roygbivorangeRectangle.png');

    // inputs
    global.searchInputColor = 'rgba(255, 255, 255, 0.2)';
    global.searchInputTextColor = '#FFFFFF';
    global.searchInputPlaceholderTextColor = '#FFDFDF';
    global.commentInputColor = 'rgba(255, 255, 255, 0.2)';
    global.commentInputPlaceholderTextColor = '#FFFFFF';
    global.commentInputTextColor = '#FFFFFF';
    global.inputColor = 'rgba(255, 255, 255, 0.2)';
    global.inputPlaceholderTextColor = '#FFDFDF';
    global.inputTextColor = '#FFFFFF';
    global.editProfileInputBorderBottom = '#FFFFFF';

    // trending tags in search color (gradient)
    global.selectedTagsColor1 = 'rgba(255, 140, 0, 1)';
    global.selectedTagsColor2 = 'rgba(255, 140, 0, 1)';
    global.notSelectedTagsColor1 = 'transparent';
    global.notSelectedTagsColor2 = 'transparent';
    global.selectedTagText = '#FFFFFF';
    global.notSelectedTagText = '#FFFFFF';
    global.tagsBorderColor = '#FFFFFF';

    // text button post text color (ex. post comment)
    global.postTextComment = 'rgba(206, 100, 0, 1)';

    // explore (TOP SCREEN)
    global.resultsBorderBottomColor = 'transparent';

    // buttons
    global.followBtnBG1 = global.btnColor1;
    global.followBtnBG2 = global.btnColor2;
    global.followBtnTextColor = '#FFFFFF';
    global.confirmBtnBG1 = global.btnColor1;
    global.confirmBtnBG2 = global.btnColor2;
    global.confirmBtnTextColor = '#FFFFFF';
    global.declineButtonBG = '#000000';
    global.declineButtonTextColor = '#FFFFFF';

    // notification inbox > activity tab
    global.activityBorderBottomColor = '#FFFFFF';
    global.followRequestCountBG = '#FF0000';
    global.followRequestCountTextColor = '#FFFFFF';

    // message tab
    global.messageBG = '#f4a8a4';

    // organize badges screen
    global.filterBtnColor = 'rgba(255, 140, 0, 1)';
    global.earnedBadgesGradientColors = [
      'rgba(20, 19, 37, 1)',
      'rgba(20, 19, 37, 1)',
    ];
    global.lockedBadgesBG = '#f4a8a4';
    global.lockedBadgesAboveTop2 = '#292929';
    global.lockedBadgesTitleColor = '#FFFFFF';
    global.lockedBadgesSubTitleColor = '#FFFFFF';
    global.lockedBadgesRarityColor = '#FFFFFF';
    global.lockedBadgesPointsColor = '#FFFFFF';
    global.filterSelectedBtn1 = '#000000';
    global.filterSelectedBtn2 = '#000000';
    global.filterNotSelectedBtn1 = '#ECB602';
    global.filterNotSelectedBtn3 = '#ECB602';
    global.filterSelectedText = '#FFFFFF';
    global.filterNotSelectedTagText = '#000000';
    global.filterTagsBorderColor = '#000000';

    // Edit Profile Screen
    global.editProfileBorderColor = '#FFF62A';
  } else if (themeIndex == 11) {
    /* free theme2 */
    gradientColors = ['#1EDAAD', '#00AF85'];

    global.cust_item_code = 'theme-2';

    icons.push(require('../images/theme2Home.png'));
    icons.push(require('../images/theme2Explore.png'));
    icons.push(require('../images/theme2Tournament.png'));
    icons.push(require('../images/theme2Profile.png'));

    iconsSelected.push(require('../images/theme2Home.png'));
    iconsSelected.push(require('../images/theme2Explore.png'));
    iconsSelected.push(require('../images/theme2Tournament.png'));
    iconsSelected.push(require('../images/theme2Profile.png'));

    centerIcon = require('../images/whiteMainM.png');

    selectedColor = '#FFCD2F';
    unselectedColor = '#FFFFFF';

    // setting colors from previous developer
    global.colorPrimary = '#003528';
    global.colorSecondary = '#0E5241';
    global.colorInput = '#FFFFFF';
    global.colorTextPrimary = '#FFFFFF';
    global.colorTextSecondary = '#FFFFFF';
    global.colorTextActive = '#FFFFFF';
    global.colorIcon = '#FFFFFF';
    global.gradientColors = ['#064233', '#064233'];

    // ! SET COLORS HERE FOR NEW THEMES ! //

    // tab color for dashboard `following | New Memes | Trending` || Tournament || Notification Inbox
    global.tabSelectedColor = '#1EDAAD';
    global.tabNotSelectedColor = '#064233';
    global.tabColor = '#064233';
    global.tabSelectedTextColor = '#FFFFFF';
    global.tabNotSelectedTextColor = '#B6B6B6';

    // add coins color (two colors because default is gradient with 2 colors)
    global.addCoinsBtnColor1 = '#1EDAAD';
    global.addCoinsBtnColor2 = '#00AF85';

    // like, comment and share
    global.postInteractionsTextColor = '#FFFFFF';
    global.postInteractionsBG = require('../images/theme2Rectangle.png');

    // inputs
    global.searchInputColor = '#FFFFFF';
    global.searchInputTextColor = '#565656';
    global.searchInputPlaceholderTextColor = '#9B9B9B';
    global.commentInputColor = '#FFFFFF';
    global.commentInputPlaceholderTextColor = '#9B9B9B';
    global.commentInputTextColor = '#565656';
    global.inputColor = '#FFFFFF';
    global.inputPlaceholderTextColor = '#9B9B9B';
    global.inputTextColor = '#565656';
    global.editProfileInputBorderBottom = '#064233';

    // trending tags in search color (gradient)
    global.selectedTagsColor1 = '#1EDAAD';
    global.selectedTagsColor2 = '#00AF85';
    global.notSelectedTagsColor1 = '#064233';
    global.notSelectedTagsColor2 = '#064233';
    global.selectedTagText = '#FFFFFF';
    global.notSelectedTagText = '#FFFFFF';
    global.tagsBorderColor = '#064233';

    // text button post text color (ex. post comment)
    global.postTextComment = '#08BA8F';

    // explore (TOP SCREEN) // not changed
    global.resultsBorderBottomColor = '#EC8989';

    // buttons
    global.followBtnBG1 = global.btnColor1;
    global.followBtnBG2 = global.btnColor2;
    global.followBtnTextColor = global.btnTxt;
    global.confirmBtnBG1 = global.btnColor1;
    global.confirmBtnBG2 = global.btnColor2;
    global.confirmBtnTextColor = global.btnTxt;
    global.declineButtonBG = '#000000';
    global.declineButtonTextColor = '#FFFFFF';

    // notification inbox > activity tab
    global.activityBorderBottomColor = '#FFFFFF';
    global.followRequestCountBG = '#FF0000';
    global.followRequestCountTextColor = '#FFFFFF';

    // message tab // not changed
    global.messageBG = '#f4a8a4';

    // organize badges screen
    global.filterBtnColor = '#02B288';
    global.earnedBadgesGradientColors = ['#064233', '#064233'];
    global.lockedBadgesBG = '#064233';
    global.lockedBadgesAboveTop2 = 'rgba(255, 255, 255, 0.1)';
    global.lockedBadgesTitleColor = '#FFFFFF';
    global.lockedBadgesSubTitleColor = '#FFFFFF';
    global.lockedBadgesRarityColor = '#FFFFFF';
    global.lockedBadgesPointsColor = '#FFFFFF';
    global.filterSelectedBtn1 = '#000000';
    global.filterSelectedBtn2 = '#000000';
    global.filterNotSelectedBtn1 = '#ECB602'; // not
    global.filterNotSelectedBtn3 = '#ECB602'; // not
    global.filterSelectedText = '#FFFFFF';
    global.filterNotSelectedTagText = '#9B9B9B';
    global.filterTagsBorderColor = '#000000'; // not

    // Edit Profile Screen
    global.editProfileBorderColor = '#02B288';
  } else if (themeIndex == 12) {
    /* free theme3 */
    gradientColors = ['#F23F58', '#D4233B'];

    global.cust_item_code = 'theme-3';

    icons.push(require('../images/theme3Home.png'));
    icons.push(require('../images/theme3Explore.png'));
    icons.push(require('../images/theme3Tournament.png'));
    icons.push(require('../images/theme3Profile.png'));

    iconsSelected.push(require('../images/theme3Home.png'));
    iconsSelected.push(require('../images/theme3Explore.png'));
    iconsSelected.push(require('../images/theme3Tournament.png'));
    iconsSelected.push(require('../images/theme3Profile.png'));

    centerIcon = require('../images/theme3MainM.png');

    selectedColor = '#FFCD2F';
    unselectedColor = '#FFFFFF';

    // setting colors from previous developer
    global.colorPrimary = '#310209';
    global.colorSecondary = '#5A1E25';
    global.colorInput = '#FFFFFF';
    global.colorTextPrimary = '#FFFFFF';
    global.colorTextSecondary = '#FFFFFF';
    global.colorTextActive = '#FFFFFF';
    global.colorIcon = '#FFFFFF';
    global.gradientColors = ['#F23F58', '#D4233B'];

    // ! SET COLORS HERE FOR NEW THEMES ! //

    // tab color for dashboard `following | New Memes | Trending` || Tournament || Notification Inbox
    global.tabSelectedColor = '#F23F58';
    global.tabNotSelectedColor = '#41191E';
    global.tabColor = '#41191E';
    global.tabSelectedTextColor = '#FFFFFF';
    global.tabNotSelectedTextColor = '#B6B6B6';

    // add coins color (two colors because default is gradient with 2 colors)
    global.addCoinsBtnColor1 = '#F23F58';
    global.addCoinsBtnColor2 = '#D4233B';

    // like, comment and share
    global.postInteractionsTextColor = '#FFFFFF';
    global.postInteractionsBG = require('../images/theme3Rectangle.png');

    // inputs
    global.searchInputColor = '#FFFFFF';
    global.searchInputTextColor = '#565656';
    global.searchInputPlaceholderTextColor = '#9B9B9B';
    global.commentInputColor = '#FFFFFF';
    global.commentInputPlaceholderTextColor = '#9B9B9B';
    global.commentInputTextColor = '#565656';
    global.inputColor = '#FFFFFF';
    global.inputPlaceholderTextColor = '#9B9B9B';
    global.inputTextColor = '#565656';
    global.editProfileInputBorderBottom = '#EB3851';

    // trending tags in search color (gradient)
    global.selectedTagsColor1 = '#F23F58';
    global.selectedTagsColor2 = '#D4233B';
    global.notSelectedTagsColor1 = '#41191E';
    global.notSelectedTagsColor2 = '#41191E';
    global.selectedTagText = '#FFFFFF';
    global.notSelectedTagText = '#FFFFFF';
    global.tagsBorderColor = '#41191E';

    // text button post text color (ex. post comment)
    global.postTextComment = '#08BA8F';

    // explore (TOP SCREEN) // not changed
    global.resultsBorderBottomColor = '#EC8989';

    // buttons
    global.followBtnBG1 = global.btnColor1;
    global.followBtnBG2 = global.btnColor2;
    global.followBtnTextColor = global.btnTxt;
    global.confirmBtnBG1 = global.btnColor1;
    global.confirmBtnBG2 = global.btnColor2;
    global.confirmBtnTextColor = global.btnTxt;
    global.declineButtonBG = '#000000';
    global.declineButtonTextColor = '#FFFFFF';

    // notification inbox > activity tab
    global.activityBorderBottomColor = '#FFFFFF';
    global.followRequestCountBG = '#FF0000';
    global.followRequestCountTextColor = '#FFFFFF';

    // message tab // not changed
    global.messageBG = '#f4a8a4';

    // organize badges screen
    global.filterBtnColor = '#EB3851';
    global.earnedBadgesGradientColors = ['#41191E', '#41191E'];
    global.lockedBadgesBG = '#41191E';
    global.lockedBadgesAboveTop2 = 'rgba(255, 255, 255, 0.1)';
    global.lockedBadgesTitleColor = '#FFFFFF';
    global.lockedBadgesSubTitleColor = '#FFFFFF';
    global.lockedBadgesRarityColor = '#FFFFFF';
    global.lockedBadgesPointsColor = '#FFFFFF';
    global.filterSelectedBtn1 = '#000000';
    global.filterSelectedBtn2 = '#000000';
    global.filterNotSelectedBtn1 = '#ECB602'; // not
    global.filterNotSelectedBtn3 = '#ECB602'; // not
    global.filterSelectedText = '#FFFFFF';
    global.filterNotSelectedTagText = '#9B9B9B';
    global.filterTagsBorderColor = '#000000'; // not

    // Edit Profile Screen
    global.editProfileBorderColor = '#EB3851';
  } else if (themeIndex == 13) {
    /* free theme3 */
    gradientColors = ['#1B1C25', '#1B1C25'];

    global.cust_item_code = 'theme-4';

    icons.push(require('../images/mainHomFille.png'));
    icons.push(require('../images/globeMainfilled.png'));
    icons.push(require('../images/trophyFilledmain.png'));
    icons.push(require('../images/personMainFilled.png'));

    iconsSelected.push(require('../images/mainHomFille.png'));
    iconsSelected.push(require('../images/globeMainfilled.png'));
    iconsSelected.push(require('../images/trophyFilledmain.png'));
    iconsSelected.push(require('../images/personMainFilled.png'));

    centerIcon = require('../images/theme4MainM.png');

    selectedColor = '#FFCD2F';
    unselectedColor = '#FFFFFF';

    // setting colors from previous developer
    global.colorPrimary = '#040216';
    global.colorSecondary = '#1B1C25';
    global.colorInput = '#FFFFFF';
    global.colorTextPrimary = '#FFFFFF';
    global.colorTextSecondary = '#FFFFFF';
    global.colorTextActive = '#FFFFFF';
    global.colorIcon = '#FFFFFF';
    global.gradientColors = ['#FFF62A', '#FFF62A'];

    // ! SET COLORS HERE FOR NEW THEMES ! //

    // tab color for dashboard `following | New Memes | Trending` || Tournament || Notification Inbox
    global.tabSelectedColor = '#FFF62A';
    global.tabNotSelectedColor = '#2B2A47';
    global.tabColor = '#2B2A47';
    global.tabSelectedTextColor = '#040216';
    global.tabNotSelectedTextColor = '#B6B6B6';

    // add coins color (two colors because default is gradient with 2 colors)
    global.addCoinsBtnColor1 = '#FFF62A';
    global.addCoinsBtnColor2 = '#FFF62A';

    // like, comment and share
    global.postInteractionsTextColor = '#FFFFFF';
    global.postInteractionsBG = require('../images/theme4Rectangle.png');

    // inputs
    global.searchInputColor = '#2B2A47';
    global.searchInputTextColor = '#FFFFFF';
    global.searchInputPlaceholderTextColor = '#9B9B9B';
    global.commentInputColor = '#2B2A47';
    global.commentInputPlaceholderTextColor = '#9B9B9B';
    global.commentInputTextColor = '#FFFFFF';
    global.inputColor = '#FFFFFF';
    global.inputPlaceholderTextColor = '#9B9B9B';
    global.inputTextColor = '#FFFFFF';
    global.editProfileInputBorderBottom = '#141325';

    // trending tags in search color (gradient)
    global.selectedTagsColor1 = '#FFF62A';
    global.selectedTagsColor2 = '#FFF62A';
    global.notSelectedTagsColor1 = '#2B2A47';
    global.notSelectedTagsColor2 = '#2B2A47';
    global.selectedTagText = '#040216';
    global.notSelectedTagText = '#FFFFFF';
    global.tagsBorderColor = '#040216';

    // text button post text color (ex. post comment)
    global.postTextComment = '#08BA8F';

    // explore (TOP SCREEN) // not changed
    global.resultsBorderBottomColor = '#EC8989';

    // buttons
    global.followBtnBG1 = global.btnColor1;
    global.followBtnBG2 = global.btnColor2;
    global.followBtnTextColor = global.btnTxt;
    global.confirmBtnBG1 = global.btnColor1;
    global.confirmBtnBG2 = global.btnColor2;
    global.confirmBtnTextColor = global.btnTxt;
    global.declineButtonBG = '#000000';
    global.declineButtonTextColor = '#FFFFFF';

    // notification inbox > activity tab
    global.activityBorderBottomColor = '#FFFFFF';
    global.followRequestCountBG = '#FF0000';
    global.followRequestCountTextColor = '#FFFFFF';

    // message tab // not changed
    global.messageBG = '#f4a8a4';

    // organize badges screen
    global.filterBtnColor = '#FFF62A';
    global.earnedBadgesGradientColors = ['#2B2A47', '#2B2A47'];
    global.lockedBadgesBG = '#2B2A47';
    global.lockedBadgesAboveTop2 = 'rgba(255, 255, 255, 0.1)';
    global.lockedBadgesTitleColor = '#FFFFFF';
    global.lockedBadgesSubTitleColor = '#FFFFFF';
    global.lockedBadgesRarityColor = '#FFFFFF';
    global.lockedBadgesPointsColor = '#FFFFFF';
    global.filterSelectedBtn1 = '#230B34';
    global.filterSelectedBtn2 = '#230B34';
    global.filterNotSelectedBtn1 = '#ECB602'; // not
    global.filterNotSelectedBtn3 = '#ECB602'; // not
    global.filterSelectedText = '#FFFFFF';
    global.filterNotSelectedTagText = '#9B9B9B';
    global.filterTagsBorderColor = '#230B34'; // not

    // Edit Profile Screen
    global.editProfileBorderColor = '#FFF62A';
  } else if (themeIndex == 14) {
    /* free theme1 */
    gradientColors = ['#3C0C52', '#3C0C52']; // this is for the bottom nav bar!

    global.cust_item_code = 'theme-1';

    icons.push(require('../images/theme1Home.png'));
    icons.push(require('../images/theme1Explore.png'));
    icons.push(require('../images/theme1Tournament.png'));
    icons.push(require('../images/theme1Profile.png'));

    iconsSelected.push(require('../images/theme1Home.png'));
    iconsSelected.push(require('../images/theme1Explore.png'));
    iconsSelected.push(require('../images/theme1Tournament.png'));
    iconsSelected.push(require('../images/theme1Profile.png'));

    centerIcon = require('../images/whiteMainM.png');

    selectedColor = '#FFCD2F';
    unselectedColor = '#FFFFFF';

    // setting colors from previous developer
    global.colorPrimary = '#220032';
    global.colorSecondary = '#3C0C52';
    global.colorInput = '#FFFFFF';
    global.colorTextPrimary = '#FFFFFF';
    global.colorTextSecondary = '#FFFFFF';
    global.colorTextActive = '#FFFFFF';
    global.colorIcon = '#FFFFFF';
    global.gradientColors = ['#BE31FF', '#8900C9'];

    // ! SET COLORS HERE FOR NEW THEMES ! //

    // tab color for dashboard `following | New Memes | Trending` || Tournament || Notification Inbox
    global.tabSelectedColor = '#BE31FF';
    global.tabNotSelectedColor = '#320356';
    global.tabColor = '#320356';
    global.tabSelectedTextColor = '#FFFFFF';
    global.tabNotSelectedTextColor = '#B6B6B6';

    // add coins color (two colors because default is gradient with 2 colors)
    global.addCoinsBtnColor1 = '#BE31FF';
    global.addCoinsBtnColor2 = '#8900C9';

    // like, comment and share
    global.postInteractionsTextColor = '#FFFFFF';
    global.postInteractionsBG = require('../images/theme1Rectangle.png');

    // inputs
    global.searchInputColor = '#FFFFFF';
    global.searchInputTextColor = '#220032';
    global.searchInputPlaceholderTextColor = '#9B9B9B';
    global.commentInputColor = '#FFFFFF';
    global.commentInputPlaceholderTextColor = '#9B9B9B';
    global.commentInputTextColor = '#220032';
    global.inputColor = '#220032';
    global.inputPlaceholderTextColor = '#9B9B9B';
    global.inputTextColor = '#FFFFFF';
    global.editProfileInputBorderBottom = '#320356';

    // trending tags in search color (gradient)
    global.selectedTagsColor1 = '#BE31FF';
    global.selectedTagsColor2 = '#8900C9';
    global.notSelectedTagsColor1 = '#320356';
    global.notSelectedTagsColor2 = '#320356';
    global.selectedTagText = '#FFFFFF';
    global.notSelectedTagText = '#FFFFFF';
    global.tagsBorderColor = '#220032';

    // text button post text color (ex. post comment)
    global.postTextComment = '#8900C9';

    // explore (TOP SCREEN) // not changed
    global.resultsBorderBottomColor = '#EC8989';

    // buttons
    global.followBtnBG1 = global.btnColor1;
    global.followBtnBG2 = global.btnColor2;
    global.followBtnTextColor = global.btnTxt;
    global.confirmBtnBG1 = global.btnColor1;
    global.confirmBtnBG2 = global.btnColor2;
    global.confirmBtnTextColor = global.btnTxt;
    global.declineButtonBG = '#000000';
    global.declineButtonTextColor = '#FFFFFF';

    // notification inbox > activity tab
    global.activityBorderBottomColor = '#FFFFFF';
    global.followRequestCountBG = '#FF0000';
    global.followRequestCountTextColor = '#FFFFFF';

    // message tab // not changed
    global.messageBG = '#f4a8a4';

    // organize badges screen
    global.filterBtnColor = '#8A01CA';
    global.earnedBadgesGradientColors = ['#320356', '#320356'];
    global.lockedBadgesBG = '#320356';
    global.lockedBadgesAboveTop2 = 'rgba(255, 255, 255, 0.1)';
    global.lockedBadgesTitleColor = '#FFFFFF';
    global.lockedBadgesSubTitleColor = '#FFFFFF';
    global.lockedBadgesRarityColor = '#FFFFFF';
    global.lockedBadgesPointsColor = '#FFFFFF';
    global.filterSelectedBtn1 = '#230B34';
    global.filterSelectedBtn2 = '#230B34';
    global.filterNotSelectedBtn1 = '#ECB602'; // not
    global.filterNotSelectedBtn3 = '#ECB602'; // not
    global.filterSelectedText = '#220032';
    global.filterNotSelectedTagText = '#9B9B9B';
    global.filterTagsBorderColor = '#230B34'; // not

    // Edit Profile Screen
    global.editProfileBorderColor = '#8A01CA';
  } else {
    /* main_theme  */
    gradientColors = ['#292929', '#292929'];

    icons.push(require('../images/Home.png'));
    icons.push(require('../images/world.png'));
    icons.push(require('../images/cup.png'));
    icons.push(require('../images/person.png'));

    iconsSelected.push(require('../images/mainHomFille.png'));
    iconsSelected.push(require('../images/globeMainfilled.png'));
    iconsSelected.push(require('../images/trophyFilledmain.png'));
    iconsSelected.push(require('../images/personMainFilled.png'));

    centerIcon = require('../images/mainM.png');

    selectedColor = '#FFCD2F';
    unselectedColor = '#9B9B9B';

    // setting colors from previous developer
    global.colorPrimary = '#0D0219';
    global.colorSecondary = '#292929';
    global.colorInput = '#292929';
    global.colorTextPrimary = '#C1C1C1';
    global.colorTextSecondary = '#FFFFFF';
    global.colorTextActive = '#FFCD2F';
    global.colorIcon = '#FFFFFF';
    global.gradientColors = ['#292929', '#292929'];

    // ! SET COLORS HERE FOR NEW THEMES !

    // tab color for dashboard `following | New Memes | Trending` || Tournament || Notification Inbox
    global.tabSelectedColor = '#ECB602';
    global.tabNotSelectedColor = '#201E23';
    global.tabColor = '#201E23';
    global.tabSelectedTextColor = '#000000';
    global.tabNotSelectedTextColor = '#ABABAD';

    // add coins color (two colors because default is gradient with 2 colors)
    global.addCoinsBtnColor1 = '#73FF66';
    global.addCoinsBtnColor2 = '#19850F';

    // like, comment and share text color
    global.postInteractionsTextColor = '#89789A';
    global.postInteractionsBG = require('../images/Rectangle.png');

    // inputs
    global.searchInputColor = '#201E23';
    global.searchInputTextColor = '#FFFFFF';
    global.searchInputPlaceholderTextColor = '#707070';
    global.commentInputColor = '#201E23';
    global.commentInputPlaceholderTextColor = '#707070';
    global.commentInputTextColor = '#FFFFFF';
    global.inputColor = '#201E23';
    global.inputPlaceholderTextColor = '#707070';
    global.inputTextColor = '#FFFFFF';
    global.editProfileInputBorderBottom = '#FFFFFF';

    // trending tags in search color (gradient)
    global.selectedTagsColor1 = '#FFD524';
    global.selectedTagsColor2 = '#ECB602';
    global.notSelectedTagsColor1 = '#0D0219';
    global.notSelectedTagsColor2 = '#0D0219';
    global.selectedTagText = '#000000';
    global.notSelectedTagText = '#fff';
    global.tagsBorderColor = '#676767';

    // text button post text color (ex. post comment)
    global.postTextComment = '#FFCD2F';

    // explore (TOP SCREEN)
    global.resultsBorderBottomColor = '#1B1B1B';

    // buttons
    global.followBtnBG1 = global.btnColor1;
    global.followBtnBG2 = global.btnColor2;
    global.followBtnTextColor = global.btnTxt;
    global.confirmBtnBG1 = global.btnColor1;
    global.confirmBtnBG2 = global.btnColor2;
    global.confirmBtnTextColor = global.btnTxt;
    global.declineButtonBG = '#292929';
    global.declineButtonTextColor = '#FFFFFF';

    // notification inbox > activity tab
    global.activityBorderBottomColor = '#1B1B1B';
    global.followRequestCountBG = '#695CFF';
    global.followRequestCountTextColor = '#FFFFFF';

    // message tab
    global.messageBG = '#15152E';

    // organize badges screen
    global.filterBtnColor = '#201E23';
    global.earnedBadgesGradientColors = ['#292929', '#292929'];
    global.lockedBadgesBG = '#292929';
    global.lockedBadgesAboveTop2 = '#292929';
    global.lockedBadgesTitleColor = '#FFFFFF';
    global.lockedBadgesSubTitleColor = '#FFFFFF';
    global.lockedBadgesRarityColor = '#FFFFFF';
    global.lockedBadgesPointsColor = '#FFFFFF';
    global.filterSelectedBtn1 = '#000000';
    global.filterSelectedBtn2 = '#000000';
    global.filterNotSelectedBtn1 = '#ECB602';
    global.filterNotSelectedBtn3 = '#ECB602';
    global.filterSelectedText = '#FFFFFF';
    global.filterNotSelectedTagText = '#000000';
    global.filterTagsBorderColor = '#000000';

    // Edit Profile Screen
    global.editProfileBorderColor = '#FFFFFF';
  }

  function openGallery() {
    setShowImagePickerDialog(false);
    launchImageLibrary(options, response => {
      /* console.log('Response = ', response); */

      if (response.didCancel) {
        // alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        // alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        // alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        // alert(response.errorMessage);
        return;
      }

      let source = response.assets[0];
      openPhotoEditor(source.uri);
    });
  }

  const openCamera = async () => {
    setShowImagePickerDialog(false);
    let isStoragePermitted = await requestExternalWritePermission();
    let isCameraPermitted = await requestCameraPermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        /* console.log('Response = ', response); */

        if (response.didCancel) {
          // alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          // alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          // alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          // alert(response.errorMessage);
          return;
        }

        let source = response.assets[0];
        openPhotoEditor(source.uri);
      });
    }
  };

  function openPhotoEditor(uri) {
    PESDK.openEditor({uri: uri}).then(
      result => {
        navigation.navigate('NewPost', {uri: result.image, type: 'photo'});
      },
      error => {
        /* console.log(error); */
      },
    );
  }

  return (
    // <View style={[styles.barStyle,{justifyContent: 'center'}]}>
    //<View style={[{justifyContent: 'center'}]}>
    <View
      style={{
        justifyContent: 'center',
        marginTop: -31,
      }}>
      <LinearGradient colors={gradientColors} style={styles.bottom} />
      <View style={{flexDirection: 'row', position: 'absolute'}}>
        <View style={styles.icon}>
          <TouchableOpacity
            onPress={() => onPress(1)}
            style={styles.touchstyle}>
            <Image
              style={styles.icon_inside}
              source={navIndex == 0 ? iconsSelected[0] : icons[0]}
            />
            <Text
              style={{
                color: navIndex == 0 ? selectedColor : unselectedColor,
                fontSize: 11,
                fontFamily: global.fontSelect,
              }}>
              Home
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.icon}>
          <TouchableOpacity
            onPress={() => onPress(2)}
            style={styles.touchstyle}>
            <Image
              style={styles.icon_inside}
              source={navIndex == 1 ? iconsSelected[1] : icons[1]}
            />
            <Text
              style={{
                color: navIndex == 1 ? selectedColor : unselectedColor,
                fontSize: 11,
                fontFamily: global.fontSelect,
              }}>
              Explore
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.icon}>
          <TouchableOpacity
            onPress={() => setShowImagePickerDialog(true)}
            style={styles.touchstyle}>
            <View>
              <Image
                style={styles.centerIcon}
                resizeMode="stretch"
                source={centerIcon}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.icon}>
          <TouchableOpacity
            onPress={() => onPress(3)}
            style={styles.touchstyle}>
            <Image
              style={styles.icon_inside}
              source={navIndex == 2 ? iconsSelected[2] : icons[2]}
            />
            <Text
              style={{
                color: navIndex == 2 ? selectedColor : unselectedColor,
                fontSize: 11,
                fontFamily: global.fontSelect,
              }}>
              Tournament
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.icon}>
          <TouchableOpacity
            onPress={() => onPress(4)}
            style={styles.touchstyle}>
            <Image
              style={styles.icon_inside}
              source={navIndex == 3 ? iconsSelected[3] : icons[3]}
            />
            <Text
              style={{
                color: navIndex == 3 ? selectedColor : unselectedColor,
                fontSize: 11,
                fontFamily: global.fontSelect,
              }}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showImagePickerDialog}
        onRequestClose={() => {
          setShowImagePickerDialog(!showImagePickerDialog);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalViewImgPicker}>
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 18,
                marginBottom: '15%',
                marginTop: '3%',
              }}>
              Select File
            </Text>

            <TouchableOpacity
              style={{marginBottom: '8%'}}
              onPress={() => openCamera()}>
              <Text style={{color: '#fff', opacity: 0.5, fontSize: 16}}>
                Take photo...
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{marginBottom: '6%'}}
              onPress={() => openGallery()}>
              <Text style={{color: '#fff', opacity: 0.5, fontSize: 16}}>
                Choose Photo from library...
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={{marginBottom: '6%'}}
              onPress={() => {
                setShowImagePickerDialog(false);
                if (Platform.OS === 'android') {
                  getAndroidExportResult()
                    .then(videoUri => {
                      console.log(videoUri);
                      // alert("VIDEO URI TO BE SAVED IN DB"+videoUri)
                      navigation.navigate('NewPost', {
                        uri: `file://${videoUri}`,
                        type: 'video',
                      });
                    })
                    .catch(e => {
                      console.log('error', e);
                      console.log(e);
                    });
                } else {
                  const videoUri = openVideoEditor();
                  console.log(videoUri);
                }
              }}>
              <Text style={{color: '#fff', opacity: 0.5, fontSize: 16}}>
                Select Video
              </Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={[styles.button, styles.buttonOpen, {marginTop: '20%'}]}
              onPress={() => setShowImagePickerDialog(false)}>
              <LinearGradient
                colors={[global.btnColor1, global.btnColor2]}
                style={{
                  paddingHorizontal: 27,
                  paddingVertical: 15,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderRadius: 22,
                }}>
                <Text style={[styles.modalText, {color: global.btnTxt}]}>
                  Close
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  bottom: {
    flexDirection: 'row',
    height: 80,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  icon: {
    width: windowWidth / 5,
    alignSelf: 'center',
  },
  icon_inside: {
    width: 30,
    height: 30,
    marginBottom: 5,
    resizeMode: 'contain',
  },
  centerIcon: {
    width: windowWidth / 5,
    height: windowWidth / 5,
    marginBottom: 30,
  },
  touchstyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalViewImgPicker: {
    margin: 20,
    height: 300,
    width: '65%',
    backgroundColor: '#201E23',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '6%',
  },
  button: {
    borderRadius: 25,
    elevation: 2,
    marginRight: '1%',
    marginTop: '1%',
  },
  buttonOpen: {
    backgroundColor: '#FBC848',
    alignSelf: 'center',
  },
  modalText: {
    marginBottom: 0,
    marginTop: 0,
    textAlign: 'center',
  },
  barStyle: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default BottomNavBar;
