import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Image,
  ToastAndroid,
  Modal,
  Pressable,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import ButtonShort from '../../component/ButtonShort';
import ButtonShortgray from '../../component/ButtonShortgray';
import ButtonExtraSmall from '../../component/ButtonExtraSmall';
import {useNavigation} from '@react-navigation/native';
import {testFN} from '../../Utility/Utils';
import {currentDateFN} from '../../Utility/Utils';

export default class FollowRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      followData: [],
      suggesionData: [],
      followRequest: [
        {
          id: 1,
          name: 'Sarah Saunders',
        },
        {
          id: 2,
          name: 'Sarah Saunders',
        },
      ],
    };
  }

  componentDidMount() {
    this.setState({
      followData: testFN(this.props.route.params.requests),
    });
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      /* console.log('focused'); */
      this.showSuggwsionRequestFN();
    });
  }

  showSuggwsionRequestFN() {
    fetch(global.address + 'RequestSuggessions/' + global.userData.user_id, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        /* console.log('suggesion....'); */
        /* console.log(responseJson.Suggessions); */

        this.setState({
          suggesionData: responseJson.Suggessions,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  sendFollowRequest(item) {
    let arr = this.state.suggesionData;
    const index = arr.indexOf(item);
    if (index > -1) {
      arr.splice(index, 1);
      this.setState({
        suggesionData: arr,
      });
    }

    var currentDate = currentDateFN();
    fetch(global.address + 'PostFollowRequest', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
      body: JSON.stringify({
        userID: global.userData.user_id,
        followingID: item.user_id,
        dateTime: currentDate,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {})
      .catch(error => {
        console.error(error);
      });
  }

  confirmReques(index) {
    fetch(
      global.address +
        'ConfirmFollowRequest/' +
        this.state.followData[index].follow_id +
        '/' +
        global.userData.user_id +
        '/' +
        this.state.followData[index].user_id,
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
        var requesrArr = this.state.followData;
        requesrArr.splice(index, 1);
        this.setState({
          followData: requesrArr,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  rejectRequest(index) {
    fetch(
      global.address +
        'RejectFollowRequest/' +
        this.state.followData[index].follow_id,
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
        var requesrArr = this.state.followData;
        requesrArr.splice(index, 1);
        this.setState({
          followData: requesrArr,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  navigateToProfile(navigation, user) {
    global.profileID = user.user_id;
    navigation.navigate('ProfileScreen');
  }

  render() {
    const {navigation} = this.props;
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: '5%',
          paddingTop: '5%',
          backgroundColor: global.colorPrimary,
        }}>
        <ScrollView>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('NotificationScreen')}>
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
              {' '}
              Follow Requests
            </Text>
          </View>

          {this.state.followData == '' ? (
            <View Style={{width: '100%'}}>
              <Image
                style={{
                  height: 90,
                  width: 90,
                  tintColor: global.colorIcon,
                  marginTop: 23,
                  alignSelf: 'center',
                }}
                resizeMode="stretch"
                source={require('../../images/request.png')}
              />

              <Text
                style={{
                  fontFamily: global.fontSelect,
                  alignSelf: 'center',
                  color: global.colorTextPrimary,
                  fontSize: 17,
                  fontWeight: 'bold',
                  marginTop: 15,
                }}>
                Follow Request
              </Text>
              <Text
                style={{
                  fontFamily: global.fontSelect,
                  color: global.colorTextPrimary,
                  alignSelf: 'center',
                  textAlign: 'center',
                  width: '80%',
                  marginTop: 7,
                  marginBottom: 10,
                }}>
                When people ask to follow, you'll see their requests here
              </Text>
            </View>
          ) : null}
          <FlatList
            data={this.state.followData}
            renderItem={({item, index}) => (
              <TouchableOpacity
                style={{
                  width: '100%',
                  paddingVertical: 5,
                  flexDirection: 'row',
                }}
                onPress={() => this.navigateToProfile(navigation, item)}>
                <Avatar rounded size="medium" source={{uri: item.UserImage}} />

                <View style={{width: '60%', height: 100, marginLeft: 10}}>
                  <Text
                    style={{
                      color: global.colorTextPrimary,
                      fontSize: 15,
                      fontWeight: 'bold',
                      marginTop: 4,
                      fontFamily: global.fontSelect,
                    }}>
                    {' '}
                    {item.UserName}
                  </Text>
                  <Text
                    style={{
                      color: global.colorTextPrimary,
                      fontSize: 13,
                      marginTop: 2,
                      fontFamily: global.fontSelect,
                    }}>
                    {' '}
                    Sent you a follow request.
                  </Text>

                  <View style={{flexDirection: 'row', marginTop: 5}}>
                    {item.is_follow_request_approved == 0 ? (
                      <ButtonShort
                        title="Confirm"
                        bgClrFirst={global.confirmBtnBG1}
                        bgClrSecond={global.confirmBtnBG2}
                        btnTxtClr={global.confirmBtnTextColor}
                        font={global.fontSelect}
                        onPress={() => this.confirmReques(index)}
                      />
                    ) : (
                      <ButtonShort
                        bgClrFirst={global.confirmBtnBG1}
                        bgClrSecond={global.confirmBtnBG2}
                        font={global.fontSelect}
                        title="Confirmed"
                      />
                    )}
                    <ButtonShortgray
                      title="Decline"
                      onPress={() => this.rejectRequest(index)}
                      font={global.fontSelect}
                      color={global.declineButtonBG}
                      textColor={global.declineButtonTextColor}
                    />
                  </View>
                </View>

                <View
                  style={{
                    width: '20%',
                    height: 60,
                    marginLeft: 'auto',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: global.colorTextPrimary,
                      fontSize: 11,
                      marginLeft: 'auto',
                      fontFamily: global.fontSelect,
                    }}>
                    {item.datetime}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />

          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: '#1B1B1B',
              marginVertical: 5,
            }}></View>

          {this.state.suggesionData != '' ? (
            <View>
              <Text
                style={{
                  color: global.colorTextPrimary,
                  marginVertical: 7,
                  fontFamily: global.fontSelect,
                }}>
                Suggestions for you
              </Text>
              <FlatList
                data={this.state.suggesionData}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    onPress={() => this.navigateToProfile(navigation, item)}
                    style={{
                      width: '100%',
                      paddingVertical: 5,
                      flexDirection: 'row',
                    }}>
                    <Avatar
                      rounded
                      size="medium"
                      source={
                        // require('../../images/image19.png')
                        {uri: item.UserImage}
                      }
                    />

                    <View style={{width: '60%', height: 62, marginLeft: 10}}>
                      <Text
                        style={{
                          color: global.colorTextPrimary,
                          fontSize: 15,
                          fontWeight: 'bold',
                          marginTop: 4,
                          fontFamily: global.fontSelect,
                        }}>
                        {item.UserName}
                      </Text>
                      <Text
                        style={{
                          color: global.colorTextPrimary,
                          fontSize: 13,
                          marginTop: 2,
                          fontFamily: global.fontSelect,
                        }}>
                        {' '}
                        You may know him
                      </Text>
                    </View>

                    <View
                      style={{
                        width: '23%',
                        height: 60,
                        marginLeft: 'auto',
                        flexDirection: 'row',
                      }}>
                      <ButtonExtraSmall
                        title="Follow"
                        onPress={() => this.sendFollowRequest(item)}
                        bgClrFirst={global.followBtnBG1}
                        bgClrSecond={global.followBtnBG2}
                        btnTxtClr={global.followBtnTextColor}
                        font={global.fontSelect}
                      />
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
              />
            </View>
          ) : null}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    color: '#E6E6E6',
    marginBottom: 25,
  },
  tinyLogo: {
    width: 30,
    height: 20,
    marginTop: 10,
    tintColor: '#ffffff',
  },
});
