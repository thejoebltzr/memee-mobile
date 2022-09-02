import React, {useState} from 'react';
import {
  View,
  Keyboard,
  BackHandler,
  Alert,
  Dimensions,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ToastAndroid,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {testFN, currentDateFN, generateUID} from '../../Utility/Utils';

let parentID = 0;
var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;
export default class CommentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: '',
      flatlist: [],
      placeholderStat: 'Write a comment',
      modalVisible: false,
      message: '',
      reload:''
    };
  }

  backAction = () => {
    if (parentID != '0') {
      this.setState({
        placeholderStat: 'Write a comment',
      });
      parentID = '0';
    } else {
      this.props.navigation.goBack();
    }
    return true;
  };

  componentDidMount() {
    this.getPostDataFN();
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  getPostDataFN() {
    fetch(global.address + 'GetPostComments/' + global.postId, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.length > 0) {
          var comments = testFN(responseJson);
          // console.log("sco",comments.length)
          
          /* var comment = [];
          var replies = [];
          var commentList = [];
          if (comments.length > 0) {
            for (let i = comments.length - 1; i >= 0; i--) {
              if (comments[i].parent_id == 0) {
                comment.push(comments[i]);
              } else {
                replies.push(comments[i]);
              }
            }
            commentList = Array.from(comment);
            //console.log(commentList)
            //console.log(replies)
            if (replies.length > 0) {
              for (let i = 0; i < comment.length; i++) {
                for (let j = replies.length - 1; j >= 0; j--) {
                  if (comment[i].comment_id == replies[j].parent_id) {
                    console.log(
                      '\nreplies[j]\n',
                      replies[j].parent_id,
                      comment[i].comment_id,
                    );
                    commentList.splice(i, 0, replies[j]);
                  }
                }
              }
            }
          } */

          /* var reversed = [].concat(commentList).reverse(); */

          var comment = [];
          var replies = [];
          var commentList = [];
          if (comments.length > 0) {
            for (let i = comments.length - 1; i >= 0; i--) {
              if (comments[i].parent_id == 0) {
                comment.push(comments[i]);
                for (let x = comments.length - 1; x >= 0; x--) {
                  if (comments[i].comment_id == comments[x].parent_id) {
                    comment.push(comments[x]);
                    console.log("true")
                  }else{
                    console.log("false" + comments[i].comment_id + comments[x].parent_id)
                  }
                }
              } 
              // else {
              //   replies.push(comments[i]);
              // }
            }
            commentList = Array.from(comment);
            // console.log(commentList[0]);
            // if (replies.length > 0) {
            //   for (let i = 0; i < comment.length; i++) {
            //     for (let j = replies.length - 1; j >= 0; j--) {
            //       if (comment[i].comment_id == replies[j].parent_id) {
            //         console.log(
            //           '\nreplies[j]\n',
            //           replies[j].parent_id,
            //           comment[i].comment_id,
            //         );
            //         commentList.splice(i + 1, 0, replies[j]);
            //       }
            //     }
            //   }
            // }
          }
          console.log("scos",commentList)
          this.setState({
            flatlist: commentList,
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  commentPlacedFN() {
    console.log('cooms', this.state.comment);
    if (this.state.placeholderStat == 'Write a comment') {
      parentID = '0';
    }

    let commentUID = generateUID();
    this.pushComment(commentUID);

    global.refresh = true;
    if (this.state.comment == '') {
      /* console.log('comment is empty..'); */
      this.setState({
        modalVisible: true,
        message: 'Please enter some text',
      });
      setTimeout(() => {
        this.setState({
          modalVisible: false,
          message: '',
        });
      }, 1600);
    } else {
      var currentDate = currentDateFN();
      
      fetch(global.address + 'PostComment', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authToken: global.token,
        },
        body: JSON.stringify({
          ParentID: parentID,
          UserID: global.userData.user_id,
          PostID: global.postId,
          text: this.state.comment,
          dateTime: currentDate,
          commentUID: commentUID,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.Status == '201') {
            /* console.log(responseJson); */
            var comments = this.state.flatlist;
            comments.find(
              c => c.commentUID == responseJson.commentUID,
            ).comment_id = responseJson.commentID;
            this.setState({
              flatlist: comments,
            });
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  pushComment(commentUID) {
    let index = 0;

    var tempCommentList = this.state.flatlist;

    if (this.state.flatlist.status == '400') {
      this.getPostDataFN();
    } else {
      let temparr = {};
      temparr['UserName'] = global.userData.name;
      temparr['IsLiked'] = '0';
      temparr['parent_id'] = parentID;
      temparr['text'] = this.state.comment;
      temparr['datetime'] = 'Just now';
      temparr['UserImage'] = global.userData.imgurl;
      temparr['commentUID'] = commentUID;

      index = tempCommentList.findIndex(c => c.comment_id == parentID) + 1;
      if (parentID != 0) tempCommentList.splice(index, 0, temparr);
      else tempCommentList.push(temparr);

      this.setState({
        placeholderStat: 'Write a comment',
      });
    }
    this.setState({
      flatlist: tempCommentList,
      comment: '',
    });

    if (index == -1) index = 0;

    /* console.log('index ', index); */
    this.flatListRef.scrollToOffset({offset: index * 90});

    Keyboard.dismiss();
  }

  replyFN(index) {
    this.setState({
      placeholderStat: 'Write a reply',
    });

    this.refs.secondTextInput.focus();

    parentID =
      this.state.flatlist[index].parent_id == '0'
        ? this.state.flatlist[index].comment_id
        : this.state.flatlist[index].parent_id;
  }

  likeCommentFN(index) {
    fetch(global.address + 'reactToComment', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
      body: JSON.stringify({
        CommentID: this.state.flatlist[index].comment_id,
        UserID: global.userData.user_id,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        var tempArr = this.state.flatlist;
        if (tempArr[index].IsLiked == '0') {
          tempArr[index].IsLiked = '1';
        } else {
          tempArr[index].IsLiked = '0';
        }

        this.setState({
          flatlist: tempArr,
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
        {/* <ScrollView> */}

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
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
            Comments
          </Text>
        </View>

        <FlatList
          showsHorizontalScrollIndicator={false}
          ref={ref => {
            this.flatListRef = ref;
          }}
          extraData={this.flatlist}
          data={this.state.flatlist}
          renderItem={({item, index}) => (
            <View style={{width: '100%', marginBottom: 15}}>
              {item.parent_id == 0 ? (
                <View>
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: (windowWidth * 100) / 100,
                        paddingRight: '15%',
                      }}>
                      <TouchableOpacity
                        style={{
                          borderRadius: 35,
                          borderColor: '#fff',
                          borderWidth: 2,
                          height: 54,
                        }}
                        onPress={() =>
                          this.navigateToProfile(navigation, item)
                        }>
                        <Avatar
                          rounded
                          size="medium"
                          source={{uri: item.UserImage}}
                        />
                      </TouchableOpacity>
                      <View
                        style={{
                          backgroundColor: global.colorSecondary,
                          marginLeft: 10,
                          paddingHorizontal: 15,
                          paddingVertical: 12,
                          borderRadius: 12,
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color: global.colorTextPrimary,
                            fontSize: 15,
                            fontWeight: 'bold',
                            marginBottom: 5,
                            fontFamily: global.fontSelect,
                            maxWidth: windowWidth * 0.7,
                          }}>
                          {item.UserName}
                        </Text>
                        <Text
                          style={{
                            color: global.colorTextPrimary,
                            fontFamily: global.fontSelect,
                          }}>
                          {decodeURIComponent(
                            JSON.parse(
                              '"' + item.text.replace(/\"/g, '\\"') + '"',
                            ),
                          )}
                        </Text>
                      </View>
                    </View>

                    {item.comment_id ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',
                          width: (windowWidth * 45) / 100,
                          marginLeft: (windowWidth * 14) / 100,
                          marginTop: 2,
                        }}>
                        <Text
                          style={{
                            color: global.colorTextPrimary,
                            fontFamily: global.fontSelect,
                          }}>
                          {item.datetime}
                        </Text>
                        {item.IsLiked == 0 ? (
                          <TouchableOpacity
                            onPress={() => this.likeCommentFN(index)}
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={{
                                color: global.colorTextPrimary,
                                fontFamily: global.fontSelect,
                                marginRight: 5,
                              }}>
                              Like
                            </Text>
                            <Text
                              style={[
                                styles.txtReaction,
                                {
                                  color: global.colorTextPrimary,
                                  fontFamily: global.fontSelect,
                                },
                              ]}>
                              {item.like_count}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => this.likeCommentFN(index)}
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={{
                                color: global.colorTextActive,
                                fontFamily: global.fontSelect,
                                marginRight: 5,
                              }}>
                              Liked
                            </Text>
                            <Text
                              style={[
                                styles.txtReaction,
                                {
                                  color: global.colorTextPrimary,
                                  fontFamily: global.fontSelect,
                                },
                              ]}>
                              {item.like_count}
                            </Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={() => this.replyFN(index)}>
                          <Text
                            style={{
                              color: global.colorTextPrimary,
                              fontFamily: global.fontSelect,
                            }}>
                            Reply
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                </View>
              ) : (
                <View style={{marginLeft: 35}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: windowWidth,
                      paddingRight: '15%',
                    }}>
                    <TouchableOpacity
                      style={{
                        borderRadius: 35,
                        borderColor: '#fff',
                        borderWidth: 2,
                        height: 38,
                      }}
                      onPress={() => this.navigateToProfile(navigation, item)}>
                      <Avatar
                        rounded
                        size="small"
                        source={{uri: item.UserImage}}
                      />
                    </TouchableOpacity>
                    <View
                      style={{
                        backgroundColor: global.colorSecondary,
                        marginLeft: 10,
                        paddingHorizontal: 15,
                        paddingVertical: 12,
                        borderRadius: 12,
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color: global.colorTextPrimary,
                          fontSize: 15,
                          fontWeight: 'bold',
                          marginBottom: 5,
                          fontFamily: global.fontSelect,
                          maxWidth: windowWidth * 0.637,
                        }}>
                        {item.UserName}
                      </Text>
                      <Text
                        style={{
                          color: global.colorTextPrimary,
                          fontFamily: global.fontSelect,
                        }}>
                        {decodeURIComponent(
                          JSON.parse(
                            '"' + item.text.replace(/\"/g, '\\"') + '"',
                          ),
                        )}
                      </Text>
                    </View>
                  </View>
                  {item.comment_id ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        width: (windowWidth * 44) / 100,
                        marginLeft: (windowWidth * 10) / 100,
                        marginTop: 2,
                      }}>
                      <Text
                        style={{
                          color: global.colorTextPrimary,
                          fontFamily: global.fontSelect,
                        }}>
                        {item.datetime}
                      </Text>
                      {item.IsLiked == 0 ? (
                        <TouchableOpacity
                          onPress={() => this.likeCommentFN(index)}
                          style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              color: global.colorTextPrimary,
                              fontFamily: global.fontSelect,
                              marginRight: 5,
                            }}>
                            Like
                          </Text>
                          <Text
                            style={[
                              styles.txtReaction,
                              {
                                color: global.colorTextPrimary,
                                fontFamily: global.fontSelect,
                              },
                            ]}>
                            {item.like_count}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => this.likeCommentFN(index)}
                          style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              color: global.colorTextActive,
                              fontFamily: global.fontSelect,
                              marginRight: 5,
                            }}>
                            Liked
                          </Text>
                          <Text
                            style={[
                              styles.txtReaction,
                              {
                                color: global.colorTextPrimary,
                                fontFamily: global.fontSelect,
                              },
                            ]}>
                            {item.like_count}
                          </Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity onPress={() => this.replyFN(index)}>
                        <Text
                          style={{
                            color: global.colorTextPrimary,
                            fontFamily: global.fontSelect,
                          }}>
                          Reply
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              )}
            </View>
          )}
        />

        <View style={{flexDirection: 'row', marginVertical: 7}}>
          <Avatar
            rounded
            size="medium"
            source={{uri: global.userData.imgurl}}
          />

          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              backgroundColor: global.commentInputColor,
              width: (windowWidth * 76) / 100,
              marginLeft: 10,
              borderRadius: 30,
            }}>
            <TextInput
              style={[
                styles.input,
                {
                  fontFamily: global.fontSelect,
                  width: (windowWidth * 63) / 100,
                },
              ]}
              placeholder={this.state.placeholderStat}
              placeholderTextColor={global.commentInputPlaceholderTextColor}
              value={decodeURIComponent(
                JSON.parse(
                  '"' + this.state.comment.replace(/\"/g, '\\"') + '"',
                ),
              )}
              multiline={true}
              onChangeText={text => {
                var unicodeString = '';
                for (var i = 0; i < text.length; i++) {
                  var theUnicode = text
                    .charCodeAt(i)
                    .toString(16)
                    .toUpperCase();
                  while (theUnicode.length < 4) {
                    theUnicode = '0' + theUnicode;
                  }
                  theUnicode = '\\u' + theUnicode;
                  unicodeString += theUnicode;
                }
                this.setState({comment: unicodeString});
              }}
              secureTextEntry={false}
              ref={'secondTextInput'}
            />
            <TouchableOpacity onPress={() => this.commentPlacedFN()}>
              <Text
                style={{
                  color: global.postTextComment,
                  fontFamily: global.fontSelect,
                }}>
                Post
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({
              modalVisible: !this.state.modalVisible,
            });
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={[styles.modalText, {fontFamily: global.fontSelect}]}>
                {this.state.message}
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: global.colorIcon,
    marginBottom: 25,
  },
  tinyLogo: {
    width: 30,
    height: 20,
    marginTop: 10,
    tintColor: global.colorIcon,
  },
  input: {
    height: 40,
    alignSelf: 'center',
    marginTop: 5,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#707070',
    fontFamily: 'OpenSans-Regular',
  },

  //modal Style
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '120%',
  },
  modalView: {
    margin: 20,
    borderColor: '#FBC848',
    borderWidth: 1,
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
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    elevation: 2,
    marginRight: '-72%',
    marginTop: '-11%',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#0B0213',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  modalText: {
    marginBottom: 0,
    marginTop: 5,
    textAlign: 'center',
    color: '#ffffff',
  },
});
