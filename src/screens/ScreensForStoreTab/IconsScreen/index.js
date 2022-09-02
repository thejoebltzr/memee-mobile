import React, {useState, useEffect} from 'react';
// import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  MaskedViewIOS,
  Modal,
  Dimensions,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ImageBackground,
  ViewBase,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import ButtonCoinsShort from '../../../component/ButtonCoinsShort';
import {currentDateFN, asignImageToProductsFN} from '../../../Utility/Utils';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {coinsRecordFN} from '../../../redux/actions/Auth';

import axios from 'axios';
var windowWidth = Dimensions.get('window').width;

export default function IconsScreen() {
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const [iconList, setIconList] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('You have purchased successfully.');

  useEffect(() => {
    getIconFN();
  }, []);

  async function getIconFN() {
    /* console.log('Icons Screen Running...'); */

    await fetch(
      global.address + 'GetStoreItems/' + global.userData.user_id + '/icon',
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
      .then(async responseJson => {
        /* console.log('Icons get api...');
        console.log(global.address);
        console.log(global.token);
        console.log(responseJson.StoreItems); */

        responseJson.StoreItems.forEach(function (element) {
          element.img = '';
          element.name = '';
          element.loadIndicat = 0;
        });

        /* console.log('Icons get...After...'); */

        for (let i = 0; i < responseJson.StoreItems.length; i++) {
          /* console.log(
            'responseJson.StoreItems : ',
            responseJson.StoreItems[i].item_code,
          ); */
          responseJson.StoreItems[i].img = asignImageToProductsFN(
            responseJson.StoreItems[i].item_code,
            responseJson.StoreItems[i].type,
          )[0].imag;
          responseJson.StoreItems[i].name = asignImageToProductsFN(
            responseJson.StoreItems[i].item_code,
            responseJson.StoreItems[i].type,
          )[0].themeName;
        }

        setIconList(responseJson.StoreItems);
      })
      .catch(error => {
        console.error(error);
      });
  }

  async function purchaseIconsFN(index) {
    global.refreshBadges = true;

    var iconListVar = iconList;
    iconListVar[index].loadIndicat = 1;

    setIconList([...iconListVar]);

    if (parseInt(iconList[index].coins) < global.userData.coins) {
      var tempCoin = global.userData.coins - iconList[index].coins;
      global.userData.coins = tempCoin;

      dispatch(coinsRecordFN(global.userData.coins));

      var currentDate = currentDateFN();
      await fetch(global.address + 'PurchaseStoreItem', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authToken: global.token,
        },
        body: JSON.stringify({
          itemId: iconList[index].item_id,
          coins: iconList[index].coins,
          userId: global.userData.user_id,
          dateTime: currentDate,
        }),
      })
        .then(response => response.json())
        .then(async responseJson => {
          /* console.log('Icons get purchase....');
          console.log(responseJson); */

          if (responseJson.Status == '201') {
            var sms =
              'You have purchased ' + iconList[index].name + ' successfully.';

            var iconListVar = iconList;
            iconListVar[index].loadIndicat = 0;
            iconListVar.splice(index, 1);
            setIconList([...iconListVar]);

            /* console.log('iconList', iconList); */

            setMessage(sms);
            setModalVisible(!modalVisible);
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      /* console.log('not enough coins'); */
      var iconListVar = iconList;
      iconListVar[index].loadIndicat = 0;

      setIconList([...iconListVar]);

      global.adcoinAlert = '1';
      navigation.navigate('AddCoins');
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: global.colorPrimary}}>
      <ScrollView>
        <FlatList
          data={iconList}
          renderItem={({item, index}) => (
            <View
              style={{
                width: (windowWidth * 90) / 100,
                backgroundColor: '#201F38',
                borderRadius: (windowWidth * 10) / 100,
                alignSelf: 'center',
                marginTop: 30,
              }}>
              <View
                style={{flexDirection: 'row', marginTop: 20, marginLeft: 18}}>
                <Text style={{color: '#fff', opacity: 0.5}}>{item.name}</Text>

                <View style={{marginLeft: 'auto', marginRight: 20}}>
                  <ButtonCoinsShort
                    title={item.coins}
                    showAdd="2"
                    font=""
                    loading={item.loadIndicat}
                    onPress={() => purchaseIconsFN(index)}
                  />
                </View>
              </View>

              <View>
                <Image
                  style={{
                    height: 90,
                    width: '90%',
                    alignSelf: 'center',
                    marginBottom: 10,
                  }}
                  resizeMode="contain"
                  source={item.img}
                />
              </View>
            </View>
          )}
          keyExtractor={item => item.id}
          // style={{ borderRadius: 100, marginTop: 3 }}
        />

        {/* <Text style={{ marginBottom: 20 }}> Icons Screens</Text> */}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>x</Text>
                        </Pressable> */}

            <TouchableOpacity
              onPress={() => setModalVisible(!modalVisible)}
              style={{
                marginLeft: 'auto',
                marginTop: -(windowWidth * 11.5) / 100,
              }}>
              <Image
                style={{
                  height: (windowWidth * 6) / 100,
                  width: (windowWidth * 6) / 100,
                  alignSelf: 'center',
                }}
                resizeMode="stretch"
                source={require('../../../images/cross.png')}
              />
            </TouchableOpacity>

            <Image
              style={{
                height: (windowWidth * 37) / 100,
                width: (windowWidth * 37) / 100,
                tintColor: '#73FF66ee',
                alignSelf: 'center',
                marginTop: (windowWidth * 5) / 100,
              }}
              resizeMode="stretch"
              source={require('../../../images/success.png')}
            />

            <Text
              style={[
                styles.modalText,
                {
                  fontFamily: global.fontSelect,
                  fontSize: 20,
                  marginTop: (windowWidth * 6) / 100,
                },
              ]}>
              Successful
            </Text>
            <Text
              style={[
                styles.modalText,
                {fontFamily: global.fontSelect, fontSize: 12, opacity: 0.5},
              ]}>
              {' '}
              {message}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  //modal Style
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: '120%',
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
    height: (windowWidth * 90) / 100,
    width: (windowWidth * 80) / 100,
    justifyContent: 'center',
    alignItems: 'center',
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
