import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  ImageBackground,
  ViewBase,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {RECENT_SEARCHES} from '../../redux/constants';
import {useSelector, useDispatch} from 'react-redux';

var searchTxtchk = '';
var postDataVar = '';
export default function TopScreen({navigation}) {
  const {recentSearches} = useSelector(({authRed}) => authRed);

  const [searchData, setSearchData] = useState('');
  const [tagState, setTagState] = useState('');
  const [email, setEmail] = useState('');
  const [recentSearch, setRecentSearch] = useState(recentSearches);
  const dispatch = useDispatch();

  useEffect(() => {
    // clearInterval()
    setInterval(function () {
      // searchFN()
      assignTop();
    }, 2000);
  }, []);

  function assignTop() {
    if (global.responseTop) {
      setTagState(global.responseTop.Tags);
      setSearchData(global.responseTop.Users);
    }
  }

  function navigateToProfile(user) {
    try {
      if (!recentSearch || !recentSearch.some(e => e.user_id == user.user_id)) {
        let searchedProfile = {
          user_id: user.user_id,
          imgurl: user.imgurl,
          name: user.name,
          email: user.email,
        };
        if (!recentSearch) recentSearch = [];

        let arr = [searchedProfile, ...recentSearch];
        setRecentSearch(arr);
        dispatch({type: RECENT_SEARCHES, data: arr});
      }
    } catch (err) {}

    global.profileID = user.user_id;
    navigation.navigate('ProfileScreen');

    global.searchText = '';
    searchTxtchk = '';
  }

  function removeSearchItem(index) {
    let arr = recentSearch;
    arr.splice(index, 1);
    setRecentSearch(arr);
    dispatch({type: RECENT_SEARCHES, data: arr});
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
    global.selectedPost = postDataVar[index];
    //delete selected post in array
    var requesrArr = postDataVar;
    requesrArr.splice(index, 1);
    // this.setState({
    //     PostData: requesrArr,
    // })

    global.remainingPost = requesrArr;

    // this.state.PostData.push(global.selectedPost)

    // console.log("after Pushing...")
    // console.log(this.state.PostData)
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
        data={searchData}
        renderItem={({item, index}) => (
          <TouchableOpacity onPress={() => navigateToProfile(item)}>
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
              <Avatar rounded size="medium" source={{uri: item.imgurl}} />

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
                  {item.name}
                </Text>
                <Text
                  style={{
                    color: global.colorTextPrimary,
                    fontSize: 13,
                    marginTop: 2,
                    fontFamily: global.fontSelect,
                  }}>
                  {item.email}
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
        style={{borderRadius: 100, marginTop: 10, marginRight: 5}}
      />

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
                }}></View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        style={{borderRadius: 100, marginTop: 0, marginRight: 5}}
      />
      {recentSearch && recentSearch.length > 0 ? (
        <View>
          <Text
            style={{
              color: global.colorTextPrimary,
              fontSize: 16,
              fontWeight: 'bold',
              marginTop: 20,
              fontFamily: global.fontSelect,
            }}>
            {' '}
            Recent Searches
          </Text>
          <FlatList
            data={recentSearch}
            renderItem={({item, index}) => (
              <TouchableOpacity onPress={() => navigateToProfile(item)}>
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
                  <Avatar rounded size="medium" source={{uri: item.imgurl}} />

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
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        color: global.colorTextPrimary,
                        fontSize: 13,
                        marginTop: 2,
                        fontFamily: global.fontSelect,
                      }}>
                      {item.email}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => removeSearchItem(index)}
                    style={{
                      width: '15%',
                      height: 60,
                      marginLeft: 'auto',
                      flexDirection: 'row',
                    }}>
                    <Image
                      style={{
                        height: 18,
                        width: 18,
                        tintColor: global.colorIcon,
                        alignSelf: 'center',
                        marginLeft: '10%',
                      }}
                      resizeMode="stretch"
                      source={require('../../images/cross1.png')}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            style={{borderRadius: 100, marginTop: 10, marginRight: 5}}
          />
        </View>
      ) : null}
    </View>
  );
}
