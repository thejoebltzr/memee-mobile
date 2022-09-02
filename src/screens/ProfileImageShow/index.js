import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  Modal,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import TwitterTextView from 'react-native-twitter-textview';
import LinearGradient from 'react-native-linear-gradient';
import {currentDateFN} from '../../Utility/Utils';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import Toast from 'react-native-toast-message';

var windowWidth = Dimensions.get('window').width;

const index = ({navigation}) => {
  const [selectedPostState, setSelectedPostState] = useState(
    global.selectedPost,
  );
  const [defaultHeartColor, setDefaultHeartColor] = useState('#89789A');
  const [heartColor, setHeartColor] = useState('#EC1C1C');
  const [videoHeight, setVideoHeight] = useState(400);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  function deleteMemeeFN() {
    setModalVisible(false);

    fetch(global.address + 'DeletePost/' + selectedPostState.post_id, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        navigation.goBack();
        global.refresh = true;
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text2: 'Please check your internet connection.',
        });
        console.error(error);
      });
  }

  const getImageSize = async uri =>
    new Promise(resolve => {
      Image.getSize(uri, (width, height) => {
        resolve([width, height]);
      });
    });

  const getDescription = text => {
    try {
      return decodeURIComponent(
        JSON.parse('"' + text.replace(/\"/g, '\\"') + '"'),
      );
    } catch (err) {
      return text;
    }
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

    var arrayTemp = {...selectedPostState};

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

  const navigateToComment = () => {
    global.postId = selectedPostState.post_id;

    navigation.navigate('CommentScreen');
  };

  const sharePostFN = () => {
    /* console.log( selectedPostState); */

    global.sharePost = selectedPostState;
    navigation.navigate('SharePost');
  };

  const setUpData = async () => {
    var data = global.selectedPost;
    if (!data.img_url.includes('mp4')) {
      const [width, height] = await getImageSize(data.img_url);
      const ratio = windowWidth / width;
      data.calHeight = height * ratio;
    }
    setSelectedPostState(data);
    //console.log(data);
  };

  useEffect(() => {
    setUpData();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: global.colorPrimary,
        marginBottom: -30,
      }}>
      <ScrollView style={{marginBottom: 40}}>
        {selectedPostState.img_url.includes('mp4') ? (
          <View key={selectedPostState.img_url}>
            <VideoPlayer
              key={selectedPostState.post_id}
              source={{uri: selectedPostState.img_url}}
              disableFullscreen
              disableBack
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
            style={{
              width: '100%',
              height: selectedPostState?.calHeight || 500,
            }}
            resizeMode="stretch"
            source={{uri: selectedPostState.img_url}}>
            <LinearGradient
              colors={[global.overlay1, global.overlay3]}
              style={{
                height: selectedPostState.calHeight,
                width: '100%',
              }}
            />
          </ImageBackground>
        )}

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{position: 'absolute', top: 30, left: 18}}>
          <View
            style={{
              opacity: 0.5,
              backgroundColor: '#000',
              height: 45,
              width: 45,
              justifyContent: 'center',
              borderRadius: 45,
            }}>
            <Image
              style={{
                height: 20,
                width: 20,
                tintColor: '#fff',
                alignSelf: 'center',
                marginRight: 5,
              }}
              resizeMode="stretch"
              source={require('../../images/back1.png')}
            />
          </View>
        </TouchableOpacity>

        <ImageBackground
          source={require('../../images/Rectangle.png')}
          resizeMode="stretch"
          style={{
            flexDirection: 'row',
            width: '85%',
            marginLeft: '11%',
            marginTop: 10,
            height: 80,
            borderRadius: 40,
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: '28%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {selectedPostState.IsLiked == 0 ? (
              <TouchableOpacity onPress={() => likeOrUnlikeFN()}>
                <View>
                  <Image
                    style={{
                      height: 28,
                      width: 28,
                      marginLeft: 10,
                      marginRight: 2,
                      tintColor: defaultHeartColor,
                    }}
                    resizeMode="stretch"
                    source={require('../../images/Vector.png')}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => likeOrUnlikeFN()}>
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
            <Text style={{fontFamily: global.fontSelect}}>
              {selectedPostState.like_count}
            </Text>
          </View>

          <View
            style={{
              width: '28%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => navigateToComment()}>
              <Image
                style={{
                  height: 28,
                  width: 28,
                  marginLeft: 10,
                  marginRight: 2,
                }}
                resizeMode="stretch"
                source={require('../../images/sms.png')}
              />
            </TouchableOpacity>
            <Text style={{fontFamily: global.fontSelect}}>
              {selectedPostState.comment_count}
            </Text>
          </View>

          <View
            style={{
              width: '28%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => sharePostFN()}>
              <Image
                style={{
                  height: 28,
                  width: 28,
                  marginLeft: 10,
                  marginRight: 2,
                }}
                resizeMode="stretch"
                source={require('../../images/share.png')}
              />
            </TouchableOpacity>
            <Text style={{fontFamily: global.fontSelect}}>
              {selectedPostState.share_count}
            </Text>
          </View>
        </ImageBackground>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
            justifyContent: 'space-between',
            maxWidth: windowWidth,
          }}>
          <View style={{flexDirection: 'row', maxWidth: windowWidth - 120}}>
            <View style={{marginHorizontal: 10}}>
              <Avatar
                rounded
                size="small"
                source={{uri: selectedPostState.UserImage}}
              />
            </View>

            <View>
              <Text
                style={{
                  fontFamily: global.fontSelect,
                  color: global.colorTextPrimary,
                  fontWeight: 'bold',
                }}>
                {selectedPostState.UserName}
              </Text>
              <TwitterTextView
                onPressHashtag={() => {}}
                hashtagStyle={{color: global.colorTextActive}}
                style={{
                  color: global.colorTextPrimary,
                }}>
                {getDescription(selectedPostState.description)}
              </TwitterTextView>
            </View>
          </View>
          {global.userData.user_id == global.profileID && (
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{
                marginHorizontal: 10,
                borderRadius: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: 10,
                width: 40,
                height: 40,
              }}>
              <Image
                source={require('../../images/delete.png')}
                resizeMode="contain"
                style={{tintColor: global.colorIcon, width: 20, height: 20}}
              />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

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
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  topView: {
    width: '100%',
    height: 85,
    paddingTop: 15,
    paddingLeft: 12,
    flexDirection: 'row',
  },
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
