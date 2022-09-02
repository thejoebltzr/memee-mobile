import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  StyleSheet,
  Linking,
  Text,
  Image,
} from 'react-native';
import {colors} from '../../Utility/colors';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  GiftedChat,
  InputToolbar,
  Bubble,
  Send,
  Avatar,
  Time,
} from 'react-native-gifted-chat';
const axios = require('axios');
import messaging from '@react-native-firebase/messaging';
const windowWidth = Dimensions.get('window').width;
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {generateUID} from '../../Utility/Utils';
import {RNS3} from 'react-native-aws3';
import {getLastSeenFormat} from '../../Utility/Utils';
import {getBucketOptions} from '../../Utility/Utils';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const ChatScreen = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [otherChatUser, setOtherChatUser] = useState();
  const [currentChatUser, setCurrentChatUser] = useState();
  const {conversationId, user} = route.params;
  const [primaryKey, setPrimaryKey] = useState();
  useEffect(async () => {
    setOtherChatUser(user);
    setCurrentChatUser({
      _id: global.userData.user_id,
      name: global.userData.name,
      avatar: global.userData.imgurl,
      userId: global.userData.user_id,
    });
    await isNewConversation(
      parseInt(global.userData.user_id) + parseInt(user.receiver_id),
    );
    setPrimaryKey(
      parseInt(global.userData.user_id) + parseInt(user.receiver_id),
    );
  }, [1]);
  useEffect(async () => {
    var docId = parseInt(global.userData.user_id) + parseInt(user.receiver_id);
    console.log('docid', docId);
    const unsubscribeListener = firestore()
      .collection('Mem_Conversation')
      .doc(`${docId}`)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();
          const data = {
            _id: doc.id,
            text: '',
            createdAt: 'New Connection',
            ...firebaseData,
          };
          return data;
        });
        console.log('essameg', messages);
        setMessages(messages);
      });

    return () => unsubscribeListener();
  }, []);

  const isNewConversation = async primaryKey => {
    var flag = false;
    console.log(primaryKey);
    firestore()
      .collection('Mem_Conversation')
      .onSnapshot(querySnapshot => {
        if (querySnapshot != null) {
          const result = querySnapshot.docs.some(documentSnapshot => {
            console.log('asdss', documentSnapshot.id);
            if (documentSnapshot.id == primaryKey) {
              return (flag = true);
            }
          });
          console.log('asd', result);
          if (!result) {
            setFirebase(primaryKey);
            console.log('sdfakse');
          } else {
            console.log('true');
          }
        }
      });
  };
  const setFirebase = async primaryKey => {
    console.log('ehhosl', user.img);
    await firestore()
      .collection('Mem_Conversation')
      .doc(`${primaryKey}`)
      .set({
        sender_id: global.userData.user_id,
        sender_name: global.userData.name,
        sender_img: global.userData.imgurl,
        receiver_id: user.receiver_id,
        receiver_name: user.name,
        receiver_img: user.img,
        latestMessage: {
          text: `New Connection`,
          createdAt: new Date().getTime(),
        },
      });
  };
  const onSend = async messages => {
    const text = messages[0].text;
    console.log('erdaz', primaryKey);
    firestore()
      .collection('Mem_Conversation')
      .doc(`${primaryKey}`)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: currentChatUser,
      });
    await firestore()
      .collection('Mem_Conversation')
      .doc(`${primaryKey}`)
      .set(
        {
          sender_id: global.userData.user_id,
          sender_name: global.userData.name,
          sender_img: global.userData.imgurl,
          receiver_id: user.receiver_id,
          receiver_name: user.name,
          receiver_img: user.img,
          latestMessage: {
            text,
            createdAt: new Date().getTime(),
          },
        },
        {merge: true},
      );
  };

  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#FFCD2F',
            marginBottom: 15,
            borderTopRightRadius: 25,
            borderBottomRightRadius: 0,
          },
          left: {
            backgroundColor: '#292929',
            marginBottom: 15,
          },
        }}
        textStyle={{
          right: {
            color: 'black',
          },
          left: {
            color: 'white',
          },
        }}
      />
    );
  }

  function renderInputToolbar(props) {
    return (
      <View
        style={{
          marginTop: 90,
          width: '100%',
          alignSelf: 'center',
          position: 'absolute',
          bottom: 10,
        }}>
        <InputToolbar
          {...props}
          containerStyle={{
            backgroundColor: 'transparent',
            borderTopColor: '#E8E8E8',
            borderTopWidth: 0,
            textColor: 'white',
            alignItems: 'center',
          }}
          primaryStyle={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        />
      </View>
    );
  }

  const galleryButton = sendProps => {
    return (
      <View flexDirection="row">
        <TouchableOpacity
          onPress={() => chooseFile()}
          style={styles.myStyle}
          activeOpacity={0.5}>
          <Image
            source={require('../../images/gallery.png')}
            style={{
              height: 25,
              width: 25,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const chooseFile = () => {
    let options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
      maxWidth: 500,
      maxHeight: 500,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const file = {
          uri: response.assets[0].uri,
          name: generateUID() + '.jpg',
          type: 'image/jpeg',
        };

        let reference = storage().ref(file.name);
        let task = reference.putFile(file.uri);

        task
          .then(async response => {
            console.log('Image uploaded to the bucket!');
            reference.getDownloadURL().then(async response => {
              var valueToPush = {};
              valueToPush['_id'] = Math.floor(Math.random() * 100000);
              valueToPush['text'] = '';
              valueToPush['user'] = users.find(
                element => element.userId == global.userData.user_id,
              );
              valueToPush['image'] = response;

              let msg = [];
              msg.push(valueToPush);
              console.log('asd', msg);
              // onSend({
              //   _id: conversationId,
              //   image: msg[0].image,
              //   user: currentChatUser,
              // });
              firestore()
                .collection('Mem_Conversation')
                .doc(`${primaryKey}`)
                .collection('MESSAGES')
                .add({
                  image: msg[0].image,
                  createdAt: new Date().getTime(),
                  user: currentChatUser,
                });
              await firestore()
                .collection('Mem_Conversation')
                .doc(`${primaryKey}`)
                .set(
                  {
                    sender_id: global.userData.user_id,
                    sender_name: global.userData.name,
                    sender_img: global.userData.imgurl,
                    receiver_id: user.receiver_id,
                    receiver_name: user.name,
                    receiver_img: user.img,
                    latestMessage: {
                      text: 'You sent a photo',
                      createdAt: new Date().getTime(),
                    },
                  },
                  {merge: true},
                );
            });
          })
          .catch(e => {
            console.log('uploading image error => ', e);
          });
      }
    });
  };

  // renderMessageImage(props) {
  //   // console.log("imageprops",props)
  //   return (
  //     <View style={{padding: 0}}>
  //       {/* second option use react native modal */}

  //       <ImageModal
  //         resizeMode="contain"
  //         imageBackgroundColor="#000000"
  //         style={{
  //           width: 140,
  //           height: 300,
  //           borderRadius: 10,
  //           overflow: 'hidden',
  //         }}
  //         modalImageStyle={{
  //           borderRadius: 10,
  //         }}
  //         source={{
  //           uri: props.currentMessage.image,
  //         }}
  //       />
  //     </View>
  //   );
  // }
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: '5%',
        paddingTop: '5%',
        backgroundColor: global.colorPrimary,
      }}>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={[styles.tinyLogo, {tintColor: global.colorIcon}]}
            source={require('../../images/back1.png')}
          />
        </TouchableOpacity>
        <Image
          source={{uri: user.img}}
          style={[styles.addFriendImage, {}]}
          resizeMode="cover"
        />
        <View>
          <Image
            source={require('../../images/online.png')}
            style={{
              height: 18,
              width: 18,
              borderRadius: 10,
              marginLeft: -15,
              marginTop: 20,
            }}
            resizeMode="cover"
          />
        </View>

        <View style={{flexDirection: 'column'}}>
          <Text
            style={[
              styles.headerText,
              {fontSize: user.name.length > 20 ? 14 : 20},
            ]}>
            {user.name}
          </Text>
          {user.onlineStatus == '0' && user.lastSeen ? (
            <Text style={styles.simpleText}>
              {getLastSeenFormat(user.lastSeen)}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.containerStyle}>
        {/* {otherChatUser ? (
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.headerArrow}>
              <Icon name="arrowleft" size={24} color={colors.textColor} />
            </TouchableOpacity>
            {otherChatUser.avatar != '' ? (
              <Image
                source={{uri: otherChatUser.avatar}}
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
            {otherChatUser.onlineStatus == '1' ? (
              <View>
                <Image
                  source={require('../../images/online.png')}
                  style={{
                    height: 18,
                    width: 18,
                    borderRadius: 10,
                    marginLeft: -15,
                    marginTop: 20,
                  }}
                  resizeMode="cover"
                />
              </View>
            ) : null}
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.headerText}>{otherChatUser.name}</Text>
              {otherChatUser.onlineStatus == '0' && otherChatUser.lastSeen ? (
                <Text style={styles.simpleText}>
                  {getLastSeenFormat(otherChatUser.lastSeen)}
                </Text>
              ) : null}
            </View>
          </View>
        ) : null} */}
        <GiftedChat
          alwaysShowSend
          placeholder="Aa"
          messages={messages}
          onSend={msg => onSend(msg)}
          user={currentChatUser}
          renderBubble={renderBubble}
          renderTime={props => null}
          renderSend={props => (
            <Send {...props}>
              <Image
                source={require('../../images/send.png')}
                style={{
                  height: 22,
                  width: 22,
                  marginBottom: 15,
                  marginLeft: 10,
                }}
              />
            </Send>
          )}
          renderInputToolbar={props => renderInputToolbar(props)}
          // renderMessageImage={props => renderMessageImage(props)}
          renderActions={messages => galleryButton(messages)}
          textInputStyle={{
            backgroundColor: '#292929',
            borderRadius: 20,
            paddingLeft: 20,
            paddingRight: 20,
            color: 'white',
            marginTop: 100,
          }}
        />
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: '#0D0219',
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
    marginRight: 10,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  simpleText: {
    color: colors.textColor,
    fontFamily: 'Gilroy-Bold',
    fontSize: 14,
    marginRight: 10,
    marginLeft: 10,
  },
  headerArrow: {
    marginTop: 4,
  },
  userImage: {height: 50, width: 50, borderRadius: 50 / 2},
  inputView: {
    flexDirection: 'row',
    marginHorizontal: '5%',
    marginBottom: 20,
    borderColor: colors.placeholderColor,
    borderWidth: 1,
    backgroundColor: colors.inputBackground,
    borderRadius: 16,
  },
  input: {
    minHeight: 50,
    maxHeight: 120,
    width: '65%',
    marginLeft: '5%',
    fontSize: 16,
    fontFamily: 'Gilroy-Regular',
    color: colors.textColor,
  },
  micButton: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  micImage: {
    height: 25,
    width: 25,
  },
  sendButton: {
    height: 45,
    width: 45,
    backgroundColor: colors.buttonBackground,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2.5,
    marginLeft: 'auto',
    marginRight: '3%',
  },
  sendImage: {
    height: 22,
    width: 22,
    tintColor: colors.textColor,
  },
  myStyle: {
    alignItems: 'center',
    borderColor: '#fff',
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    marginLeft: '-5%',
    marginRight: '5%',
    marginBottom: 5,
  },
  addFriendImage: {
    marginStart: 10,
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
  },
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
