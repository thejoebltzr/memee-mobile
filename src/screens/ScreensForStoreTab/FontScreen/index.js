import React, {useState, useEffect} from 'react';
// import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  MaskedViewIOS,
  Dimensions,
  Modal,
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
import {useDispatch, useSelector} from 'react-redux';
import {coinsRecordFN} from '../../../redux/actions/Auth';

import axios from 'axios';
var windowWidth = Dimensions.get('window').width;

export default function FontScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('You have purchased successfully.');

  const [iconList, setIconList] = useState([
    {
      id: '0',
      name: 'Font Style 1',
      font: 'DancingScript-Bold',
      loadIndicat: 0,
    },
    {
      id: '1',
      name: 'Font Style 2',
      font: 'Arial',
      loadIndicat: 0,
    },
    {
      id: '2',
      name: 'Font Style 4',
      font: 'Unkempt-Bold',
      loadIndicat: 0,
    },
  ]);

  useEffect(() => {
    getprofileBgFN();
  }, []);

  useEffect(() => {
    console.log(iconList);
  }, [iconList]);

  async function getprofileBgFN() {
    /* console.log('Button Screen Running...'); */

    await fetch(
      global.address + 'GetStoreItems/' + global.userData.user_id + '/font',
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
        /* console.log('Profile Background get Font....');
        console.log(responseJson.StoreItems); */

        responseJson.StoreItems.forEach(function (element) {
          element.font = '';
          element.name = '';
          element.loadIndicat = 0;
        });

        for (let i = 0; i < responseJson.StoreItems.length; i++) {
          responseJson.StoreItems[i].font = asignImageToProductsFN(
            responseJson.StoreItems[i].item_code,
            responseJson.StoreItems[i].type,
          )[0].font;
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

  async function purchaseFontFN(index) {
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
          /*  console.log('Icons get purchase....');
          console.log(responseJson); */

          if (responseJson.Status == '201') {
            var sms =
              'You have purchased ' + iconList[index].name + ' successfully.';

            var iconListVar = iconList;
            iconListVar[index].loadIndicat = 0;
            iconListVar.splice(index, 1);
            setIconList([...iconListVar]);
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
                height: (windowWidth * 43) / 100,
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
                    onPress={() => purchaseFontFN(index)}
                  />
                </View>
              </View>

              <TouchableOpacity style={{marginTop: 26}}>
                <View
                  style={{
                    borderColor: '#4A4A4A',
                    borderWidth: 1,
                    borderRadius: 40,
                    width: '93%',
                    height: 58,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 17,
                      fontFamily: item.font,
                    }}>
                    I love memee app
                  </Text>
                </View>
              </TouchableOpacity>
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
