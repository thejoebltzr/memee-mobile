import React, {Component} from 'react';
// import { useState } from 'react';
import {
  View,
  Text,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ImageBackground,
  ViewBase,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import TwitterTextView from 'react-native-twitter-textview';
import LinearGradient from 'react-native-linear-gradient';
import {currentDateFN} from '../../Utility/Utils';

var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;

export default class ExploreDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PostData: [],
      selectedPostState: '',
      defaultHeartColor: '#89789A',
      heartColor: '#EC1C1C',
    };
  }

  async componentDidMount() {
    const [width, height] = await this.getImageSize(
      global.selectedPost.PostImage,
    );
    const ratio = windowWidth / width;
    global.selectedPost.calHeight = height * ratio;
    this.setState({
      PostData: global.remainingPost,
      selectedPostState: global.selectedPost,
    });
  }

  async slectPostFN(index) {
    var previousSelected = this.state.selectedPostState;

    // selected post storing in state
    var currentSelected = this.state.PostData[index];
    var requesrArr = this.state.PostData;
    requesrArr.splice(index, 1);
    this.setState({
      PostData: requesrArr,
    });

    this.state.PostData.push(previousSelected);
    const [width, height] = await this.getImageSize(currentSelected.PostImage);
    const ratio = windowWidth / width;
    currentSelected.calHeight = height * ratio;

    this.setState({
      selectedPostState: currentSelected,
    });

    // slected post Deleting from array state
  }

  likeOrUnlikeFN() {
    var postID = this.state.selectedPostState.post_id;
    var likeOrUnlikeApi = '';
    var arrayTemp = '';

    if (this.state.selectedPostState.IsLiked == 1) {
      likeOrUnlikeApi = 'UnLikePost';
    } else {
      likeOrUnlikeApi = 'LikePost';
    }

    var arrayTemp = this.state.selectedPostState;

    if (arrayTemp.IsLiked == 0) {
      arrayTemp.IsLiked = 1;
      arrayTemp.PostLikeCount = parseInt(arrayTemp.PostLikeCount) + 1;
    } else {
      arrayTemp.IsLiked = 0;
      arrayTemp.PostLikeCount = parseInt(arrayTemp.PostLikeCount) - 1;
    }

    this.setState({
      selectedPostState: arrayTemp,
    });

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
      .then(responseJson => {})
      .catch(error => {
        console.error(error);
      });
  }

  navigateToComment() {
    global.postId = this.state.selectedPostState.post_id;
    this.props.navigation.navigate('CommentScreen');
  }

  getImageSize = async uri =>
    new Promise(resolve => {
      Image.getSize(uri, (width, height) => {
        resolve([width, height]);
      });
    });

  navigateToProfile(navigation, user) {
    global.profileID = user.UserId;
    navigation.navigate('ProfileScreen');
  }

  sharePostFN() {
    global.sharePost = this.state.selectedPostState;
    global.sharePost.img_url = global.sharePost.PostImage;
    this.props.navigation.navigate('SharePost');
  }

  render() {
    const {navigation} = this.props;

    return (
      <View style={{flex: 1, backgroundColor: global.colorPrimary}}>
        <ScrollView>
          <ImageBackground
            style={{
              width: windowWidth,
              height: this.state.selectedPostState.calHeight
                ? this.state.selectedPostState.calHeight
                : windowWidth,
            }}
            resizeMode="contain"
            source={{uri: this.state.selectedPostState.PostImage}}>
            <LinearGradient
              colors={[global.overlay1, global.overlay3]}
              style={{
                width: windowWidth,
                height: this.state.selectedPostState.calHeight
                  ? this.state.selectedPostState.calHeight
                  : windowWidth,
              }}></LinearGradient>
          </ImageBackground>

          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={{position: 'absolute', top: 30, left: 18}}>
            <View
              style={{
                backgroundColor: '#000',
                height: 45,
                width: 45,
                justifyContent: 'center',
                borderRadius: 45,
                opacity: 0.5,
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

          <View
            style={{
              opacity: 0.5,
              backgroundColor: '#fff',
              height: 45,
              paddingHorizontal: 20,
              alignSelf: 'center',
              justifyContent: 'center',
              borderRadius: 20,
              position: 'absolute',
              top: 30,
            }}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 15,
                fontFamily: global.fontSelect,
              }}>
              #{global.tagName}
            </Text>
          </View>

          <ImageBackground
            source={global.postInteractionsBG}
            resizeMode="stretch"
            style={{
              flexDirection: 'row',
              width: windowWidth - (windowWidth * 25) / 100,
              marginLeft: '0%',
              marginTop: 10,
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
              {this.state.selectedPostState.IsLiked == 0 ? (
                <TouchableOpacity onPress={() => this.likeOrUnlikeFN()}>
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
                <TouchableOpacity onPress={() => this.likeOrUnlikeFN()}>
                  <View>
                    <Image
                      style={{
                        height: 28,
                        width: 28,
                        marginLeft: 10,
                        marginRight: 2,
                        tintColor: this.state.heartColor,
                      }}
                      resizeMode="stretch"
                      source={require('../../images/Vector.png')}
                    />
                  </View>
                </TouchableOpacity>
              )}
              <Text style={{fontFamily: global.fontSelect, color: global.postInteractionsTextColor}}>
                {this.state.selectedPostState.PostLikeCount}
              </Text>
            </View>

            <View
              style={{
                width: '40%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={() => this.navigateToComment()}>
                <Image
                  style={{
                    height: 28,
                    width: 28,
                    marginLeft: 10,
                    marginRight: 2,
                    tintColor: global.postInteractionsTextColor
                  }}
                  resizeMode="stretch"
                  source={require('../../images/sms.png')}
                />
              </TouchableOpacity>
              <Text style={{fontFamily: global.fontSelect, color: global.postInteractionsTextColor}}>
                {this.state.selectedPostState.PostCommentCount}
              </Text>
            </View>

            <View
              style={{
                width: '32%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={() => this.sharePostFN()}>
                <Image
                  style={{
                    height: 28,
                    width: 28,
                    marginLeft: 10,
                    marginRight: 2,
                    tintColor: global.postInteractionsTextColor
                  }}
                  resizeMode="stretch"
                  source={require('../../images/share.png')}
                />
              </TouchableOpacity>
              <Text style={{fontFamily: global.fontSelect, color: global.postInteractionsTextColor}}>
                {this.state.selectedPostState.PostShareCount}
              </Text>
            </View>
          </ImageBackground>

          <View style={{flexDirection: 'row', marginLeft: 10, marginTop: 13}}>
            <TouchableOpacity
              style={{
                borderColor: '#fff',
                borderWidth: 1,
                borderRadius: 20,
                height: 36,
              }}
              onPress={() =>
                this.navigateToProfile(navigation, this.state.selectedPostState)
              }>
              <Avatar
                rounded
                size="small"
                source={
                  {uri: this.state.selectedPostState.UserImage}
                  // require("../../images/image19.png")
                }
              />
            </TouchableOpacity>

            <Text
              style={{
                color: global.colorTextPrimary,
                marginTop: 10,
                marginLeft: 4,
                fontFamily: global.fontSelect,
                fontWeight: 'bold',
              }}>
              {this.state.selectedPostState.UserName}
            </Text>
            <TwitterTextView
              onPressHashtag={() => {}}
              hashtagStyle={{color: global.colorTextActive}}
              style={{
                color: global.colorTextPrimary,
                marginLeft: 8,
                marginTop: 10,
              }}>
              {this.state.selectedPostState.PostDescription}
            </TwitterTextView>
          </View>

          {this.state.PostData != '' ? (
            <View
              style={{
                width: '100%',
                backgroundColor: global.colorSecondary,
                marginTop: 25,
                paddingBottom: 25,
              }}>
              <Text
                style={{
                  fontFamily: global.fontSelect,
                  color: global.colorTextPrimary,
                  alignSelf: 'center',
                  marginTop: 20,
                  marginBottom: 20,
                  fontSize: 17,
                  fontWeight: 'bold',
                }}>
                More like this
              </Text>

              <FlatList
                // horizontal={true}
                numColumns={2}
                data={this.state.PostData}
                renderItem={({item, index}) => (
                  <View
                    style={{
                      width: '48%',
                      borderWidth: 6,
                      borderColor: global.colorSecondary,
                    }}>
                    <TouchableOpacity onPress={() => this.slectPostFN(index)}>
                      <Image
                        style={{width: '100%', height: 180, borderRadius: 20}}
                        resizeMode="cover"
                        source={{uri: item.PostImage}}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={item => item.post_id}
                style={{borderRadius: 100, marginTop: 10, marginLeft: 10}}
              />
            </View>
          ) : null}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topView: {
    width: '100%',
    height: 85,
    paddingTop: 15,
    paddingLeft: 12,
    flexDirection: 'row',
  },
});
