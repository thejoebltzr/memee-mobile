import React, {useState, useEffect} from 'react';
// import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Dimensions,
  Modal,
  Image,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ProgressBar, Colors} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';

var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;
var earndBadgesToStare = '';
export default function OrganizeBadges(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {selectedBadges} = useSelector(({authRed}) => authRed);
  const [searcTxt, setSearcTxt] = useState('');
  const [earnBadgeCollaps, setEarnBadgeCollaps] = useState(true);
  const [lockedBadgeCollaps, setLockedBadgeCollaps] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [earndeBadges, setEarndeBadges] = useState([]);
  const [lockedBadges, setlockedBadges] = useState([]);
  const [toUnlockBadge, setToUnlockBadge] = useState(null);
  const [filterArray, setFilterArray] = useState([
    {
      id: 1,
      title: 'All Rarities',
      color1: global.btnColor1,
      color: global.btnColor2,
      txtClr: global.btnTxt,
      rarity: '0',
    },
    {
      id: 2,
      title: 'Rarity: 1',
      color1: '#0D0219',
      color: '#0D0219',
      txtClr: '#fff',
      rarity: '1',
    },
    {
      id: 3,
      title: 'Rarity: 2',
      color1: '#0D0219',
      color: '#0D0219',
      txtClr: '#fff',
      rarity: '2',
    },
    {
      id: 4,
      title: 'Rarity: 3',
      color1: '#0D0219',
      color: '#0D0219',
      txtClr: '#fff',
      rarity: '3',
    },
  ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getEarnedBadges();
      getProgressBadge();
    });
    return unsubscribe;
  }, [navigation]);

  function showEarnedBadgesFN(value) {
    setEarnBadgeCollaps(value);
  }

  function showLockedBadgesFN(value) {
    setLockedBadgeCollaps(value);
  }

  function showFilterFN(value) {
    setShowFilter(value);
  }

  function filterSelectFN(index) {
    setEarndeBadges(earndBadgesToStare);
    /* console.log(' index Running..', index); */
    var arrayFilter = filterArray;
    for (let i = 0; i < filterArray.length; i++) {
      if (i == index) {
        arrayFilter[i].color = global.btnColor1;
        arrayFilter[i].color1 = global.btnColor2;
        arrayFilter[i].txtClr = global.btnTxt;
      } else {
        arrayFilter[i].color = '#0D0219';
        arrayFilter[i].color1 = '#0D0219';
        arrayFilter[i].txtClr = '#fff';
      }
    }

    var rarity = filterArray[index].rarity;

    var seachedCity = earndBadgesToStare.filter(function search(badge) {
      return badge.rarity.toUpperCase().includes(rarity.toUpperCase());
    });
    if (index == 0) {
      setEarndeBadges(earndBadgesToStare);
    } else {
      setEarndeBadges(seachedCity);
    }

    setFilterArray([...arrayFilter]);
  }

  function getEarnedBadges() {
    /* console.log('Running earned badges fn'); */
    fetch(global.address + 'GetBadges' + '/' + global.userData.user_id, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        var isSelectedVar = 0;
        responseJson.EarnedBages.forEach(function (element) {
          for (let i = 0; i <= selectedBadges.length - 1; i++) {
            if (selectedBadges[i].badge_name == element.badge_name) {
              isSelectedVar = 1;
            }
          }

          if (isSelectedVar == 1) {
            element.isSelected = true;
          } else {
            element.isSelected = false;
          }
          isSelectedVar = 0;
        });
        setEarndeBadges(responseJson.EarnedBages);

        earndBadgesToStare = responseJson.EarnedBages;
      })
      .catch(error => {
        console.error(error);
      });
  }

  function getProgressBadge() {
    fetch(
      global.address + 'GetBadgesProgress' + '/' + global.userData.user_id,
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
        /* console.log('\n earned Badges : \n', responseJson.BadgesProgress); */

        responseJson.BadgesProgress.forEach(function (element) {
          var doneProgress = element.total_items - element.remaining_items;
          element.percentProgress =
            (doneProgress * 100) / element.total_items / 100;
        });

        setlockedBadges(responseJson.BadgesProgress);
      })
      .catch(error => {
        console.error(error);
      });
  }

  function selectBadgesToShow(index) {
    var status = '';
    /* console.log('earndeBadges[index]', earndeBadges[index].badge_id); */
    if (earndeBadges[index].isSelected == true) {
      earndeBadges[index].isSelected = false;
      status = 'unchecked';
    } else {
      earndeBadges[index].isSelected = true;
      status = 'checked';
    }

    setEarndeBadges([...earndeBadges]);
    earndBadgesToStare = earndeBadges;

    fetch(global.address + 'OrganizeBadges', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
      body: JSON.stringify({
        userId: global.userData.user_id,
        badgeId: earndeBadges[index].badge_id,
        status: status,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        /* console.log('responseJson', responseJson); */
      })
      .catch(error => {
        console.error(error);
      });
  }

  function searchBadgesFN(value) {
    /* console.log('\n\n ', value); */
    setSearcTxt(value);

    var seachedCity = earndeBadges.filter(function search(badge) {
      return badge.badge_name.toUpperCase().includes(value.toUpperCase());
    });
    if (value == '') {
      setEarndeBadges(earndBadgesToStare);
    } else {
      setEarndeBadges(seachedCity);
    }
    /* console.log('\n seachedCity ', seachedCity); */
  }

  const DisplayUnlockedBadge = item => {
    //console.log(item);
    setToUnlockBadge(item);
    setModalVisible(!modalVisible);
  };

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
            Organize Badges
          </Text>
        </View>

        <View style={{flexDirection: 'row', width: '100%'}}>
          <View
            style={{
              flexDirection: 'row',
              height: 55,
              width: '75%',
              backgroundColor: global.searchInputColor,
              alignSelf: 'flex-start',
              borderRadius: 32,
            }}>
            <TouchableOpacity>
              {global.searchInputColor == '#FFFFFF' ? (
                <Image
                  style={{height: 23, width: 23, marginTop: 16, marginLeft: 15}}
                  resizeMode="stretch"
                  source={require('../../images/searchBlck.png')}
                />
              ) : (
                <Image
                  style={{height: 23, width: 23, marginTop: 16, marginLeft: 15}}
                  resizeMode="stretch"
                  source={require('../../images/search.png')}
                />
              )}
            </TouchableOpacity>
            <TextInput
              style={{
                marginLeft: 5,
                color: global.searchInputTextColor,
                width: '78%',
                fontFamily: global.fontSelect,
              }}
              placeholder="Search badges, rarity"
              placeholderTextColor={global.searchInputPlaceholderTextColor}
              value={searcTxt}
              onChangeText={text => searchBadgesFN(text)}
              secureTextEntry={false}
            />
          </View>

          {showFilter == false ? (
            <TouchableOpacity onPress={() => showFilterFN(true)}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: global.filterBtnColor,
                  height: 55,
                  width: 55,
                  borderRadius: 30,
                  marginLeft: 10,
                }}>
                <Image
                  style={{height: 23, width: 23}}
                  resizeMode="stretch"
                  source={require('../../images/Filter.png')}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => showFilterFN(false)}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: global.filterBtnColor,
                  height: 55,
                  width: 55,
                  borderRadius: 30,
                  marginLeft: 10,
                }}>
                <Image
                  style={{height: 15, width: 15}}
                  resizeMode="stretch"
                  source={require('../../images/cross22.png')}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {showFilter == false ? null : (
          <View>
            <Text
              style={{
                color: global.colorTextPrimary,
                marginTop: 10,
                marginLeft: '5%',
              }}>
              Filter
            </Text>
            {/* Filter FlatList */}
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={filterArray}
              renderItem={({item, index}) => (
                <TouchableOpacity onPress={() => filterSelectFN(index)}>
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
                        borderColor: '#676767',
                        borderRadius: 22,
                        paddingVertical: 10,
                      }}>
                      <Text
                        style={{
                          color: item.txtClr,
                          fontFamily: global.fontSelect,
                        }}>
                        #{item.title}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
              style={{borderRadius: 100, marginTop: 10, marginRight: 5}}
            />
          </View>
        )}

        {/* Earned Badges Collaps */}
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            alignSelf: 'center',
            marginTop: 22,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: global.colorTextPrimary,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            Earned Badges
          </Text>
          {earnBadgeCollaps == true ? (
            <TouchableOpacity
              style={{height: 11, width: 19}}
              onPress={() => showEarnedBadgesFN(false)}>
              <Image
                style={{height: 8, width: 15, tintColor: global.colorIcon}}
                resizeMode="stretch"
                source={require('../../images/upVector.png')}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{height: 11, width: 19}}
              onPress={() => showEarnedBadgesFN(true)}>
              <View>
                <Image
                  style={{height: 8, width: 15, tintColor: global.colorIcon}}
                  resizeMode="stretch"
                  source={require('../../images/downVector.png')}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {earnBadgeCollaps == true ? (
          <LinearGradient
            colors={global.earnedBadgesGradientColors}
            style={{
              alignItems: 'center',
              marginTop: (windowWidth * 5) / 100,
              borderRadius: (windowWidth * 10) / 100,
              width: (windowWidth * 90) / 100,
              paddingVertical: (windowWidth * 7) / 100,
              backgroundColor: global.colorSecondary,
            }}>
            <FlatList
              // horizontal={true}
              numColumns={4}
              data={earndeBadges}
              renderItem={({item, index}) => (
                <TouchableOpacity onPress={() => selectBadgesToShow(index)}>
                  <View
                    style={{
                      width: (windowWidth * 20) / 100,
                      alignItems: 'center',
                      marginVertical: (windowWidth * 1) / 100,
                    }}>
                    <View
                      style={{
                        borderRadius: (windowWidth * 15) / 100,
                        height: (windowWidth * 15) / 100,
                        width: (windowWidth * 15) / 100,
                        backgroundColor: '#fff',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{
                          width: (windowWidth * 10.5) / 100,
                          height: (windowWidth * 10.5) / 100,
                        }}
                        resizeMode="contain"
                        source={{uri: item.image_url}}
                      />
                    </View>
                    <Text
                      style={{
                        color: global.colorTextPrimary,
                        opacity: 0.5,
                        fontSize: 11,
                        marginTop: (windowWidth * 0.5) / 100,
                      }}>
                      {item.badge_name}
                    </Text>
                  </View>
                  {item.isSelected == true ? (
                    <Image
                      style={{width: 25, height: 25, position: 'absolute'}}
                      resizeMode="stretch"
                      source={require('../../images/GroupBlue.png')}
                    />
                  ) : null}
                </TouchableOpacity>
              )}
              keyExtractor={item => item.post_id}
              // style={{ marginTop: (windowWidth * 0) / 100, }}
            />
          </LinearGradient>
        ) : null}

        {/* Locked Badges Collaps */}
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            marginTop: 22,
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: global.colorTextPrimary,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            Locked Badges
          </Text>
          {lockedBadgeCollaps == true ? (
            <TouchableOpacity
              style={{height: 11, width: 19}}
              onPress={() => showLockedBadgesFN(false)}>
              <Image
                style={{height: 8, width: 15, tintColor: global.colorIcon}}
                resizeMode="stretch"
                source={require('../../images/upVector.png')}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{height: 11, width: 19}}
              onPress={() => showLockedBadgesFN(true)}>
              <View>
                <Image
                  style={{height: 8, width: 15, tintColor: global.colorIcon}}
                  resizeMode="stretch"
                  source={require('../../images/downVector.png')}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {lockedBadgeCollaps == true ? (
          <FlatList
            // horizontal={true}
            numColumns={2}
            data={lockedBadges}
            renderItem={({item, index}) => (
              <View
                style={{
                  padding: (windowWidth * 3.5) / 100,
                  borderRadius: (windowWidth * 5) / 100,
                  backgroundColor:
                    index <= 1 && global.cust_item_code === 'roygbiv-pink'
                      ? global.lockedBadgesBG
                      : global.lockedBadgesAboveTop2,
                  width: (windowWidth * 40) / 100,
                  marginHorizontal: (windowWidth * 1.5) / 100,
                  marginTop: (windowWidth * 4) / 100,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      borderRadius: (windowWidth * 3) / 100,
                      height: (windowWidth * 10.5) / 100,
                      width: (windowWidth * 10.5) / 100,
                      backgroundColor: '#FFFFFF22',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        width: (windowWidth * 6) / 100,
                        height: (windowWidth * 6) / 100,
                      }}
                      resizeMode="stretch"
                      source={{uri: item.image_url}}
                    />
                  </View>

                  <TouchableOpacity onPress={() => DisplayUnlockedBadge(item)}>
                    <Image
                      style={{
                        width: (windowWidth * 4) / 100,
                        height: (windowWidth * 5.3) / 100,
                      }}
                      resizeMode="stretch"
                      source={require('../../images/Lock.png')}
                    />
                  </TouchableOpacity>
                </View>

                <Text
                  style={{
                    color: global.lockedBadgesTitleColor,
                    fontSize: 13,
                    marginTop: (windowWidth * 0.8) / 100,
                  }}>
                  {item.badge_name}
                </Text>
                <Text
                  style={{
                    color:
                      index > 1 ? '#FFF62A' : global.lockedBadgesSubTitleColor,
                    fontSize: 10,
                    marginTop: (windowWidth * 0.8) / 100,
                  }}>
                  {item.description}
                </Text>
                <Text
                  style={{
                    color: global.lockedBadgesRarityColor,
                    fontSize: 10,
                    marginTop: (windowWidth * 1.4) / 100,
                  }}>
                  Rarity: {item.rarity}
                </Text>
                <Text
                  style={{
                    color: global.lockedBadgesPointsColor,
                    fontSize: 10,
                    marginTop: (windowWidth * 4.5) / 100,
                    marginBottom: (windowWidth * 1.5) / 100,
                  }}>
                  {item.remaining_items} points need
                </Text>

                <ProgressBar
                  style={{marginBottom: 10}}
                  progress={item.percentProgress}
                  color={index === 1 ? '#FFFFFF' : '#FFCD2F'}
                />
              </View>
            )}
            keyExtractor={item => item.badge_id}
            style={{marginTop: (windowWidth * 3) / 100, marginBottom: 10}}
          />
        ) : null}
      </ScrollView>

      <Modal
        animationType=""
        transparent={true}
        presentationStyle="overFullScreen"
        visible={modalVisible}
        onRequestClose={() => {
          // alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={{
                width: (windowWidth * 25) / 100,
                height: (windowWidth * 25) / 100,
                marginBottom: 20,
              }}
              resizeMode="stretch"
              source={{uri: toUnlockBadge?.image_url}}
              //require('../../images/1stPrize.png')
            />
            <Text style={[styles.modalText, {fontFamily: global.fontSelect}]}>
              {toUnlockBadge?.badge_name || '1st Place Badge'}
            </Text>

            {toUnlockBadge?.percentProgress >= 1 ? (
              <Text
                style={{
                  color: '#fff',
                  opacity: 0.5,
                  fontSize: 13,
                  textAlign: 'center',
                  fontFamily: global.fontSelect,
                }}>
                Congratulations!!! You have succesfully unlocked{' '}
                {toUnlockBadge?.badge_name || '1st place badge'}.
              </Text>
            ) : (
              <View>
                <Text
                  style={{
                    color: '#fff',
                    opacity: 0.5,
                    fontSize: 13,
                    textAlign: 'center',
                    fontFamily: global.fontSelect,
                  }}>
                  Sorry!!! You can't unlock this{' '}
                  {toUnlockBadge?.badge_name || '1st place badge'} badge as of
                  the moment.
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    opacity: 0.5,
                    fontSize: 13,
                    textAlign: 'center',
                    fontFamily: global.fontSelect,
                    fontWeight: 'bold',
                  }}>
                  Progress to UNLOCK: {toUnlockBadge?.percentProgress * 100}%
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <LinearGradient
                colors={[global.btnColor1, global.btnColor2]}
                style={{
                  borderRadius: 25,
                  paddingVertical: 13,
                  paddingHorizontal: 40,
                }}>
                <Text
                  style={[styles.textStyle, {fontFamily: global.fontSelect}]}>
                  Done
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
  //Modal CSS
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#292929',
    borderRadius: 23,
    paddingHorizontal: 25,
    paddingVertical: 35,
    width: '72%',
    borderColor: '#fff',
    borderWidth: 2,
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
    borderRadius: 25,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    // backgroundColor: "#2196F3",
    marginTop: 40,
  },
  textStyle: {
    color: 'black',
    fontWeight: '800',
    textAlign: 'center',
  },
  modalText: {
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
