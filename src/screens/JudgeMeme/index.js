import React, {useState, useEffect} from 'react';
// import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ImageBackground,
  ScrollView,
  Image,
  ToastAndroid,
  Modal,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {CheckBox} from 'react-native-elements';

import {useNavigation} from '@react-navigation/native';
import {MonthsArray} from '../../Utility/Utils';
// import PhotoEditor from 'react-native-photo-editor'

var windowWidth = Dimensions.get('window').width;
windowWidth = (windowWidth * 85) / 100;
var seassionWidth = (windowWidth * 80) / 100;
var windowWidthSeasion = (windowWidth * 20) / 100;
var Width3rd = (windowWidth * 33) / 100;
var count = 0;
export default function JudgeMeme(props) {
  const navigation = useNavigation();

  const currentDateTime = new Date();
  const currentMonth = currentDateTime.getMonth();

  const [indicatButton, setIndicatButton] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      count = 0;
      GetJudgePostFN();
    });

    return unsubscribe;
  }, [navigation]);

  const settingPosts = postArray => {
    var unJudged = [];
    var judged = [];
    postArray.forEach(item => {
      if (item.JudgeResult == 0) {
        unJudged.push(item);
      } else {
        judged.push(item);
      }
    });
    var allPosts = unJudged.concat(judged);
    setPosts(allPosts);
  };

  const getImageSize = async uri =>
    new Promise(resolve => {
      Image.getSize(uri, (width, height) => {
        resolve([width, height]);
      });
    });

  function GetJudgePostFN() {
    /* console.log(
      global.address + 'GetPostsForJudgement/' + global.userData.user_id,
    );
    console.log({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authToken: global.token,
    }); */
    fetch(global.address + 'GetPostsForJudgement/' + global.userData.user_id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        let data = responseJson.Posts.filter(
          element =>
            !element.img_url.includes('.mp4') &&
            element.month == MonthsArray[currentMonth] &&
            element.user_id != global.userData.user_id,
        );
        /* console.log('GetJudgePostFN data', data);
        console.log('GetJudgePostFN data', global.userData.user_id); */

        data.forEach(async function (element, index) {
          if (element.JudgeResult == 1 || element.JudgeResult == -1) {
            count = count + 1;
          }
          const [width, height] = await getImageSize(element.img_url);
          const ratio = windowWidth / width;
          element.calHeight = height * ratio;
          element.calWidth = windowWidth;

          // console.log(index, element.calHeight);

          if (index == data.length - 1) {
            settingPosts(data);
          }
        });
      })
      .catch(error => {
        console.error('GetJudgePostFN', error);
      });

    //mock data
    /* setPosts([
      {
        img_url: `https://www.memesmonkey.com/images/memesmonkey/ad/ad92e10bb8d7a4e6a25677db215feaf3.jpeg`,
        JudgeResult: 0,
        calHeight: 500,
      },
      {
        img_url: `https://www.memesmonkey.com/images/memesmonkey/ad/ad92e10bb8d7a4e6a25677db215feaf3.jpeg`,
        JudgeResult: 1,
        calHeight: 500,
      },
      {
        img_url: `https://www.memesmonkey.com/images/memesmonkey/ad/ad92e10bb8d7a4e6a25677db215feaf3.jpeg`,
        JudgeResult: -1,
        calHeight: 500,
      },
      {
        img_url: `https://www.memesmonkey.com/images/memesmonkey/ad/ad92e10bb8d7a4e6a25677db215feaf3.jpeg`,
        JudgeResult: 1,
        calHeight: 500,
      },
      {
        img_url: `https://www.memesmonkey.com/images/memesmonkey/ad/ad92e10bb8d7a4e6a25677db215feaf3.jpeg`,
        JudgeResult: -1,
        calHeight: 500,
      },
    ]); */
  }

  function judgeReactFN(index, react) {
    var today = new Date();
    var yyy = today.getFullYear();

    var month = today.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    var ddd = today.getDate();
    if (ddd < 10) {
      ddd = '0' + ddd;
    }

    var date = yyy + '-' + month + '-' + ddd;

    posts[index].JudgeResult = react;

    setPosts([...posts]);

    count = count + 1;
    fetch(global.address + 'JudgePost', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
      body: JSON.stringify({
        userId: global.userData.user_id,
        postId: posts[index].post_id,
        result: react,
        date: date,
      }),
    });
  }

  return (
    <View
      style={{flex: 1, paddingTop: '3%', backgroundColor: global.colorPrimary}}>
      <ScrollView>
        <View style={{flexDirection: 'row', marginHorizontal: '4%'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={[styles.tinyLogo, {tintColor: global.colorIcon}]}
              source={require('../../images/back1.png')}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.title,
              {fontFamily: global.fontSelect, color: global.colorIcon},
            ]}>
            Judge
          </Text>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 'auto',
              width: 100,
              height: 40,
              borderRadius: 25,
              borderWidth: 1,
              borderColor: global.colorIcon,
            }}>
            <Text
              style={{
                color: global.colorIcon,
                fontSize: 16,
                fontFamily: global.fontSelect,
              }}>
              {count}
              <Text style={{color: '#68666A', fontFamily: global.fontSelect}}>
                /{posts.length}
              </Text>
            </Text>
          </View>
        </View>

        <FlatList
          // horizontal={true}
          // showsHorizontalScrollIndicator={false}
          data={posts}
          renderItem={({item, index}) => (
            <View key={index}>
              {/* <TouchableOpacity> */}
              <View
                style={{
                  width: '100%',
                  marginTop: 5,
                  marginBottom: 5,
                  borderRadius: 25,
                }}>
                <Image
                  style={{
                    width: '100%',
                    height: item.calHeight ? item.calHeight : '100%',
                  }}
                  resizeMode="stretch"
                  source={{uri: item.img_url}}
                />

                {item.JudgeResult == 0 ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: -21,
                      marginBottom: 25,
                    }}>
                    <TouchableOpacity onPress={() => judgeReactFN(index, 1)}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 65,
                          height: 48,
                          backgroundColor: '#fff',
                          borderRightColor: '#000',
                          borderRightWidth: 1,
                          borderTopLeftRadius: 25,
                          borderBottomLeftRadius: 25,
                        }}>
                        <Image
                          style={{width: 18, height: 18, tintColor: '#00A344'}}
                          resizeMode="stretch"
                          source={require('../../images/hertGreen.png')}
                        />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => judgeReactFN(index, -1)}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 65,
                          height: 48,
                          backgroundColor: '#fff',
                          borderLeftColor: '#000',
                          borderLeftWidth: 1,
                          borderTopRightRadius: 25,
                          borderBottomRightRadius: 25,
                        }}>
                        <Image
                          style={{width: 18, height: 18, tintColor: '#F44336'}}
                          resizeMode="stretch"
                          source={require('../../images/cross1.png')}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {item.JudgeResult != 0 ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: -21,
                      marginBottom: 25,
                    }}>
                    {item.JudgeResult == 1 ? (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 65,
                          height: 48,
                          backgroundColor: '#00A344',
                          borderRightColor: '#000',
                          borderRightWidth: 1,
                          borderTopLeftRadius: 25,
                          borderBottomLeftRadius: 25,
                        }}>
                        <Image
                          style={{width: 18, height: 18, tintColor: '#fff'}}
                          resizeMode="stretch"
                          source={require('../../images/hertGreen.png')}
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 65,
                          height: 48,
                          backgroundColor: '#fff',
                          borderRightColor: '#000',
                          borderRightWidth: 1,
                          borderTopLeftRadius: 25,
                          borderBottomLeftRadius: 25,
                        }}>
                        <Image
                          style={{width: 18, height: 18, tintColor: '#00A344'}}
                          resizeMode="stretch"
                          source={require('../../images/hertGreen.png')}
                        />
                      </View>
                    )}

                    {item.JudgeResult == -1 ? (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 65,
                          height: 48,
                          backgroundColor: '#F44336',
                          borderLeftColor: '#000',
                          borderLeftWidth: 1,
                          borderTopRightRadius: 25,
                          borderBottomRightRadius: 25,
                        }}>
                        <Image
                          style={{width: 18, height: 18, tintColor: '#fff'}}
                          resizeMode="stretch"
                          source={require('../../images/cross1.png')}
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 65,
                          height: 48,
                          backgroundColor: '#fff',
                          borderLeftColor: '#000',
                          borderLeftWidth: 1,
                          borderTopRightRadius: 25,
                          borderBottomRightRadius: 25,
                        }}>
                        <Image
                          style={{width: 18, height: 18, tintColor: '#F44336'}}
                          resizeMode="stretch"
                          source={require('../../images/cross1.png')}
                        />
                      </View>
                    )}
                  </View>
                ) : null}
              </View>
              {/* </TouchableOpacity> */}
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    marginBottom: 25,
    marginLeft: 5,
  },
  txt: {
    color: '#E6E6E6',
    marginTop: 20,
    marginLeft: '4%',
    marginBottom: '14%',
  },
  txtbelow: {
    color: '#E6E6E6',
    marginTop: '12%',
    alignSelf: 'center',
    marginBottom: '5%',
  },
  txtdown: {
    color: '#E6E6E6',
    marginTop: '5%',
    alignSelf: 'center',
    marginBottom: '10%',
  },
  txtdown2: {
    color: '#FBC848',
    marginTop: '5%',
    alignSelf: 'center',
    marginBottom: '10%',
    marginLeft: 10,
  },
  tinyLogo: {
    width: 30,
    height: 20,
    marginTop: 10,
  },
});
