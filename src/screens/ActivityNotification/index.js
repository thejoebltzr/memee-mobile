import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Avatar} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {formatDateTime} from '../../Utility/Utils';
import {FOLLOW_REQUESTS} from '../../redux/constants';
import {readNotifications} from '../../redux/actions/Auth';
import Toast from 'react-native-toast-message';

export default function ActivityNotification() {
  const {notifications, followRequests} = useSelector(({authRed}) => authRed);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      /* console.log('Screen was focused'); */
      /* console.log(followRequests); */
      showFollowRequestFN();
      dispatch(readNotifications());

      // Do something when the screen is focused
      return () => {
        /* console.log('Screen was unfocused'); */
      };
    }, []),
  );
  // function profileDataFN() {
  //   fetch(global.address + 'GetUserProfile/' + global.profileID, {
  //     method: 'get',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       authToken: global.token,
  //     },
  //   })
  //     .then(response => response.json())
  //     .then(responseJson => {
  //       console.log('asds', responseJson.posts);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // }
  function getPostData(senderId, postId) {
    fetch(global.address + 'GetPostById/' + senderId + '/' + postId, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('asd', responseJson);

        global.selectedPost = responseJson.Post;
        if (global.selectedPost !== null)
          navigation.navigate('ProfileImageShow');
        else
          Toast.show({
            type: 'error',
            test1: 'Alert!',
            text2: 'Memee Deleted',
          });
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  function handleNotificationClick(data) {
    /* console.log(data); */
    if (data.type == 'comment') {
      global.postId = data.object_id;
      console.log(global.postId);
      navigation.navigate('CommentScreen');
    } else if (data.type == 'comment_like') {
      global.postId = data.object_id;
      console.log(global.postId);
      navigation.navigate('CommentScreen');
    }else if (data.type == 'like') {
      console.log('like click');
      getPostData(data.receiver_id, data.object_id);
    } else if (data.type == 'share') {
      console.log('shared click');
      getPostData(data.sender_id, data.object_id);
    } else if(data.type == 'follow_request_approved')
    {
      global.profileID = data.sender_id;
      navigation.navigate('ProfileScreen');
    }
  }

  function showFollowRequestFN() {
    fetch(global.address + 'GetFollowRequests/' + global.userData.user_id, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        dispatch({type: FOLLOW_REQUESTS, data: responseJson.Requests});
      })
      .catch(error => {
        console.error(error);
      });
  }

  function getAction(val) {
    if (val == 'like') return 'has liked your memee.';
    if (val == 'comment') return 'has commented on your memee.';
    if (val == 'share') return 'has shared your memee.';
    if (val == 'comment_like') return 'has liked your comment.';
    if (val == 'follow_request_approved') return 'has approved your request';
  }

  return (
    <View
      style={{flex: 1, paddingTop: '2%', backgroundColor: global.colorPrimary}}>
      <ScrollView>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('FollowRequest', {requests: followRequests})
          }>
          <View
            style={{
              width: '100%',
              paddingTop: 10,
              paddingBottom: 20,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: global.activityBorderBottomColor,
              borderBottomWidth: 1,
            }}>
            <Image
              style={{height: 50, width: 50, tintColor: global.colorIcon}}
              resizeMode="stretch"
              source={require('../../images/request.png')}
            />

            <View style={{width: '60%', height: 60, marginLeft: 10}}>
              <Text
                style={{
                  color: global.colorTextPrimary,
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginTop: 4,
                  fontFamily: global.fontSelect,
                }}>
                {' '}
                Follow Requests
              </Text>
              <Text
                style={{
                  color: global.colorTextPrimary,
                  fontSize: 13,
                  marginTop: 2,
                  fontFamily: global.fontSelect,
                }}>
                {' '}
                Approve or ignore requests
              </Text>
            </View>

            <View
              style={{
                width: '20%',
                height: 60,
                marginLeft: 'auto',
                flexDirection: 'row',
              }}>
              {followRequests?.length > 0 ? (
                <View
                  style={{
                    backgroundColor: global.followRequestCountBG,
                    height: 26,
                    width: 26,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 20,
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      color: global.followRequestCountTextColor,
                      fontSize: 11,
                      fontFamily: global.fontSelect,
                    }}>
                    {followRequests?.length}
                  </Text>
                </View>
              ) : (
                <View style={{height: 26, width: 26}} />
              )}

              <Image
                style={{
                  height: 15,
                  width: 9,
                  tintColor: global.colorTextPrimary,
                  alignSelf: 'center',
                  marginLeft: '10%',
                }}
                resizeMode="stretch"
                source={require('../../images/farward.png')}
              />
            </View>
          </View>
        </TouchableOpacity>

        <FlatList
          data={notifications}
          renderItem={({item, index}) => (
            <TouchableOpacity
              // disabled={true}
              onPress={() => handleNotificationClick(item)}
              style={{
                width: '100%',
                paddingVertical: 5,
                flexDirection: 'row',
                marginTop: 10,
                paddingStart: 10,
                borderRadius: 10,
                backgroundColor:
                  item.status == 0
                    ? global.colorSecondary
                    : global.colorPrimary,
              }}>
              <Avatar rounded size="medium" source={{uri: item.Image}} />

              <View style={{width: '90%', height: 62, marginLeft: 10}}>
                <Text
                  style={{
                    color: global.colorTextPrimary,
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginTop: 4,
                    fontFamily: global.fontSelect,
                  }}>
                  {item.Name}
                  <Text
                    style={{
                      color: global.colorTextPrimary,
                      fontSize: 11,
                      marginTop: 2,
                      fontFamily: global.fontSelect,
                    }}>
                    {' '}
                    {getAction(item.type)}
                  </Text>
                </Text>
                <Text
                  style={{
                    color: global.colorTextPrimary,
                    fontSize: 11,
                    marginTop: 2,
                    fontFamily: global.fontSelect,
                  }}>
                  {' '}
                  {formatDateTime(item.date_time)}
                </Text>
              </View>

              {/* <View style={{ width: '20%', height: 60, marginLeft: 'auto', flexDirection: 'row' }}>
                                <ButtonExtraSmall
                                    title="Follow"
                                    bgClrFirst={global.btnColor1}
                                    bgClrSecond={global.btnColor2}
                                    btnTxtClr={global.btnTxt}
                                    font={global.fontSelect}
                                />
                            </View> */}
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          style={{marginTop: 20}}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    color: '#E6E6E6',
    marginBottom: 25,
  },
});
