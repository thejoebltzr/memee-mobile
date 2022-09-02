import {PermissionsAndroid, Platform, Image} from 'react-native';
import storage from '@react-native-firebase/storage';

export default function DateDifference(date) {
  const date1 = new Date('7/13/2010');
  const date2 = new Date('7/15/2010');
  const diffTime = Math.abs(date2 - date1);
  const diffsec = Math.ceil(diffTime / (1000 * 60));
  const diffmin = Math.ceil(diffTime / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  /* console.log(diffTime + ' milliseconds');
  console.log(diffsec + ' sec');
  console.log(diffmin + ' min');
  console.log(diffDays + ' days'); */
  return diffmin;
}

export function generateUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getBucketOptions(folder) {
  const options = {
    keyPrefix: 'memee/' + folder + '/',
    bucket: 'memee-bucket',
    region: 'eu-central-1',
    accessKey: 'AKIA2YJH3TLHCODGDKFV',
    secretKey: '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',
    successActionStatus: 201,
  };
  return options;
}

export function currentDateFN() {
  var today = new Date();

  var hhh = today.getHours();
  if (hhh < 10) {
    hhh = '0' + hhh;
  }
  var mmm = today.getMinutes();
  if (mmm < 10) {
    mmm = '0' + mmm;
  }
  var sss = today.getSeconds();
  if (sss < 10) {
    sss = '0' + sss;
  }

  var yyy = today.getFullYear();

  var month = today.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  var ddd = today.getDate();
  if (ddd < 10) {
    ddd = '0' + ddd;
  }

  var time = hhh + ':' + mmm + ':' + sss;

  var date = yyy + '-' + month + '-' + ddd;

  var currentTime = date + ' ' + time;

  return currentTime;
}

export function testFN(array) {
  //find Differenc

  var newDateArr = array;
  for (let i = 0; i < array.length; i++) {
    var date1 = newDateArr[i].datetime;
    var aferDate = date1.replace(' ', 'T');
    newDateArr[i].datetime = aferDate;

    var respDate = new Date(newDateArr[i].datetime);
    var todayDate = new Date();
    var diffTime = Math.abs(todayDate - respDate);
    var diffsec = Math.ceil(diffTime / 1000);

    if (diffsec >= 86400) {
      var days = parseInt(diffsec) / 86400;
      newDateArr[i].datetime = parseInt(days) + 'd';
    } else if (diffsec >= 3600) {
      var hours = parseInt(diffsec) / 3600;
      newDateArr[i].datetime = parseInt(hours) + 'h';
    } else if (diffsec >= 60) {
      var mins = parseInt(diffsec) / 60;
      newDateArr[i].datetime = parseInt(mins) + 'm';
    } else {
      var seconds = diffsec;
      newDateArr[i].datetime = 'Just now';
    }
  }

  return newDateArr;
}

export function formatDateTime(datetime) {
  datetime = datetime.replace(' ', 'T');

  let todayDate = new Date();
  var respDate = new Date(datetime);

  var diffTime = Math.abs(todayDate - respDate);
  var diffsec = Math.ceil(diffTime / 1000);

  if (diffsec >= 86400) {
    var days = parseInt(diffsec) / 86400;
    datetime = parseInt(days) + 'd';
  } else if (diffsec >= 3600) {
    var hours = parseInt(diffsec) / 3600;
    datetime = parseInt(hours) + 'h';
  } else if (diffsec >= 60) {
    var mins = parseInt(diffsec) / 60;
    datetime = parseInt(mins) + 'm';
  } else {
    datetime = 'Just now';
  }

  return datetime;
}

export function getLastSeenFormat(datetime) {
  let time = formatDateTime(datetime);

  if (time == 'Just now') return 'Active moments ago';
  else return 'Active ' + time + ' ago';
}

export function asignImageToProductsFN(itemCode, type) {
  if (type == 'icon') {
    if (itemCode == 'unicorn_theme_icon') {
      var iconArray = [
        {
          imag: require('../images/UniconThemeIcon.png'),
          themeName: 'Unicorn Theme',
        },
      ];
      return iconArray;
    } else if (itemCode == 'save_earth_theme_icon') {
      var iconArray = [
        {
          imag: require('../images/EarthDayThemeIcons.png'),
          themeName: 'Save Earth Theme',
        },
      ];
      return iconArray;
    } else if (itemCode == 'new_year_theme_icon') {
      var iconArray = [
        {
          imag: require('../images/newYearThemeIcons.png'),
          themeName: 'New Year Theme',
        },
      ];
      return iconArray;
    } else if (itemCode == 'the_100_theme_icon') {
      var iconArray = [
        {
          imag: require('../images/100theme.png'),
          themeName: 'The 100 Theme',
        },
      ];
      return iconArray;
    } else if (itemCode == 'space_theme_icon') {
      var iconArray = [
        {
          imag: require('../images/spaceThemeIcon.png'),
          themeName: 'Space Theme',
        },
      ];
      return iconArray;
    } else if (itemCode == 'memee_theme_white_icon') {
      var iconArray = [
        {
          imag: require('../images/whiteTheme.png'),
          themeName: 'Memee Theme (White)',
        },
      ];
      return iconArray;
    } else if (itemCode == 'main_theme_icon') {
      var iconArray = [
        {
          imag: require('../images/Tabbar.png'),
          themeName: 'Space Theme',
        },
      ];
      return iconArray;
    } else if (itemCode == 'memee_theme_generic_icon') {
      var iconArray = [
        {
          imag: require('../images/Tabbar.png'),
          themeName: 'Memee Theme Generic',
        },
      ];
      return iconArray;
      
    }else if (itemCode == 'free_icon_roygbiv_pink_1') {
      var iconArray = [
        {
          imag: require('../images/roygbivTabBar.png'),
          themeName: 'ROYGBIV Pink',
        },
      ];
      return iconArray;
      
    }else if (itemCode == 'free_icon_roygbiv_orange_1') {
      var iconArray = [
        {
          imag: require('../images/roygbivOrangeTabBar.png'),
          themeName: 'ROYGBIV Orange',
        },
      ];
      return iconArray;
      
    }else if (itemCode == 'free_icon_theme_2') {
      var iconArray = [
        {
          imag: require('../images/theme2TabBar.png'),
          themeName: 'Theme 2',
        },
      ];
      return iconArray;
      
    }else if (itemCode == 'free_icon_theme_3') {
      var iconArray = [
        {
          imag: require('../images/theme3TabBar.png'),
          themeName: 'Theme 3',
        },
      ];
      return iconArray;
      
    }else if (itemCode == 'free_icon_theme_4') {
      var iconArray = [
        {
          imag: require('../images/theme4TabBar.png'),
          themeName: 'Theme 4',
        },
      ];
      return iconArray;
      
    }else if (itemCode == 'free_icon_theme_1') {
      var iconArray = [
        {
          imag: require('../images/theme1TabBar.png'),
          themeName: 'Theme 1',
        },
      ];
      return iconArray;
      
    } else {
      console.log('wrong icon type');
      var iconArray = [
        {
          imag: require('../images/Tabbar.png'),
          themeName: itemCode,
        },
      ];
      return iconArray;
    }
  } else if (type == 'font') {
    if (itemCode == 'font1') {
      var fontArray = [
        {
          font: 'Arial',
          themeName: 'Memee Font 1',
        },
      ];
      return fontArray;
    } else if (itemCode == 'font2') {
      var fontArray = [
        {
          font: 'DancingScript-Bold',
          themeName: 'Memee Font 2',
        },
      ];
      return fontArray;
    } else if (itemCode == 'font3') {
      var fontArray = [
        {
          font: 'Unkempt-Bold',
          themeName: 'Memee Font 3',
        },
      ];
      return fontArray;
    }else if (itemCode == 'ProductSans-Bold') {
      var fontArray = [
        {
          font: 'Unkempt-Bold',
          themeName: 'Memee Font 3',
        },
      ];
      return fontArray;
    } else if (itemCode == 'free_font_PTSans') {
      var fontArray = [
        {
          font: 'PTSans-Bold',
          themeName: 'Memee Font 4',
        },
      ];
      return fontArray;
    } else if (itemCode == 'free_font_Una') {
      var fontArray = [
        {
          font: 'Unna-Bold',
          themeName: 'Memee Font 5',
        },
      ];
      return fontArray;
    }  else {
      console.log('wrong Font type');
      var fontArray = [
        {
          font: 'Arial',
          themeName: itemCode,
        },
      ];
      return fontArray;
    }
  } else if (type == 'profile_background') {
    if (itemCode == 'memee_theme_white_profile_background') {
      return require('../images/memeeThemeWhite.png');
    } else if (itemCode == 'unicorn_theme_profile_background') {
      return require('../images/bg2.png');
    } else if (itemCode == 'save_earth_theme_profile_background') {
      return require('../images/saveEarth.png');
    } else if (itemCode == 'new_year_theme_profile_background') {
      return require('../images/newyearTheme.png');
    } else if (itemCode == 'the_100_theme_profile_background') {
      return require('../images/ThemeBackground5.png');
    } else if (itemCode == 'space_theme_profile_background') {
      return require('../images/spaceTheme33.png');
    } else if (itemCode == 'main_theme_profile_background') {
      return require('../images/profileBG.png');
    } else if (itemCode == 'memee_theme_generic_profile_background') {
      return require('../images/profileBG.png');
    } else {
      console.log('wrong Profile Background type');
    }
  } else if (type == 'button') {
    if (itemCode == 'memee_theme_white_button') {
      var buttonArray = [
        {
          imag: require('../images/memeeWhiteButton.png'),
          themeName: 'Memee White',
        },
      ];
      return buttonArray;
    } else if (itemCode == 'unicorn_theme_button') {
      var buttonArray = [
        {
          imag: require('../images/UniconButton.png'),
          themeName: 'Unicorn',
        },
      ];
      return buttonArray;
    }else if (itemCode == 'free_button_roygbiv_pink_1') {
      var buttonArray = [
        {
          imag: require('../images/MemeeButton.png'),
          themeName: 'ROYGBIV Pink',
        },
      ];
      return buttonArray;
    }else if (itemCode == 'free_button_roygbiv_orange_1') {
      var buttonArray = [
        {
          imag: require('../images/MemeeButton.png'),
          themeName: 'ROYGBIV Orange',
        },
      ];
      return buttonArray;
    }else if (itemCode == 'free_button_theme_2') {
      var buttonArray = [
        {
          imag: require('../images/MemeeButton.png'),
          themeName: 'Theme 2',
        },
      ];
      return buttonArray;
    }else if (itemCode == 'free_button_theme_3') {
      var buttonArray = [
        {
          imag: require('../images/MemeeButton.png'),
          themeName: 'Theme 3',
        },
      ];
      return buttonArray;
    }else if (itemCode == 'free_button_theme_4') {
      var buttonArray = [
        {
          imag: require('../images/MemeeButton.png'),
          themeName: 'Theme 4',
        },
      ];
      return buttonArray;
    }else if (itemCode == 'free_button_theme_1') {
      var buttonArray = [
        {
          imag: require('../images/MemeeButton.png'),
          themeName: 'Theme 1',
        },
      ];
      return buttonArray;
    } else if (itemCode == 'save_earth_theme_button') {
      var buttonArray = [
        {
          imag: require('../images/SaveEarthButton.png'),
          themeName: 'Save Earth',
        },
      ];
      return buttonArray;
    } else if (itemCode == 'new_year_theme_button') {
      var buttonArray = [
        {
          imag: require('../images/NewYearButton.png'),
          themeName: 'New Year',
        },
      ];
      return buttonArray;
    } else if (itemCode == 'the_100_theme_button') {
      var buttonArray = [
        {
          imag: require('../images/100themeButton.png'),
          themeName: 'The 100 Theme Button',
        },
      ];
      return buttonArray;
    } else if (itemCode == 'space_theme_button') {
      var buttonArray = [
        {
          imag: require('../images/SpaceButton.png'),
          themeName: 'Space Theme Button',
        },
      ];
      return buttonArray;
    } else if (itemCode == 'memee_theme_generic_button') {
      var buttonArray = [
        {
          imag: require('../images/genericButton.png'),
          themeName: 'Memee Genaric theme',
        },
      ];
      return buttonArray;
    } else {
      console.log('wrong Button type');
      var buttonArray = [
        {
          imag: require('../images/genericButton.png'),
          themeName: itemCode,
        },
      ];
      return buttonArray;
    }
  } else if (type == 'background_overlay') {
    if (itemCode == 'memee_theme_white_background_overlay') {
      return require('../images/ThemeOverLay1.png');
    } else if (itemCode == 'unicorn_theme_background_overlay') {
      return require('../images/ThemeOverLay2.png');
    } else if (itemCode == 'save_earth_theme_background_overlay') {
      return require('../images/ThemeOverLay3.png');
    } else if (itemCode == 'new_year_theme_background_overlay') {
      return require('../images/ThemeOverLay4.png');
    } else if (itemCode == 'the_100_theme_background_overlay') {
      return require('../images/ThemeOverLay5.png');
    } else if (itemCode == 'space_theme_backgroung_overlay') {
      return require('../images/ThemeOverLay6.png');
    } else if (itemCode == 'memee_theme_generic_background_overlay') {
      return require('../images/ThemeOverLay1.png');
    } else {
      console.log('wrong Background Overlay type');
    }
  } else {
    console.log('Type invalid');
  }
}

export const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission',
        },
      );
      // If CAMERA Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else return true;
};

export const requestExternalWritePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External Storage Write Permission',
          message: 'App needs write permission',
        },
      );
      // If WRITE_EXTERNAL_STORAGE Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      // alert('Write permission err', err);
    }
    return false;
  } else return true;
};

/*
added for phone number checking 
task: Phone number accepting alphabets
source: https://ihateregex.io/expr/phone/
accept all valid phone number format
*/
export const checkPhoneNumber = text => {
  if (text === null || text === undefined || text === '') {
    return false;
  }

  const r = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

  if (text.match(r)) {
    return true;
  } else {
    return false;
  }
};

// regex source https://www.section.io/engineering-education/password-strength-checker-javascript/
/* 
RULES:
The password is at least 8 characters long (?=.{8,}).
The password has at least one uppercase letter (?=.*[A-Z]).
The password has at least one lowercase letter (?=.*[a-z]).
The password has at least one digit (?=.*[0-9]).
The password has at least one special character ([^A-Za-z0-9]). 
*/
export const isStrongPassword = txt => {
  const r = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
  if (txt.match(r)) {
    return true;
  } else {
    return false;
  }
};

/* export const storeImageToFirebase = async (name, path) => {
  try {
    let reference = storage().ref(file.name);
    let task = await reference.putFile(file.uri);

    if (task.state == 'success') {
      let res = await reference.getDownloadURL();
      if (res) {
        return {success: res};
      } else {
        return {error: res};
      }
    } else {
      return {error: task.error};
    }
  } catch (error) {
    console.log('uploading image error => ', e);
    throw new Error(error);
  }
};
 */

export const heightScaleByWidth = (cWidth, width, height) => {
  // fit image to screen and scale it properly
  var base = cWidth > width ? cWidth : width;
  var widthBase = base == width ? cWidth : width;
  return ((base - widthBase) / base + 1) * height;
};

/* move specific item of an array to specific location(index) of an array */
export function moveItemArray(from, to, arr) {
  const newArr = [...arr];
  const item = newArr.splice(from, 1)[0];
  newArr.splice(to, 0, item);
  return newArr;
}

// remove specific item in an array
export const removeItemOnce = (arr, value) => {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
};

export const MonthsArray = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
