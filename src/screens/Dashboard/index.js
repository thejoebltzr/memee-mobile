import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  BackHandler,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Animated,
  Modal,
  Dimensions,
  MaskedViewIOS,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ImageBackground,
  ViewBase,
  NativeModules,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal2 from 'react-native-modalbox';
import ButtonCoins from '../../component/ButtonCoins';
import {Avatar} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import TwitterTextView from 'react-native-twitter-textview';
import {
  currentDateFN,
  moveItemArray,
  removeItemOnce,
} from '../../Utility/Utils';
import messaging from '@react-native-firebase/messaging';
import {firebaseConfig} from '../../redux/constants';
import BottomNavBar from '../../component/BottomNavBar';
import {getNotifications} from '../../redux/actions/Auth';

import Toast from 'react-native-toast-message';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import Icon from 'react-native-vector-icons/AntDesign';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  PESDK,
  PhotoEditorModal,
  Configuration,
} from 'react-native-photoeditorsdk';
import {
  requestCameraPermission,
  requestExternalWritePermission,
} from '../../Utility/Utils';
import Story from '../../component/Story/Story';
import StorySkeleton from '../../component/Story/StorySkeleton';
import API from '../../api/StoryApi';
import {RNS3} from 'react-native-aws3';
import {getBucketOptions, generateUID} from '../../Utility/Utils';
import storage from '@react-native-firebase/storage';
import moment from 'moment';

var offset = 0;
global.navigateDashboard = 1;
var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;
var gloIndex = '';

//Banuba Video Editor
const {VideoEditorModule} = NativeModules;

const openEditor = async () => {
  console.log('niagi diri');
  const res = await VideoEditorModule.openVideoEditor();
  console.log('f res', res);
  return res;
};

export const openVideoEditor = async () => {
  console.log('hello');
  const response = await openEditor();
  console.log('responsee------', response);

  if (!response) {
    return null;
  }

  return response?.videoUri;
};

async function getAndroidExportResult() {
  return await VideoEditorModule.openVideoEditor();
}
//End Video Editor

export default function Dashboard(props) {
  const navigation = useNavigation();
  const {
    coinsStored,
    scrollDown,
    ImageBottoms,
    notifications,
    tournamentRanking,
    followRequests,
  } = useSelector(({authRed}) => authRed);

  let options = {
    mediaType: 'photo',
    maxWidth: 512,
    maxHeight: 512,
    quality: 1,
  };

  const [dBottomFont, setdBottomFont] = useState(global.fontSelect);
  const dispatch = useDispatch();
  const [followingPost, setFollowingPost] = useState([]);
  const [newMemePost, setNewMemePost] = useState([]);
  const [trendingPost, setTrendingPost] = useState([]);

  const [tabNumber, setTabNumber] = useState(0);

  const [modalVisible, setModalVisible] = useState('');

  const [storyPage, setStoryPage] = useState(1);
  const [storyOffset, setStoryOffset] = useState(0);
  const [storyLimit, setStoryLimit] = useState(10);

  const [addStoryModalVisible, setAddStoryModalVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [isOpenMedia, setIsOpenMedia] = useState(false);

  const [stories, setStories] = useState([]);
  const [loadingStoriesItems, setLoadingStoriesItems] = useState(false);

  const [loadingAddStory, setLoadingAddStory] = useState(false);
  const [updatedStories, setUpdatedStories] = useState(0);

  const [loadingNewStory, setLoadingNewStory] = useState(false);

  const [postIdToDelete, setPostIdToDelete] = useState('');
  const [defaultHeartColor, setDefaultHeartColor] = useState('#89789A');
  const [heartColor, setHeartColor] = useState('#EC1C1C');

  const [btncolor1_1, setBtncolor1_1] = useState('#FFE299');
  const [btncolor1_2, setBtncolor1_2] = useState('#F6B202');
  const [txtcolor1, setTxtcolor1] = useState('#000000');

  const [btncolor2_1, setBtncolor2_1] = useState('#201E23');
  const [btncolor2_2, setBtncolor2_2] = useState('#201E23');
  const [txtcolor2, setTxtcolor2] = useState('#ABABAD');

  const [btncolor3_1, setBtncolor3_1] = useState('#201E23');
  const [btncolor3_2, setBtncolor3_2] = useState('#201E23');
  const [txtcolor3, setTxtcolor3] = useState('#ABABAD');

  const [pimgChange, setPimgChange] = useState(global.userData.imgurl);
  const [pProfileName, setPProfileName] = useState(
    global.userData?.name?.split(' ')[0] || 'Memee',
  );
  const [refreshing, setRefreshing] = React.useState(false);
  const [loaderIndicator, setLoaderIndicator] = useState(true);
  const flatlistRef = useRef();
  const playerRef = useRef();

  const [videoHeight, setVideoHeight] = useState(400);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchStories();
    selectTab(global.navigateDashboard);
  }, []);

  // fetching of Stories
  useEffect(() => {
    fetchStories();
    console.log('token', global.userData.user_id);
  }, [updatedStories]);

  // upload image/video
  function uploadImageToS3() {
    setLoadingAddStory(true);

    const data =
      file.type == 'photo'
        ? {
            uri: file.uri,
            name: generateUID() + '.jpg',
            type: 'image/jpeg',
          }
        : {
            uri: file.uri,
            name: generateUID() + '.mp4',
            type: 'video/mp4',
          };

    let reference = storage().ref(data.name);
    let task = reference.putFile(data.uri);

    task
      .then(res => {
        console.log('Image uploaded to the bucket!');
        reference.getDownloadURL().then(response => {
          //console.log('Image downloaded from the bucket!', response);
          addStory(response);
        });
      })
      .catch(e => {
        console.error('uploading image error => ', e);
        Toast.show({
          type: 'error',
          text2: 'Unable to add story. Please try again later!',
        });
        setLoadingAddStory(false);
      });
  }

  // fetch stories = query /user_id=xxxx&limit=xx
  const fetchStories = async () => {
    setLoadingStoriesItems(true);
    // console.log('sds', global.userData.user_id);
    setStoryOffset(0);
    const response = await API.GetDayStories({
      user_id: global.userData.user_id,
      limit: storyLimit,
      offset: storyOffset,
    });
    const {DayStories, Status} = response;
    const filterStories = DayStories.filter(story => story.stories.length > 0);

    // for (let j = 0; j < 7; j++) {
    //   filterStories.push(filterStories[0]);
    // }

    if (Status !== 200) {
      Toast.show({
        type: 'error',
        text2: 'Unable to retrieve stories, please try again later.',
      });
      setLoadingStoriesItems(false);
      setRefreshing(false);
      return;
    }

    if (filterStories.length > 0) {
      let storyIndexOfLoggedInUser = 0;

      for (let index = 0; index < filterStories.length; index++) {
        if (global.userData.user_id === filterStories[index].user_id) {
          storyIndexOfLoggedInUser = index;
          break;
        }
      }

      // move(): put the story of the logged in user in the first of story lists
      setStories(moveItemArray(storyIndexOfLoggedInUser, 0, filterStories));
      setLoadingStoriesItems(false);
      setRefreshing(false);
      return;
    }
    setStories([]);
    setLoadingStoriesItems(false);
    setRefreshing(false);
  };

  // Add story body: {userId: XXXX, ImgUrl: XXXX, VideoUrl: XXXX, dateTime: YYYY-MM-DD HH:mm:ss}
  async function addStory(location) {
    const response = await API.AddStory({
      userID: global.userData.user_id,
      ImgUrl: file.type === 'photo' ? location : '',
      VideoUrl: file.type === 'video' ? location : '',
      dateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    });

    if (response.Status !== 201) {
      Toast.show({
        type: 'error',
        text2: 'Something went wrong. Please try again later!',
      });
      return;
    }
    setIsOpenMedia(false);
    setAddStoryModalVisible(false);
    setFile(null);
    setLoadingAddStory(false);
    setUpdatedStories(updatedStories + 1);
  }

  // delete story body: {story_id: xxxx}
  async function deleteStory(story_id) {
    const response = await API.DeleteStory({story_id});

    if (response.Status !== 200) {
      Toast.show({
        type: 'error',
        text2: 'Something went wrong. Please try again later!',
      });
      return false;
    }
    return true;
  }

  async function updateStoryOffset(offset, page, limit) {
    setLoadingNewStory(true);
    //console.log('New story request page:', {offset, page, limit});
    const response = await API.GetDayStories({
      user_id: global.userData.user_id,
      limit: storyLimit,
      offset,
    });
    const {DayStories, Status} = response;
    const filterStories = DayStories.filter(story => story.stories.length > 0);

    if (Status !== 200) {
      Toast.show({
        type: 'error',
        text2: 'Unable to retrieve stories, please try again later.',
      });
      return;
    }

    if (filterStories.length > 0) {
      const cloneStories = stories;
      const mergeStories = cloneStories.concat(filterStories);

      setStories(mergeStories);
      const newOffset = limit - page;
      const newPage = page + 1;
      setStoryOffset(newOffset);
      setStoryPage(newPage);
    }
    setLoadingNewStory(false);
  }

  function cancelStoryModal() {
    file
      ? Alert.alert('Discard story', 'Are you sure you want to exit?', [
          {
            text: 'Cancel',
            onPress: () => {
              setAddStoryModalVisible(false);
              setIsOpenMedia(false);
            },
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              setFile(null);
              setIsOpenMedia(false);
            },
          },
        ])
      : setAddStoryModalVisible(false);
  }

  useEffect(() => {
    selectTab(global.navigateDashboard);
    setdBottomFont(global.fontSelect);

    const unsubscribe = navigation.addListener('focus', () => {
      setdBottomFont(global.fontSelect);

      setPimgChange(global.userData.imgurl);
      global.TabButton = 1;

      SelectedBtnFN(global.navigateDashboard);

      if (global.refresh) {
        getPosts(global.navigateDashboard);
        global.refresh = false;
      }

      dispatch(getNotifications());

      messaging()
        .getToken()
        .then(deviceToken => {
          return saveTokenToDatabase(deviceToken);
        });

      return messaging().onTokenRefresh(deviceToken => {
        saveTokenToDatabase(deviceToken);
      });
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  function saveTokenToDatabase(deviceToken) {
    fetch(
      global.address +
        'updateDeviceToken/' +
        global.userData.user_id +
        '/' +
        deviceToken,
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
      .then(responseJson => {
        // console.log("\n response of device token.... \n",responseJson)
      })
      .catch(error => {
        console.error(error);
      });
  }

  function selectTab(index) {
    setTabNumber(index);
    SelectedBtnFN(index);
    getPosts(index);
  }

  function SelectedBtnFN(btnNo) {
    /* console.log('Selected tab : ', btnNo); */

    global.navigateDashboard = btnNo;

    if (btnNo == 1) {
      setBtncolor1_1(global.btnColor1);
      setBtncolor1_2(global.btnColor2);

      setBtncolor2_1(global.tabNotSelectedColor);
      setBtncolor2_2(global.tabNotSelectedColor);

      setBtncolor3_1(global.tabNotSelectedColor);
      setBtncolor3_2(global.tabNotSelectedColor);

      setTxtcolor1(global.btnTxt);
      setTxtcolor2(global.tabNotSelectedTextColor);
      setTxtcolor3(global.tabNotSelectedTextColor);
    } else if (btnNo == 2) {
      setBtncolor1_1(global.tabNotSelectedColor);
      setBtncolor1_2(global.tabNotSelectedColor);

      setBtncolor2_1(global.btnColor1);
      setBtncolor2_2(global.btnColor2);

      setBtncolor3_1(global.tabNotSelectedColor);
      setBtncolor3_2(global.tabNotSelectedColor);

      setTxtcolor1(global.tabNotSelectedTextColor);
      setTxtcolor2(global.btnTxt);
      setTxtcolor3(global.tabNotSelectedTextColor);
    } else if (btnNo == 3) {
      setBtncolor1_1(global.tabNotSelectedColor);
      setBtncolor1_2(global.tabNotSelectedColor);

      setBtncolor2_1(global.tabNotSelectedColor);
      setBtncolor2_2(global.tabNotSelectedColor);

      setBtncolor3_1(global.btnColor1);
      setBtncolor3_2(global.btnColor2);

      setTxtcolor1(global.tabNotSelectedTextColor);
      setTxtcolor2(global.tabNotSelectedTextColor);
      setTxtcolor3(global.btnTxt);
    } else {
      setBtncolor1_1(global.btnColor1);
      setBtncolor1_2(global.btnColor2);

      setBtncolor2_1(global.tabNotSelectedColor);
      setBtncolor2_2(global.tabNotSelectedColor);

      setBtncolor3_1(global.tabNotSelectedColor);
      setBtncolor3_2(global.tabNotSelectedColor);

      setTxtcolor1(global.btnTxt);
      setTxtcolor2(global.tabNotSelectedTextColor);
      setTxtcolor3(global.tabNotSelectedTextColor);
    }
  }

  const getImageSize = async uri =>
    new Promise(resolve => {
      Image.getSize(uri, (width, height) => {
        resolve([width, height]);
      });
    });

  const getDashboardPosts = async (tabNo, scroll) => {
    var postApiName = '';
    if (tabNo == 1) {
      postApiName = 'GetFollowingPosts';
    } else if (tabNo == 2) {
      postApiName = 'GetLatestPosts';
    } else if (tabNo == 3) {
      postApiName = 'GetTrendingPosts';
    } else {
      console.error('wrong tab');
    }

    var limit = 50;
    offset = scroll ? offset + 50 : 0;
    try {
      const res = await fetch(
        global.address +
          postApiName +
          '/' +
          global.userData.user_id +
          '/' +
          offset +
          '/' +
          limit,
        {
          method: 'get',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authToken: global.token,
          },
        },
      );

      const resJSON = await res.json();

      let data = resJSON;
      setRefreshing(false);

      return data;
    } catch (error) {
      console.error('getDashboardPosts', error);
      return [];
    }
  };

  const getPosts = async (tabNo, scroll = false) => {
    if (
      scroll &&
      (followingPost.length < 50 ||
        newMemePost.length < 50 ||
        trendingPost.length < 50)
    )
      return;

    setLoaderIndicator(true);

    const res = await getDashboardPosts(tabNo, scroll);

    let data = [];
    let treatedData = [];
    let filteredData = [];

    if (tabNo == 1) data = res.FollowerPosts;
    else if (tabNo == 2) data = res.NewPosts;
    else if (tabNo == 3) data = res.TrendingPosts;

    //console.log(typeof data);
    //console.log(typeof filteredData);

    if (data[0]?.tournament) {
      filteredData = data.filter(item => item.tournament.length < 1);
    } else {
      filteredData = data;
    }
    //treatedData = filteredData;

    const treatTheData = async data => {
      try {
        var resData = data;
        for (let i = 0; i < data.length; i++) {
          if (!data[i].img_url.includes('mp4')) {
            resData[i].showMenu = false;
            const [width, height] = await getImageSize(data[i].img_url);
            const ratio = windowWidth / width;
            resData[i].calHeight = height * ratio;
            resData[i].calWidth = windowWidth;
          } else {
            resData[i].paused = true;
          }
        }

        return resData;
      } catch (error) {
        console.error(error);
        return data;
      }
    };

    treatedData = await treatTheData(filteredData);

    //console.error('filteredData', filteredData);
    //console.error('treatedData', treatedData);

    if (tabNo == 1)
      scroll
        ? setFollowingPost(followingPost => [...followingPost, treatedData])
        : setFollowingPost(treatedData);
    else if (tabNo == 2)
      scroll
        ? setNewMemePost(newMemePost => [...newMemePost, treatedData])
        : setNewMemePost(treatedData);
    else if (tabNo == 3)
      scroll
        ? setTrendingPost(trendingPost => [...trendingPost, treatedData])
        : setTrendingPost(treatedData);

    setLoaderIndicator(false);
  };

  function navigateToprofileFN() {
    global.profileID = global.userData.user_id;
    console.log('asd', global.profileID);
    navigation.navigate('ProfileScreen');
  }

  function likeOrUnlikeFN(index) {
    var postList =
      tabNumber == 1
        ? followingPost
        : tabNumber == 2
        ? newMemePost
        : trendingPost;
    var postID = postList[index].post_id;
    var arrayTemp = '';

    var arrayTemp = postList;

    if (arrayTemp[index].IsLiked == 0) {
      arrayTemp[index].IsLiked = 1;
      arrayTemp[index].like_count = parseInt(arrayTemp[index].like_count) + 1;
    } else {
      arrayTemp[index].IsLiked = 0;
      arrayTemp[index].like_count = parseInt(arrayTemp[index].like_count) - 1;
    }

    if (tabNumber == 1) setFollowingPost([...arrayTemp]);
    else if (tabNumber == 2) setNewMemePost([...arrayTemp]);
    else setTrendingPost([...arrayTemp]);

    fetch(global.address + 'reactToPost', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
      body: JSON.stringify({
        UserID: global.userData.user_id,
        PostID: postID,
        dateTime: currentDateFN(),
      }),
    });
  }

  function showMenuFN(index) {
    var postList =
      tabNumber == 1
        ? followingPost
        : tabNumber == 2
        ? newMemePost
        : trendingPost;
    (postList[index].showMenu = !postList[index].showMenu),
      tabNumber == 1
        ? setFollowingPost([...postList])
        : tabNumber == 2
        ? setNewMemePost([...postList])
        : setTrendingPost([...postList]);
  }

  function showMenueModalFN(index) {
    gloIndex = index;
    var postList =
      tabNumber == 1
        ? followingPost
        : tabNumber == 2
        ? newMemePost
        : trendingPost;
    (postList[index].showMenu = !postList[index].showMenu),
      tabNumber == 1
        ? setFollowingPost([...postList])
        : tabNumber == 2
        ? setNewMemePost([...postList])
        : setTrendingPost([...postList]);
    setModalVisible(true);
    setPostIdToDelete(postList[index].post_id);
  }

  function deleteMemeeFN() {
    setModalVisible(false);

    fetch(global.address + 'DeletePost/' + postIdToDelete, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        var postList =
          tabNumber == 1
            ? followingPost
            : tabNumber == 2
            ? newMemePost
            : trendingPost;
        postList.splice(gloIndex, 1);

        tabNumber == 1
          ? setFollowingPost([...postList])
          : tabNumber == 2
          ? setNewMemePost([...postList])
          : setTrendingPost([...postList]);
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text2: 'Please check your internet connection.',
        });
        console.error(error);
      });
  }

  function navigateToComment(index) {
    var postList =
      tabNumber == 1
        ? followingPost
        : tabNumber == 2
        ? newMemePost
        : trendingPost;
    global.postId = postList[index].post_id;
    navigation.navigate('CommentScreen');
  }

  function navigationToProfileFN(index) {
    console.log('indexs', index);
    if (index > -1 && index != null) {
      var user =
        tabNumber == 1
          ? followingPost[index]
          : tabNumber == 2
          ? newMemePost[index]
          : tabNumber == 3
          ? trendingPost[index]
          : 0;
      // var id = user.user_id;
      //console.log('user', user, id);
      global.profileID = index;
      navigation.navigate('ProfileScreen');
    }
  }

  function sharePostFN(index) {
    // var arrForSC = followingPost
    // var shareCountVar = arrForSC[index].share_count;
    // shareCountVar = parseInt(shareCountVar) + 1;
    // arrForSC[index].share_count = shareCountVar;
    // setFollowingPost(([...arrForSC]));
    // var DateTimeCurrent = currentDateFN()

    var postList =
      tabNumber == 1
        ? followingPost
        : tabNumber == 2
        ? newMemePost
        : trendingPost;

    global.sharePost = postList[index];

    /* console.log('global.sharePost : ', global.sharePost); */
    navigation.navigate('SharePost');
  }

  const toTop = () => {
    // use current
    flatlistRef.current.scrollToOffset({animated: true, offset: 0});
  };

  // for bottom tab
  function activeTab(counter) {
    global.TabButton = counter;
    if (counter == 1) {
      //should refresh here
      //navigation.navigate('Dashboard');
      //selectTab(tabNumber);
      toTop();
      onRefresh();
    } else if (counter == 2) {
      navigation.navigate('ExploreScreen');
    } else if (counter == 3) {
      navigation.navigate('Tournament');
    } else if (counter == 4) {
      global.profileID = global.userData.user_id;
      navigation.navigate('ProfileScreen');
    }
  }

  /* const mock = [
    {
      ParentUserId: 0,
      UserImage:
        'https://www.memesmonkey.com/images/memesmonkey/ad/ad92e10bb8d7a4e6a25677db215feaf3.jpeg',
      UserName:
        'Leo duis ut diam quam nulla. Vitae proin sagittis nisl rhoncus mattis rhoncus urna neque viverra. In cursus turpis massa tincidunt. M In cursus turpis massa tincidunt. M',
      ParentUserImage:
        'https://www.memesmonkey.com/images/memesmonkey/ad/ad92e10bb8d7a4e6a25677db215feaf3.jpeg',
      ParentUserName:
        'Leo duis ut diam quam nulla. Vitae proin sagittis nisl rhoncus mattis rhoncus urna neque viverra. ',
    },
  ]; */
  /* global.colorPrimary */

  function openGallery() {
    setIsOpenMedia(true);
    console.log('this is true');
    launchImageLibrary(options, (response) => {
      console.log('Response = ', response);
      console.log('Response = ');

      if (response.didCancel) {
        // alert('User cancelled camera picker');
        setIsOpenMedia(false);
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        setIsOpenMedia(false);
        // alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        setIsOpenMedia(false);
        // alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        setIsOpenMedia(false);
        // alert(response.errorMessage);
        return;
      }

      let source = response.assets[0];
      console.log('source', source)
      openPhotoEditor(source.uri);
    });
  }
  const getDescription = text => {
    try {
      return decodeURIComponent(
        JSON.parse('"' + text.replace(/\"/g, '\\"') + '"'),
      );
    } catch (err) {
      return text;
    }
  };
  const openCamera = async () => {
    setIsOpenMedia(true);
    let isStoragePermitted = await requestExternalWritePermission();
    let isCameraPermitted = await requestCameraPermission();
    console.log({isStoragePermitted, isCameraPermitted});
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        console.log('Response = ', response);
        console.log('Response = ');

        if (response.didCancel) {
          // alert('User cancelled camera picker');
          setIsOpenMedia(false);
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          // alert('Camera not available on device');
          setIsOpenMedia(false);
          return;
        } else if (response.errorCode == 'permission') {
          // alert('Permission not satisfied');
          setIsOpenMedia(false);
          return;
        } else if (response.errorCode == 'others') {
          // alert(response.errorMessage);
          setIsOpenMedia(false);
          return;
        }

        let source = response.assets[0];
        openPhotoEditor(source.uri);
      });
    }
  };

  function openPhotoEditor(uri) {
    console.log('tata uri', uri);
    setIsOpenMedia(true);
    PESDK.openEditor({uri: uri}).then(
      result => {
        if (!result || !result.image) {
          setIsOpenMedia(false);
        }
        // navigation.navigate("NewPost", {uri: result.image})
        setFile({type: 'photo', uri: result.image});
      },
      error => {
        console.error(error);
      },
    );
  }

  const textMaximumWidth = windowWidth * 0.75 - 20;

  // console.log('FILE', file);
  /* console.log('textMaximumWidth', textMaximumWidth); */
  return (
    <View style={{flex: 1, backgroundColor: global.colorPrimary}}>
      <FlatList
        ref={flatlistRef}
        data={
          tabNumber == 1
            ? followingPost
            : tabNumber == 2
            ? newMemePost
            : tabNumber == 3
            ? trendingPost
            : []
        }
        /* data={mock} */
        onEndReached={() => getPosts(global.navigateDashboard, true)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({item, index}) => {
          /* console.log('skwa', item); */
          var sd = '"' + item.description.replace(/\"/g, '\\"') + '"';
          sd.replace(/\n/g, ' ');
          return (
            <View
              style={{
                width: windowWidth,
                alignSelf: 'center',
                marginBottom: 10,
              }}>
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                {item.ParentUserId > 0 ? (
                  <View>
                    <TouchableOpacity
                      onPress={() => navigationToProfileFN(item.user_id)}>
                      <View
                        style={{
                          marginTop: 15,
                          paddingLeft: 15,
                          flexDirection: 'row',
                        }}>
                        <View>
                          <View
                            style={{
                              borderRadius: 35,
                              borderColor: '#fff',
                              borderWidth: 2,
                            }}>
                            <Avatar
                              rounded
                              size="medium"
                              source={{uri: item.UserImage}}
                            />
                          </View>
                        </View>

                        <View
                          style={{
                            marginLeft: 10,
                            flexDirection: 'row',
                            alignItems: 'baseline',
                          }}>
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 18,
                              color: global.colorTextPrimary,
                              marginTop: 0,
                              fontFamily: global.fontSelect,
                              width: textMaximumWidth - 100,
                            }}>
                            <Text style={{width: 5}}>{item.UserName} </Text>
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: global.colorTextPrimary,
                            }}>
                            shared this Memee
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => navigationToProfileFN(item.ParentUserId)}>
                      <View
                        style={{
                          marginTop: -25,
                          paddingLeft: 45,
                          flexDirection: 'row',
                        }}>
                        <View>
                          <View
                            style={{
                              borderRadius: 35,
                              borderColor: '#fff',
                              borderWidth: 2,
                            }}>
                            <Avatar
                              rounded
                              size="small"
                              source={{uri: item.ParentUserImage}}
                            />
                          </View>
                        </View>

                        <View style={{marginLeft: 10}}>
                          <Text
                            numberOfLines={3}
                            ellipsizeMode="tail"
                            style={{
                              fontSize: 15,
                              color: global.colorTextPrimary,
                              marginTop: 6,
                              fontFamily: global.fontSelect,
                              width: textMaximumWidth,
                            }}>
                            {item.ParentUserName}
                          </Text>
                          {/* <Text style={{ fontSize: 10, color: '#D1BCD4' }}>{item.UserBio}</Text> */}
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <TouchableOpacity
                      onPress={() => navigationToProfileFN(item.user_id)}>
                      <View
                        style={{
                          marginTop: 15,
                          paddingLeft: 15,
                          flexDirection: 'row',
                        }}>
                        <View>
                          <View
                            style={{
                              borderRadius: 35,
                              borderColor: '#fff',
                              borderWidth: 2,
                            }}>
                            <Avatar
                              rounded
                              size="medium"
                              source={{uri: item.UserImage}}
                            />
                          </View>
                        </View>

                        <View style={{marginLeft: 10}}>
                          <Text
                            numberOfLines={3}
                            ellipsizeMode="tail"
                            style={{
                              fontSize: 18,
                              color: global.colorTextPrimary,
                              fontFamily: global.fontSelect,
                              width: textMaximumWidth,
                            }}>
                            {item.UserName}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: global.colorTextPrimary,
                              fontFamily: global.fontSelect,
                              width: textMaximumWidth,
                            }}>
                            {item.UserBio}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                {global.userData.user_id == item.user_id ? (
                  <TouchableOpacity
                    onPress={() => showMenuFN(index)}
                    style={{
                      marginLeft: 'auto',
                      marginTop: 27,
                      marginRight: 10,
                    }}>
                    <View>
                      <Image
                        style={{
                          height: 22,
                          width: 22,
                          marginLeft: 10,
                          marginRight: 2,
                          tintColor: global.colorIcon,
                        }}
                        resizeMode="stretch"
                        source={require('../../images/more.png')}
                      />
                    </View>
                  </TouchableOpacity>
                ) : null}
              </View>
              <TwitterTextView
                // onPressHashtag={() => {}}
                hashtagStyle={{color: global.colorTextActive}}
                style={{
                  color: global.colorTextPrimary,
                  marginLeft: '5%',
                  marginTop: 5,
                  marginRight: '5%',
                  fontFamily: global.fontSelect,
                  marginBottom: 15,
                }}>
                {getDescription(item.description)}
              </TwitterTextView>

              {item.img_url.includes('mp4') ? (
                <View key={item.img_url}>
                  <VideoPlayer
                    key={item.post_id}
                    source={{uri: item.img_url}}
                    disableFullscreen
                    disableBack
                    paused={true}
                    controlTimeout={2500}
                    tapAnywhereToPause={true}
                    showOnStart={true}
                    style={{
                      width: '100%',
                      height: videoHeight,
                    }}
                    resizeMode="cover"
                    onLoad={response => {
                      const {width, height} = response.naturalSize;
                      const heightScaled =
                        height * (Dimensions.get('screen').width / width);

                      if (heightScaled > 500) {
                        setVideoHeight(500);
                      } else {
                        setVideoHeight(heightScaled);
                      }
                    }}
                  />
                </View>
              ) : (
                <ImageBackground
                  source={{uri: item.img_url}}
                  resizeMode="contain"
                  style={{
                    height: item.calHeight ? item.calHeight : windowWidth,
                    width: '100%',
                  }}>
                  <LinearGradient
                    colors={[global.overlay1, global.overlay3]}
                    style={{height: '100%', width: '100%'}}
                  />
                </ImageBackground>
              )}

              <View
                style={{width: '100%', backgroundColor: global.colorPrimary}}>
                <ImageBackground
                  source={global.postInteractionsBG}
                  resizeMode="stretch"
                  style={{
                    flexDirection: 'row',
                    width: windowWidth - (windowWidth * 25) / 100,
                    marginLeft: '0%',
                    marginTop: 15,
                    height: windowWidth - (windowWidth * 79) / 100,
                    borderRadius: 40,
                    alignSelf: 'center',
                  }}>
                  <View
                    style={{
                      width: '26%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {item.IsLiked == 0 ? (
                      <TouchableOpacity onPress={() => likeOrUnlikeFN(index)}>
                        <View>
                          <Image
                            style={{
                              height: 28,
                              width: 28,
                              marginLeft: 10,
                              marginRight: 2,
                              tintColor: global.postInteractionsTextColor,
                            }}
                            resizeMode="stretch"
                            source={require('../../images/Vector.png')}
                          />
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => likeOrUnlikeFN(index)}>
                        <View>
                          <Image
                            style={{
                              height: 28,
                              width: 28,
                              marginLeft: 10,
                              marginRight: 2,
                              tintColor: heartColor,
                            }}
                            resizeMode="stretch"
                            source={require('../../images/Vector.png')}
                          />
                        </View>
                      </TouchableOpacity>
                    )}

                    <Text
                      style={[
                        styles.txtReaction,
                        {
                          fontFamily: global.fontSelect,
                          color: global.postInteractionsTextColor,
                        },
                      ]}>
                      {item.like_count}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: '40%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={() => navigateToComment(index)}>
                      <Image
                        style={{
                          height: 28,
                          width: 28,
                          marginLeft: 10,
                          marginRight: 2,
                          tintColor: global.postInteractionsTextColor,
                        }}
                        resizeMode="stretch"
                        source={require('../../images/sms.png')}
                      />
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.txtReaction,
                        {
                          fontFamily: global.fontSelect,
                          color: global.postInteractionsTextColor,
                        },
                      ]}>
                      {item.comment_count}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: '32%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={() => sharePostFN(index)}>
                      <Image
                        style={{
                          height: 28,
                          width: 28,
                          marginLeft: 10,
                          marginRight: 2,
                          tintColor: global.postInteractionsTextColor,
                        }}
                        resizeMode="stretch"
                        source={require('../../images/share.png')}
                      />
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.txtReaction,
                        {
                          fontFamily: global.fontSelect,
                          color: global.postInteractionsTextColor,
                        },
                      ]}>
                      {item.share_count}
                    </Text>
                  </View>
                </ImageBackground>
              </View>

              <View
                style={{
                  width: '100%',
                  height: 3,
                  backgroundColor: global.colorSecondary,
                  marginTop: 20,
                }}></View>

              {item.showMenu == true ? (
                <View
                  style={{
                    padding: 10,
                    borderRadius: 20,
                    position: 'absolute',
                    top: 30,
                    right: 22,
                    backgroundColor: '#fff',
                  }}>
                  {global.userData.user_id == item.user_id ? (
                    <View>
                      <TouchableOpacity onPress={() => showMenueModalFN(index)}>
                        <View style={{flexDirection: 'row', marginVertical: 5}}>
                          <Image
                            style={{
                              height: 22,
                              width: 22,
                              marginLeft: 0,
                              marginRight: 10,
                            }}
                            resizeMode="stretch"
                            source={require('../../images/delete.png')}
                          />
                          <Text
                            style={{
                              fontFamily: global.fontSelect,
                              marginRight: 5,
                            }}>
                            Delete
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>
          );
        }}
        keyExtractor={item => item.post_id}
        ListFooterComponent={() => (
          <View>
            {loaderIndicator == true ? (
              <ActivityIndicator
                size="large"
                color={global.colorTextActive}
                style={{alignSelf: 'center', marginTop: '10%'}}
              />
            ) : (
              <View>
                {followingPost.length < 1 && (
                  <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
                    <Text style={{color: global.colorTextPrimary}}>
                      No available posts.
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.topView}>
              <TouchableOpacity
                onPress={() => navigateToprofileFN()}
                style={{
                  flexDirection: 'row',
                }}>
                <Avatar rounded size="medium" source={{uri: pimgChange}} />
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: 'white',
                    marginLeft: 10,
                    fontSize: 24,
                    marginTop: 8,
                    flexWrap: 'wrap',

                    width: windowWidth * 0.35,
                  }}>
                  Hi{' '}
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 24,
                    }}>
                    {windowWidth < 400
                      ? pProfileName.substring(0, 2)
                      : pProfileName}
                    ,
                  </Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('NotificationScreen')}
                style={{marginLeft: 'auto'}}>
                <Image
                  style={{
                    height: 50,
                    width: 30,
                    tintColor: global.colorIcon,
                    marginRight: 10,
                  }}
                  resizeMode="contain"
                  source={
                    notifications.some(n => n.status == 0) ||
                    followRequests?.length > 0
                      ? require('../../images/notifications.png')
                      : require('../../images/no_notifications.png')
                  }
                />
              </TouchableOpacity>

              <ButtonCoins
                title={coinsStored}
                font={global.fontSelect}
                onPress={() => navigation.navigate('AddCoins')}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                backgroundColor: global.tabColor,
                width: '93%',
                height: 60,
                alignSelf: 'center',
                borderRadius: 30,
                marginBottom: 20,
              }}>
              <TouchableOpacity
                onPress={() => selectTab(1)}
                style={{width: '33%'}}>
                {/* <View style={{ height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}> */}
                <LinearGradient
                  colors={[btncolor1_1, btncolor1_2]}
                  style={{
                    height: 60,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    borderRadius: 30,
                  }}>
                  <Text
                    style={{color: txtcolor1, fontFamily: global.fontSelect}}>
                    Following
                  </Text>
                </LinearGradient>
                {/* </View> */}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => selectTab(2)}
                style={{width: '34%'}}>
                {/* <View style={{ height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}> */}
                <LinearGradient
                  colors={[btncolor2_1, btncolor2_2]}
                  style={{
                    height: 60,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    borderRadius: 30,
                  }}>
                  <Text
                    style={{color: txtcolor2, fontFamily: global.fontSelect}}>
                    New Memes
                  </Text>
                </LinearGradient>
                {/* </View> */}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => selectTab(3)}
                style={{width: '33%'}}>
                {/* <View style={{ height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}> */}
                <LinearGradient
                  colors={[btncolor3_1, btncolor3_2]}
                  style={{
                    height: 60,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    borderRadius: 30,
                  }}>
                  <Text
                    style={{color: txtcolor3, fontFamily: global.fontSelect}}>
                    Trending
                  </Text>
                </LinearGradient>
                {/* </View> */}
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', marginBottom: 25}}>
              {!loadingStoriesItems ? (
                stories.length > 0 ? (
                  <Story
                    stories={stories}
                    duration={5}
                    deleteStory={story_id => deleteStory(story_id)}
                    reloadStory={fetchStories}
                    updateOffset={(offset, page, limit) =>
                      updateStoryOffset(offset, page, limit)
                    }
                    storyOffset={storyOffset}
                    storyPage={storyPage}
                    storyLimit={storyLimit}
                    setAddStoryModalVisible={setAddStoryModalVisible}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => setAddStoryModalVisible(true)}>
                    <View
                      style={{
                        backgroundColor: global.colorSecondary,
                        height: 160,
                        width: 115,
                        borderRadius: 15,
                        marginLeft: 5,
                      }}>
                      <View style={{flex: 2.5, flexDirection: 'column'}}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                          <Text
                            style={{
                              color: 'white',
                              textAlign: 'center',
                              fontSize: 16,
                              fontWeight: 'normal',
                            }}>
                            Add story
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}>
                        <TouchableOpacity
                          onPress={() => setAddStoryModalVisible(true)}>
                          <Image
                            style={{width: 35, height: 35, borderRadius: 50}}
                            source={{uri: global.userData.imgurl}}
                          />
                          <Icon
                            name="pluscircle"
                            size={20}
                            color="#4267B2"
                            style={{
                              position: 'absolute',
                              right: -2,
                              bottom: -2,
                              backgroundColor: 'white',
                              fontWeight: 'bold',
                              borderRadius: 100,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={{marginBottom: 5, marginTop: 10}}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: 'white',
                            fontSize: 16,
                          }}>
                          You
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              ) : (
                <StorySkeleton />
              )}
            </View>
          </View>
        )}
      />

      {loadingNewStory && (
        <ActivityIndicator
          size="large"
          color={global.colorTextActive}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      )}

      {/* Modal for add story */}

      <Modal2
        // animationType='slide'
        // transparent={true}
        // visible={addStoryModalVisible}
        style={{
          flex: 1,
          height: Dimensions.get('window').height,
          width: Dimensions.get('window').width,
        }}
        isOpen={addStoryModalVisible}
        onClosed={() => setAddStoryModalVisible(false)}
        position="center"
        coverScreen={true}
        transparent={true}>
        <View
          style={{
            backgroundColor: '#201E23',
            flex: 1,
          }}>
          {!file && (
            <View
              style={{
                flex: 1,
                height: '100%',
                width: '100%',
              }}>
              <View style={{flexDirection: 'row-reverse'}}>
                <View>
                  <TouchableOpacity onPress={() => cancelStoryModal()}>
                    {loadingAddStory ? (
                      <ActivityIndicator
                        size="small"
                        color="white"
                        style={{paddingRight: 15, paddingTop: 15}}
                      />
                    ) : (
                      <Text
                        style={{
                          paddingRight: 15,
                          paddingTop: 15,
                          color: 'white',
                          fontSize: 16,
                        }}>
                        Cancel
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              {!file && !isOpenMedia ? (
                <View style={styles.centeredView}>
                  <View>
                    <TouchableOpacity
                      disabled={isOpenMedia}
                      style={{marginBottom: '8%'}}
                      onPress={() => openCamera()}>
                      <Text
                        style={{
                          color: '#fff',
                          opacity: 0.5,
                          fontSize: 16,
                        }}>
                        Take photo...
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={isOpenMedia}
                      style={{marginBottom: '6%'}}
                      onPress={() => openGallery()}>
                      <Text style={{color: '#fff', opacity: 0.5, fontSize: 16}}>
                        Choose photo from library...
                      </Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                      style={{marginBottom: '6%'}}
                      onPress={async () => {
                        setIsOpenMedia(true);
                        if (Platform.OS === 'android') {
                          getAndroidExportResult()
                            .then(videoUri => {
                              setFile({type: 'video', uri: videoUri});
                            })
                            .catch(e => {
                              console.error('error', e);
                            });
                        } else {
                          const videoUri = await openVideoEditor();
                          console.log('videoUri',videoUri);
                        }
                        setIsOpenMedia(false);
                      }}>
                      <Text style={{color: '#fff', opacity: 0.5, fontSize: 16}}>
                        Select Video
                      </Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                      disabled={isOpenMedia}
                      style={[{marginTop: '20%'}]}
                      onPress={() => setAddStoryModalVisible(false)}>
                      <LinearGradient
                        colors={[global.btnColor1, global.btnColor2]}
                        style={{
                          paddingHorizontal: 27,
                          paddingVertical: 15,
                          justifyContent: 'center',
                          alignSelf: 'center',
                          borderRadius: 22,
                        }}>
                        <Text
                          style={[styles.modalText, {color: global.btnTxt}]}>
                          Cancel
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <ActivityIndicator
                  size="small"
                  color={global.colorTextActive}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
              )}
            </View>
          )}
          {file && file.type === 'photo' && (
            <ImageBackground
              source={{uri: file && file.uri}}
              resizeMode="contain"
              imageStyle={{
                flex: 1,
                height: '100%',
                width: '100%',
              }}
              style={{
                flex: 1,
                height: '100%',
                width: '100%',
              }}>
              <View style={{flexDirection: 'row-reverse'}}>
                <View>
                  <TouchableOpacity onPress={() => cancelStoryModal()}>
                    {loadingAddStory ? (
                      <ActivityIndicator
                        size="small"
                        color="white"
                        style={{paddingRight: 15, paddingTop: 15}}
                      />
                    ) : (
                      <Text
                        style={{
                          paddingRight: 15,
                          paddingTop: 15,
                          color: 'white',
                          fontSize: 16,
                        }}>
                        Cancel
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              {!file && (
                <View style={styles.centeredView}>
                  <View>
                    <TouchableOpacity
                      disabled={isOpenMedia}
                      style={{marginBottom: '8%'}}
                      onPress={() => openCamera()}>
                      <Text
                        style={{
                          color: '#fff',
                          opacity: 0.5,
                          fontSize: 16,
                        }}>
                        Take photo...
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={isOpenMedia}
                      style={{marginBottom: '6%'}}
                      onPress={() => openGallery()}>
                      <Text style={{color: '#fff', opacity: 0.5, fontSize: 16}}>
                        Choose from library...
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={isOpenMedia}
                      style={[{marginTop: '20%'}]}
                      onPress={() => setAddStoryModalVisible(false)}>
                      <LinearGradient
                        colors={[global.btnColor1, global.btnColor2]}
                        style={{
                          paddingHorizontal: 27,
                          paddingVertical: 15,
                          justifyContent: 'center',
                          alignSelf: 'center',
                          borderRadius: 22,
                        }}>
                        <Text
                          style={[styles.modalText, {color: global.btnTxt}]}>
                          Cancel
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {file && file.type === 'photo' && (
                <View style={{flex: 1}}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                    }}>
                    <View
                      style={{
                        justifyContent: 'flex-end',
                        flexDirection: 'row',
                        marginBottom: 35,
                        marginRight: 25,
                      }}>
                      {!loadingAddStory && (
                        <TouchableOpacity
                          style={[{marginTop: '20%'}]}
                          onPress={() => uploadImageToS3()}>
                          <LinearGradient
                            colors={[global.btnColor1, global.btnColor2]}
                            style={{
                              paddingHorizontal: 27,
                              paddingVertical: 15,
                              justifyContent: 'center',
                              alignSelf: 'center',
                              borderRadius: 22,
                            }}>
                            <Text
                              style={[
                                styles.modalText,
                                {color: global.btnTxt},
                              ]}>
                              <Icon name="plus" color="black" /> Add story
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              )}
            </ImageBackground>
          )}
          {file && file.type === 'video' && (
            <View style={{flex: 1}}>
              <View>
                <Video
                  repeat
                  source={{uri: file.uri}}
                  resizeMode="contain"
                  style={{
                    height: windowHeight,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                  }}
                />
              </View>
              <View style={{flexDirection: 'row-reverse'}}>
                <TouchableOpacity onPress={() => cancelStoryModal()}>
                  {loadingAddStory ? (
                    <ActivityIndicator
                      size="small"
                      color="white"
                      style={{paddingRight: 15, paddingTop: 15}}
                    />
                  ) : (
                    <Text
                      style={{
                        paddingRight: 15,
                        paddingTop: 15,
                        color: 'white',
                        fontSize: 16,
                      }}>
                      Cancel
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              <View style={{flex: 1}}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                  }}>
                  <View
                    style={{
                      justifyContent: 'flex-end',
                      flexDirection: 'row',
                      marginBottom: 35,
                      marginRight: 25,
                    }}>
                    {!loadingAddStory && (
                      <TouchableOpacity
                        style={[{marginTop: '20%'}]}
                        onPress={() => uploadImageToS3()}>
                        <LinearGradient
                          colors={[global.btnColor1, global.btnColor2]}
                          style={{
                            paddingHorizontal: 27,
                            paddingVertical: 15,
                            justifyContent: 'center',
                            alignSelf: 'center',
                            borderRadius: 22,
                          }}>
                          <Text
                            style={[styles.modalText, {color: global.btnTxt}]}>
                            <Icon name="plus" color="black" /> Add story
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </Modal2>

      {/* End of Modal add story */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.modalText, {fontFamily: global.fontSelect}]}>
              Are you sure you want to delete this Meme?
            </Text>

            <View style={{flexDirection: 'row', marginTop: 25}}>
              <TouchableOpacity
                style={[styles.button, styles.buttonOpen]}
                onPress={() => deleteMemeeFN()}>
                <LinearGradient
                  colors={[global.btnColor1, global.btnColor2]}
                  style={{
                    paddingHorizontal: 25,
                    paddingVertical: 15,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderRadius: 25,
                  }}>
                  <Text
                    style={[
                      styles.textStyle,
                      {color: global.btnTxt, fontFamily: global.fontSelect},
                    ]}>
                    Delete
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <LinearGradient
                  colors={['#fefefe', '#868686']}
                  style={{
                    paddingHorizontal: 25,
                    paddingVertical: 15,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderRadius: 25,
                  }}>
                  <Text
                    style={[styles.textStyle, {fontFamily: global.fontSelect}]}>
                    Cancel
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNavBar
        onPress={index => activeTab(index)}
        themeIndex={ImageBottoms}
        navigation={navigation}
        navIndex={0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    color: '#E6E6E6',
    marginBottom: 15,
  },

  tinyLogo: {
    width: 30,
    height: 30,
    marginTop: 10,
    marginRight: 10,
    tintColor: '#222222',
    alignSelf: 'flex-end',
  },

  Logo: {
    width: 350,
    height: 350,
    marginTop: 10,
    alignSelf: 'center',
  },
  topView: {
    width: '100%',
    height: 85,
    // backgroundColor: '#ffffff',
    paddingTop: 15,
    paddingLeft: 12,
    flexDirection: 'row',
  },

  image: {
    height: 380,
    width: '100%',
    resizeMode: 'stretch',
    // justifyContent: "center"
  },
  text: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000a0',
  },

  // Modal style
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '36%',
  },
  modalView: {
    margin: 20,
    borderColor: '#FBC848',
    borderWidth: 1,
    width: '80%',
    backgroundColor: '#201E23',
    borderRadius: 20,
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
    borderRadius: 25,
    elevation: 2,
    marginRight: '1%',
    marginTop: '1%',
  },
  buttonOpen: {
    backgroundColor: '#FBC848',
  },
  buttonClose: {
    marginLeft: 15,
    backgroundColor: '#868686',
  },
  textStyle: {
    color: '#000',
    textAlign: 'center',
    fontSize: 15,
  },
  modalText: {
    marginBottom: 0,
    marginTop: 5,
    textAlign: 'center',
    color: '#ffffff',
  },
  txtReaction: {
    fontSize: 20,
    marginLeft: 3,
  },

  // bottom tab design
  bottom: {
    backgroundColor: '#272727',
    flexDirection: 'row',
    height: 80,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  first: {
    // backgroundColor: '#ffffff',
    width: '17.5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forth: {
    // backgroundColor: '#ffffff',
    width: '22%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  third: {
    // backgroundColor: '#000000',
    width: '26%',
    justifyContent: 'center',
  },

  tinyLogo: {
    width: 30,
    height: 30,
  },
  tinyLogoOB: {
    width: 80,
    height: 80,
    // tintColor: '#000000'
    marginTop: -20,
  },
  tinyLogothird: {
    width: 60,
    height: 60,
    tintColor: '#FBC848',
    marginTop: -27,
  },
  touchstyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txticon: {
    color: '#FBC848',
    fontSize: 11,
  },
  ovalBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDD368',
    width: 65,
    height: 65,
    borderRadius: 40,
    marginTop: -40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    elevation: 16,
  },

  // modal CSS new post
  centeredViewNewPost: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '6%',
  },
  modalViewNewPost: {
    margin: 20,
    // borderColor: '#FBC848',
    // borderWidth: 1,
    backgroundColor: '#201E23',
    borderRadius: 15,
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
  modalViewImgPickerNewPost: {
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
  modalViewbioNewPost: {
    margin: 20,
    // borderColor: '#FBC848',
    // borderWidth: 1,
    backgroundColor: '#201E23',
    width: '70%',
    height: 270,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    justifyContent: 'space-evenly',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonNewPost: {
    borderRadius: 25,

    elevation: 2,
    marginRight: '1%',
    marginTop: '1%',
  },
  buttonOpenNewPost: {
    backgroundColor: '#FBC848',
    alignSelf: 'center',
  },
  buttonCloseNewPost: {
    backgroundColor: '#0B0213',
  },
  textStyleNewPost: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  modalTextNewPost: {
    marginBottom: 0,
    marginTop: 0,
    textAlign: 'center',
  },
  videoContainer: {flex: 1, justifyContent: 'center'},
  backgroundVideo: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0,
    width: '100%',
    height: 500,
  },
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
});
    