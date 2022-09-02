import React, {Component} from 'react';
// import { useState } from 'react';
import {
  View,
  Text,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  MaskedViewIOS,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ImageBackground,
  ViewBase,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

global.navigateExpDetail = -1;
var checkNavi = 0;
var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;
export default class TrendingPostExplore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PostData: [],
      hashTags: [],
      activityIndicateHandle: false,
    };
  }

  componentDidMount() {
    /* console.log('getting summoned'); */

    this.getTrendingTagsFN();

    if (global.navigateExpDetail == -1) {
      checkNavi = 0;
    } else {
      checkNavi = global.navigateExpDetail;
    }
    // this.getTrendingTagsFN();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // do something
      if (global.navigateExpDetail == -1) {
        checkNavi = 0;
      } else {
        checkNavi = global.navigateExpDetail;
      }
      // this.getTrendingTagsFN();
    });
  }

  getTrendingTagsFN() {
    this.setState({
      activityIndicateHandle: true,
    });
    fetch(global.address + 'GetTrendingTagsList', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
      body: JSON.stringify({}),
    })
      .then(response => response.json())
      .then(responseJson => {
        /*  console.log('\n\n\n responseJson now', responseJson); */

        responseJson.TrendingTags.forEach(function (element) {
          element.color = '#fff';
          element.txtClr = '#fff';
          element.color1 = '#fff';
        });

        this.setState({
          hashTags: responseJson.TrendingTags,
        });
        this.tagChangeFN(checkNavi);
      })
      .catch(error => {
        console.error(error);
      });
  }

  getPostsAgainstTag(tag_id) {
    fetch(global.address + 'GetPostsByTag/' + tag_id, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          PostData: responseJson.Posts,
        });
        this.setState({
          activityIndicateHandle: false,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  tagChangeFN(index) {
    global.navigateExpDetail = index;
    var tagArray = this.state.hashTags;
    for (let i = 0; i < this.state.hashTags.length; i++) {
      if (i == index) {
        tagArray[i].color = global.selectedTagsColor1;
        tagArray[i].color1 = global.selectedTagsColor2;
        tagArray[i].txtClr = global.selectedTagText;
      } else {
        tagArray[i].color = global.notSelectedTagsColor1;
        tagArray[i].color1 = global.notSelectedTagsColor2;
        tagArray[i].txtClr = global.notSelectedTagText;
      }
    }
    this.setState({
      hashTags: tagArray,
    });
    global.tagName = this.state.hashTags[index].tag_id;
    this.getPostsAgainstTag(this.state.hashTags[index].tag_id);
  }

  navigateToExpDetailFN(index) {
    /* console.log(' this.state.PostData[index] : ', this.state.PostData);
    console.log(' this.state.PostData[index] : ', index); */

    global.selectedPost = this.state.PostData[index];
    var requesrArr = this.state.PostData.slice();
    requesrArr.splice(index, 1);
    global.remainingPost = requesrArr;
    this.props.navigation.navigate('ExploreDetail');
  }

  render() {
    const {navigation} = this.props;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: global.colorPrimary,
          marginBottom: 15,
        }}>
        <Text
          style={{
            color: global.colorTextPrimary,
            marginLeft: '4%',
            marginTop: 15,
            fontFamily: global.fontSelect,
          }}>
          Trending Tags
        </Text>

        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={this.state.hashTags}
          renderItem={({item, index}) => (
            <TouchableOpacity onPress={() => this.tagChangeFN(index)}>
              <LinearGradient
                colors={[item.color1, item.color]}
                style={{
                  marginLeft: 10,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderRadius: 22,
                }}>
                <View
                  style={{
                    paddingHorizontal: 16,
                    borderWidth: 1,
                    borderColor: global.tagsBorderColor,
                    borderRadius: 22,
                    paddingVertical: 10,
                  }}>
                  <Text
                    style={{color: item.txtClr, fontFamily: global.fontSelect}}>
                    #{item.tag_id}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          style={{borderRadius: 100, marginTop: 10, marginRight: 5}}
        />

        {this.state.activityIndicateHandle == true ? (
          <View
            style={{
              height: (windowHeight * 60) / 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator
              size="large"
              color={global.colorTextActive}
              style={{alignSelf: 'center'}}
            />
          </View>
        ) : (
          <View flexDirection="row" style={{width: '100%'}}>
            <FlatList
              data={this.state.PostData.slice(
                0,
                Math.ceil(this.state.PostData.length / 2),
              )}
              renderItem={({item, index}) => (
                <View style={{borderWidth: 0, borderRadius: 30}}>
                  <TouchableOpacity
                    onPress={() => this.navigateToExpDetailFN(index)}>
                    <ImageBackground
                      source={{uri: item.PostImage}}
                      resizeMode="stretch"
                      style={{
                        width: '95%',
                        height: 160 + Math.floor(Math.random() * 3) * 40,
                        margin: 10,
                      }}
                      /* resizeMode="cover" */
                      imageStyle={{borderRadius: 25}}>
                      <LinearGradient
                        colors={[global.overlay1, global.overlay3]}
                        style={{
                          width: '95%',
                          height: '100%',
                          borderRadius: 25,
                        }}></LinearGradient>

                      <View
                        style={{
                          flexDirection: 'row',
                          width: '70%',
                          height: 40,
                          position: 'absolute',
                          bottom: 20,
                        }}>
                        <View
                          style={{
                            borderColor: '#fff',
                            borderWidth: 1,
                            borderRadius: 20,
                            height: 36,
                            marginLeft: 20,
                          }}>
                          <Avatar
                            rounded
                            size="small"
                            source={{uri: item.UserImage}}
                          />
                        </View>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 11,
                            marginLeft: 5,
                            alignSelf: 'center',
                            fontFamily: global.fontSelect,
                          }}>
                          {item.UserName}
                        </Text>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={item => item.post_id}
              style={{borderRadius: 100}}
            />
            <FlatList
              data={this.state.PostData.slice(
                Math.ceil(this.state.PostData.length / 2),
                this.state.PostData.length,
              )}
              renderItem={({item, index}) => (
                <View style={{borderWidth: 0, borderRadius: 30}}>
                  <TouchableOpacity
                    onPress={() =>
                      this.navigateToExpDetailFN(
                        Math.ceil(this.state.PostData.length / 2) + index,
                      )
                    }>
                    <ImageBackground
                      source={{uri: item.PostImage}}
                      resizeMode="stretch"
                      style={{
                        width: '95%',
                        height: 200 + Math.floor(Math.random() * 3) * 20,
                        margin: 10,
                      }}
                      /* resizeMode="cover" */
                      imageStyle={{borderRadius: 25}}>
                      <LinearGradient
                        colors={[global.overlay1, global.overlay3]}
                        style={{
                          opacity: 0.5,
                          height: '100%',
                          width: '95%',
                          borderRadius: 25,
                        }}></LinearGradient>

                      <View
                        style={{
                          flexDirection: 'row',
                          width: '70%',
                          height: 40,
                          position: 'absolute',
                          bottom: 20,
                        }}>
                        <View
                          style={{
                            borderColor: '#fff',
                            borderWidth: 1,
                            borderRadius: 20,
                            height: 36,
                            marginLeft: 20,
                          }}>
                          <Avatar
                            rounded
                            size="small"
                            source={{uri: item.UserImage}}
                          />
                        </View>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 11,
                            marginLeft: 5,
                            alignSelf: 'center',
                            fontFamily: global.fontSelect,
                          }}>
                          {item.UserName}
                        </Text>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={item => item.post_id}
              style={{borderRadius: 100}}
            />
          </View>
        )}
      </View>
    );
  }
}
  