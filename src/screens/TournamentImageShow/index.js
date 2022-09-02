import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import TwitterTextView from 'react-native-twitter-textview';
import LinearGradient from 'react-native-linear-gradient';
import {currentDateFN} from '../../Utility/Utils';

var windowWidth = Dimensions.get('window').width;

const TournamentImageShow = ({navigation, route}) => {
  //let post = route.params?.post;
  const [selectedPostState, setSelectedPostState] = useState('');
  /* const [defaultHeartColor, setDefaultHeartColor] = useState('#89789A');
  const [heartColor, setHeartColor] = useState('#EC1C1C');
  const [calHeight, setCalHeight] = useState(null); */

  const getImageSize = async uri =>
    new Promise(resolve => {
      Image.getSize(uri, (width, height) => {
        resolve([width, height]);
      });
    });

  const setImageSize = async posts => {
    //console.log(posts);
    let tempPost = posts;
    const [width, height] = await getImageSize(tempPost.img_url);
    const ratio = windowWidth / width;
    tempPost.calHeight = height * ratio;
    console.log(tempPost);
    setSelectedPostState(tempPost);
  };

  const likeOrUnlikeFN = () => {
    var postID = selectedPostState.post_id;

    var likeOrUnlikeApi = '';
    var arrayTemp = '';

    if (selectedPostState.IsLiked == 1) {
      likeOrUnlikeApi = 'UnLikePost';
    } else {
      likeOrUnlikeApi = 'LikePost';
    }

    var arrayTemp = selectedPostState;

    if (arrayTemp.IsLiked == 0) {
      arrayTemp.IsLiked = 1;
      arrayTemp.like_count = parseInt(arrayTemp.like_count) + 1;
    } else {
      arrayTemp.IsLiked = 0;
      arrayTemp.like_count = parseInt(arrayTemp.like_count) - 1;
    }

    setSelectedPostState(arrayTemp);

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
    })
      .then(response => response.json())
      .then(responseJson => {
        /* console.log(responseJson); */
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (route.params?.post) {
      setImageSize(route.params?.post);
    } else {
      navigation.goBack();
    }
  }, [route.params?.post]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: global.colorPrimary,
        marginBottom: -30,
      }}>
      <ScrollView style={{marginBottom: 40}}>
        <View
          style={{flexDirection: 'row', paddingLeft: '5%', paddingTop: '5%'}}>
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
              fontFamily: global.fontSelect,
            }}>
            {' '}
            Details
          </Text>
        </View>
        <Image
          style={{
            width: '100%',
            height: selectedPostState.calHeight,
          }}
          resizeMode="stretch"
          source={{uri: selectedPostState.img_url}}></Image>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 15,
          }}>
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: 10,
              borderRadius: 25,
              paddingHorizontal: 25,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{width: 13, height: 13, marginHorizontal: 5}}
              source={require('../../images/hertGreen.png')}
            />
            <Text style={{color: '#00A344', fontSize: 22}}>
              {selectedPostState.up_vote}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: 10,
              borderRadius: 25,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 10,
              paddingHorizontal: 25,
            }}>
            <Image
              style={{width: 13, height: 13, marginHorizontal: 5}}
              source={require('../../images/xRed.png')}
            />
            <Text style={{color: '#F44336', fontSize: 22}}>
              {selectedPostState.down_vote}
            </Text>
          </View>
        </View>
        <View style={{margin: 50}}></View>
      </ScrollView>
    </View>
  );
};

export default TournamentImageShow;

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
});
