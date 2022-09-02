import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  MaskedViewIOS,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ImageBackground,
  ViewBase,
} from 'react-native';
import {Avatar} from 'react-native-elements';

var searchTxtchk = '';
var postDataVar = '';

export default function TagScreen({navigation}) {
  const [tagState, setTagState] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    setInterval(function () {
      // searchFN()
      assignTag();
    }, 2000);
  }, []);

  function assignTag() {
    if (global.responseTop) setTagState(global.responseTop.Tags);
  }

  function getPostsAgainstTag(index) {
    fetch(global.address + 'GetPostsByTag/' + tagState[index].tag_id, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        /* console.log('Posts....');
        console.log(responseJson.Posts); */

        postDataVar = responseJson.Posts;
        navigateToExpDetailFN(index);
      })
      .catch(error => {
        console.error(error);
      });
  }

  function navigateToExpDetailFN(index) {
    //Selected Post Storing
    global.selectedPostIndex = postDataVar[index];

    //delete selected post in array
    var requesrArr = postDataVar;
    requesrArr.splice(index, 1);
    // this.setState({
    //     PostData: requesrArr,
    // })

    global.remainingPost = requesrArr;

    global.searchText = '';
    searchTxtchk = '';
    global.tagName = tagState[index].tag_id;
    navigation.navigate('ExploreDetail');
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: global.colorPrimary,
        paddingHorizontal: 5,
      }}>
      <FlatList
        data={tagState}
        renderItem={({item, index}) => (
          <TouchableOpacity onPress={() => getPostsAgainstTag(index)}>
            <View
              style={{
                marginTop: 15,
                paddingBottom: 10,
                width: '100%',
                height: 70,
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomColor: global.resultsBorderBottomColor,
                borderBottomWidth: 1,
              }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#fff',
                  width: 50,
                  height: 50,
                  backgroundColor: '#0D0219',
                  borderRadius: 28,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 33,
                    fontFamily: global.fontSelect,
                  }}>
                  #
                </Text>
              </View>

              <View style={{width: '65%', height: 60, marginLeft: 10}}>
                <Text
                  style={{
                    color: global.colorTextPrimary,
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginTop: 4,
                    fontFamily: global.fontSelect,
                  }}>
                  {' '}
                  {item.tag_id}
                </Text>
                <Text
                  style={{
                    color: global.colorTextPrimary,
                    fontSize: 13,
                    marginTop: 2,
                    fontFamily: global.fontSelect,
                  }}>
                  {item.TotalPosts} posts
                </Text>
              </View>

              <View
                style={{
                  width: '15%',
                  height: 60,
                  marginLeft: 'auto',
                  flexDirection: 'row',
                }}>
                {/* <Image
                                        style={{ height: 15, width: 13, tintColor: '#B4B4B4', alignSelf: 'center', marginLeft: '10%' }}
                                        resizeMode='stretch'
                                        source={require('../../images/cross1.png')}
                                    /> */}
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        style={{borderRadius: 100, marginTop: 0, marginRight: 5}}
      />
    </View>
  );
}
