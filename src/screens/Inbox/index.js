import React, {useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import {formatDateTime} from '../../Utility/Utils';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import {CONVERSATIONS} from '../../redux/constants';
import {colors} from '../../Utility/colors';

const axios = require('axios');
var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;

const Inbox = ({showValue}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const {conversations} = useSelector(({authRed}) => authRed);
  const [threads, setThreads] = useState([]);
  const [add, setAdd] = useState();
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Mem_Conversation')
      .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        if (querySnapshot != null) {
          const threads = querySnapshot.docs.map(documentSnapshot => {
            console.log('documentSnapshot', documentSnapshot.data());
            var add = documentSnapshot.data().receiver_id;
            var img = documentSnapshot.data().receiver_img;
            var name = documentSnapshot.data().receiver_name;
            if (documentSnapshot.data().sender_id != global.userData.user_id) {
              console.log(documentSnapshot.data().sender_id);
              add = documentSnapshot.data().sender_id;
              img = documentSnapshot.data().sender_img;
              name = documentSnapshot.data().sender_name;
            }
            if (
              documentSnapshot.data().sender_id == global.userData.user_id ||
              documentSnapshot.data().receiver_id == global.userData.user_id
            ) {
              return {
                _id: documentSnapshot.id,
                asd: add,
                names: name,
                imgs: img,
                online: 1,
                latestMessage: {text: ''},
                ...documentSnapshot.data(),
              };
            } else {
              console.log('soes');
            }
          });
          const results = threads.filter(element => {
            return element !== undefined;
          });
          setThreads(results);
          console.log('qwer', threads);
        } else {
          console.log('it is null');
        }
        if (loading) {
          setLoading(false);
        }
      });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#555" />;
  }

  async function profileDataFN(userId) {
    const data = await Promise.all(
      fetch(global.address + 'GetUserProfile/' + userId, {
        method: 'get',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authToken: global.token,
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log('gotcha', responseJson.profile.name);
          return {
            user: {
              name: responseJson.profile.name,
              img: responseJson.profile.img_url,
            },
          };
        })
        .catch(error => {
          console.error(error);
        }),
    );
    console.log('diresu', userId);
    return data;
  }

  // function setConversationsView(data) {
  //   let convs = [];
  //   data.forEach(element => {
  //     if (element.users.length == 1 && element.LastMessageDate) {
  //       convs.push({
  //         id: element.ConversationID,
  //         name: element.users[0].name,
  //         lastMessage:
  //           (element.LastMessageSenderID == global.userData.user_id
  //             ? 'You: '
  //             : '') +
  //           (element.LastMessageType == 'text'
  //             ? element.LastMessage
  //             : element.LastMessageType == 'image'
  //             ? 'Shared this image'
  //             : ''),
  //         image: element.users[0].imgurl,
  //         online: element.users[0].onlineStatus,
  //         date: element.LastMessageDate,
  //       });
  //     }
  //   });

  //   dispatch({type: CONVERSATIONS, data: convs});
  // }

  const mock = [
    {
      name: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        `,
      image:
        'https://www.memesmonkey.com/images/memesmonkey/ad/ad92e10bb8d7a4e6a25677db215feaf3.jpeg',
      online: 1,
      lastMessage: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        `,
      date: new Date().toISOString(),
      id: 0,
    },
    {
      name: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          `,
      image:
        'https://www.memesmonkey.com/images/memesmonkey/ad/ad92e10bb8d7a4e6a25677db215feaf3.jpeg',
      online: 1,
      lastMessage: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          `,
      date: new Date().toISOString(),
      id: 2,
    },
    {
      name: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          `,
      image:
        'https://www.memesmonkey.com/images/memesmonkey/ad/ad92e10bb8d7a4e6a25677db215feaf3.jpeg',
      online: 1,
      lastMessage: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          `,
      date: new Date().toISOString(),
      id: 3,
    },
  ];

  return (
    <View style={styles.containerStyle}>
      <ScrollView nestedScrollEnabled={true}>
        {/* <View style={styles.searchView}>
                    <TextInput style={styles.searchInput}
                        placeholder="Search"
                        placeholderTextColor={colors.placeholderColor}
                        value={search}
                        onChangeText={(text) => handleSearch(text)}
                    />
                    <View style={styles.iconView}>
                        <Icon name="search1" size={20} color={colors.textColor} />
                    </View>
                </View> */}
        <View>
          <FlatList
            data={threads}
            // data={mock}
            renderItem={({item, index}) => (
              <TouchableOpacity
                style={{flexDirection: 'column'}}
                onPress={() =>
                  navigation.navigate('ChatScreen', {
                    user: {
                      _id: item._id,
                      receiver_id: item.asd,
                      conversationId: item.conversationId,
                      name: item.names,
                      img: item.imgs,
                    },
                  })
                }>
                <View style={[styles.itemView, {}]}>
                  <View>
                    {item.imgs != '' ? (
                      <Image
                        source={{uri: item.imgs}}
                        style={[styles.addFriendImage, {}]}
                        resizeMode="cover"
                      />
                    ) : (
                      <Image
                        source={require('../../images/person1.png')}
                        style={[styles.addFriendImage, {}]}
                        resizeMode="cover"
                      />
                    )}
                    {item.online == '1' ? (
                      <View>
                        <Image
                          source={require('../../images/online.png')}
                          style={{
                            height: 18,
                            width: 18,
                            borderRadius: 10,
                            marginLeft: 35,
                            marginTop: -20,
                          }}
                          resizeMode="cover"
                        />
                      </View>
                    ) : null}
                  </View>

                  <View style={{width: '55%', marginLeft: '3%'}}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[
                        styles.addText,
                        {textAlign: 'left', color: colors.textColor},
                      ]}>
                      {item.names}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.nameText, {color: colors.textColor}]}>
                      {item.latestMessage.text}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.nameText,
                      {marginLeft: 'auto', color: colors.textColor},
                    ]}>
                    {item.latestMessage.createdAt == 'New Connection'
                      ? 'New Connection'
                      : formatDateTime('2022-06-11 12:12:12')}
                  </Text>
                  <Image
                    source={require('../../images/arrowR.png')}
                    style={[styles.arrowStyle, {tintColor: colors.textColor}]}
                    resizeMode="contain"
                  />
                </View>
                <View
                  style={{
                    height: 0.5,
                    width: '100%',
                    backgroundColor: global.colorSecondary,
                  }}
                />
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.navigate('NewMessage')}
        style={{position: 'absolute', bottom: 35, right: 25}}>
        <LinearGradient
          colors={[global.btnColor1, global.btnColor2]}
          /* colors={['red', 'blue']} */
          style={{
            height: 60,
            width: 60,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 40,
          }}>
          <Image
            source={require('../../images/Edit.png')}
            style={{tintColor: global.btnTxt, height: 20, width: 20}}
            resizeMode="contain"
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default Inbox;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    height: (windowHeight * 80.5) / 100,
    width: (windowWidth * 90) / 100,
    /* width: '100%', */
    backgroundColor: global.messageBG,
  },
  header: {
    marginHorizontal: '5%',
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
  },
  headerText: {
    color: colors.textColor,
    fontFamily: 'Gilroy-Bold',
    fontSize: 20,
  },
  headerArrow: {
    marginTop: 4,
    marginRight: 15,
  },
  searchView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10,
  },
  searchInput: {
    height: 50,
    width: '75%',
    backgroundColor: colors.inputBackground,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    paddingLeft: 15,
    fontSize: 18,
    color: colors.inputTextColor,
    fontFamily: 'Gilroy-Regular',
  },
  iconView: {
    height: 50,
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: colors.inputBackground,
  },
  groupsView: {
    height: 160,
    width: 125,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 10,
  },
  groupTitle: {
    fontSize: 16,
    fontFamily: 'Gilroy-Bold',
    color: colors.textColor,
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  membersText: {
    fontSize: 14,
    color: colors.placeholderColor,
    fontFamily: 'Gilroy-Regular',
    marginTop: 3,
  },
  membersImage: {
    height: 28,
    width: 28,
    borderRadius: 14,
  },
  addText: {
    fontSize: 16,
    color: colors.textColor,
    fontFamily: 'Gilroy-Bold',
    textAlign: 'center',
    marginTop: 5,
  },
  nameText: {
    fontSize: 15,
    color: colors.placeholderColor,
    fontFamily: 'Gilroy-Regular',
  },
  itemView: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 15,
    height: 75,
    alignItems: 'center',
  },
  addFriendImage: {height: 50, width: 50, borderRadius: 50 / 2},
  arrowStyle: {height: 12, width: 12, marginLeft: '1.5%'},
});
