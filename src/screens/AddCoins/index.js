import React, {useState, useEffect} from 'react';
// import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Switch,
  Dimensions,
  BackHandler,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonLarge from '../../component/ButtonLarge';
import Carousel from 'react-native-snap-carousel';
import LinearGradient from 'react-native-linear-gradient';
import {LinearTextGradient} from 'react-native-text-gradient';
import ButtonCoins from '../../component/ButtonCoins';
// import * as RNIap from 'react-native-iap';
import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  // type ProductPurchase,
  // type PurchaseError
} from 'react-native-iap';
import {currentDateFN} from '../../Utility/Utils';
import Moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {coinsRecordFN} from '../../redux/actions/Auth';
import Toast from 'react-native-toast-message';

var windowWidth = Dimensions.get('window').width;
// let purchaseUpdateSubscription;
let purchaseUpdateSubscription = null;
let purchaseErrorSubscription = null;
let currentProduct = null;
var currentDate = '';
windowWidth = (windowWidth * 85) / 100;
export default function AddCoins(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {coinsStored} = useSelector(({authRed}) => authRed);

  const [activeIndex, setActiveIndex] = useState();
  const [coinsHandle, setCoinsHandle] = useState('1');
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState(false);
  const [productsData, setProducts] = useState([]);
  const [coinsInPuchase, setCoinsInPuchase] = useState(false);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(async () => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (global.adcoinAlert == '1') {
        global.adcoinAlert = '0';
        Toast.show({
          type: 'error',
          test1: 'Alert!',
          text2: "Not enough coins. Let's buy some!",
        });
      }
      getProducts();
      showPurchaseHistory();
    });
    return unsubscribe;
  }, [navigation]);

  async function getProducts() {
    await RNIap.initConnection();
    const productIds = Platform.select({
      ios: ['com.convrtx.memee.coins10000'],
      android: ['coins10000', 'coins1000'],
    });
    /* console.log('PIDS: ' + productIds); */
    try {
      var products = await RNIap.getProducts(productIds);

      products.forEach(function (element) {
        element.loader = false;
      });
      setProducts(products);
    } catch (err) {
      console.log(err);
      // standardized err.code and err.message available
    }
  }

  function showPurchaseHistory() {
    var currentDate = currentDateFN();

    fetch(
      global.address + 'GetTransactionsHistory/' + global.userData.user_id,
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
        if (responseJson.Status == '200') {
          setTransactionHistory(responseJson.TransactionHistory);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  async function purchaseProducts(index) {
    /* console.log('niggacat', productsData[index]); */

    var forLoader = productsData;
    forLoader[index].loader = true;
    setProducts([...forLoader]);
    setCoinsInPuchase(true);

    currentProduct = productsData[index];

    RNIap.initConnection().then(() => {
      RNIap.flushFailedPurchasesCachedAsPendingAndroid()
        .catch(() => {})
        .then(() => {
          purchaseUpdateSubscription = purchaseUpdatedListener(
            (purchase = InAppPurchase) => {
              if (purchaseUpdateSubscription == null) return;

              const receipt = purchase.transactionReceipt;

              try {
                // If consumable (can be purchased again)
                RNIap.finishTransaction(purchase, true);
                // If not consumable
                // await RNIap.finishTransaction(purchase, false);
              } catch (error) {
                console.log('Error: ', error);
              }

              //There is a bug in this listener that calls it many times. As a workaround, assigning it null
              purchaseUpdateSubscription = null;

              if (receipt) {
                currentDate = currentDateFN();
                /* console.log('here1'); */
                fetch(global.address + 'PurchaseCoins', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    authToken: global.token,
                  },

                  body: JSON.stringify({
                    userId: global.userData.user_id,
                    name: global.userData.name,
                    coins: parseInt(currentProduct.description),
                    price: currentProduct.price,
                    currency: currentProduct.currency,
                    payment_method: 'Card',
                    dateTime: currentDate,
                  }),
                })
                  .then(response => response.json())
                  .then(async responseJson => {
                    /* console.log('here2'); */
                    global.userData.coins =
                      parseInt(global.userData.coins) +
                      parseInt(currentProduct.description);

                    dispatch(coinsRecordFN(global.userData.coins));
                    setCoinsInPuchase(false);
                    var forLoader = productsData;
                    forLoader[index].loader = false;
                    setProducts([...forLoader]);
                    /* console.log('here3'); */
                    navigation.navigate('CoinsConfirmation', {
                      coins: currentProduct.description,
                    });
                    /* console.log(' add Transaction... : ', responseJson); */
                    currentProduct = null;
                  })
                  .catch(error => {
                    console.error(error);
                  });
              }
            },
          );

          purchaseErrorSubscription = purchaseErrorListener(
            (error = PurchaseError) => {
              setCoinsInPuchase(false);

              var forLoader = productsData;
              forLoader[index].loader = false;
              setProducts([...forLoader]);
              if (purchaseErrorSubscription == null) return;

              console.warn('purchaseErrorListener', error);
              //handle error
              currentProduct = null;

              purchaseErrorSubscription = null;
            },
          );
        });
    });

    var productID = currentProduct.productId;
    try {
      RNIap.initConnection().then(() => {
        RNIap.requestPurchase(productID, false);
      });
    } catch (err) {
      var forLoader = productsData;
      forLoader[index].loader = false;
      setProducts([...forLoader]);
      console.warn(err.code, err.message);
    }
  }

  return (
    <View
      style={{flex: 1, paddingTop: '5%', backgroundColor: global.colorPrimary}}>
      <ScrollView>
        <View style={{flexDirection: 'row', marginLeft: '4%', marginTop: 10}}>
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
            Add Coins
          </Text>

          <View style={{marginLeft: 'auto'}}></View>
          <ButtonCoins
            title={coinsStored}
            showAdd="1"
            font={global.fontSelect}
            onPress={() => navigation.navigate('AddCoins')}
          />
        </View>

        <Carousel
          layout={'default'}
          //   ref={ref => this.carousel = ref}
          data={productsData}
          sliderWidth={windowWidth + (windowWidth * 24) / 100}
          itemWidth={windowWidth - (windowWidth * 12) / 100 + 2}
          renderItem={({item, index}) => (
            <View
              style={{
                backgroundColor: 'floralwhite',
                borderRadius: 22,
                borderWidth: 1,
                borderColor: '#fff',
                height: windowWidth + (windowWidth * 10) / 100 + 2,
                width: windowWidth - (windowWidth * 15) / 100 + 2,
                // padding: 5,
              }}>
              <ImageBackground
                style={{
                  height: windowWidth + (windowWidth * 10) / 100,
                  width: windowWidth - (windowWidth * 15) / 100,
                }}
                source={require('../../images/COins2.png')}
                imageStyle={{borderRadius: 22}}>
                <Text
                  style={{
                    fontFamily: global.fontSelect,
                    fontSize: 40,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#FFB800',
                    marginTop: windowWidth - (windowWidth * 47) / 100,
                  }}>
                  {item.description}
                </Text>
                <Text
                  style={{
                    fontFamily: global.fontSelect,
                    fontSize: 34,
                    textAlign: 'center',
                    color: '#FFB800',
                    marginTop: -(windowWidth - (windowWidth * 95) / 100),
                  }}>
                  Coins
                </Text>

                <TouchableOpacity
                  style={{paddingHorizontal: 35, paddingVertical: 15}}
                  onPress={() => purchaseProducts(index)}>
                  <LinearGradient
                    colors={['#73FF66', '#19850F']}
                    style={{
                      paddingHorizontal: 35,
                      minWidth: 185,
                      paddingVertical: 15,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      borderRadius: 25,
                    }}>
                    {item.loader == true ? (
                      <ActivityIndicator animating={true} color="#ffffff" />
                    ) : (
                      <Text
                        style={{color: '#fff', fontFamily: global.fontSelect}}>
                        Buy in {item.localizedPrice}
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          )}
          onSnapToItem={index => setActiveIndex(index)}
        />

        {transactionHistory.length > 0 ? (
          <View
            style={{
              width: '90%',
              flexDirection: 'row',
              marginTop: 20,
              marginLeft: 15,
              marginBottom: 10,
            }}>
            <Text
              style={{
                color: global.colorTextPrimary,
                fontFamily: global.fontSelect,
              }}>
              Purchasing History
            </Text>
          </View>
        ) : null}

        <FlatList
          // horizontal={true}
          // showsHorizontalScrollIndicator={false}
          data={transactionHistory}
          renderItem={({item, index}) => (
            <View>
              {/* <TouchableOpacity> */}
              <View
                style={{
                  width: '95%',
                  alignSelf: 'center',
                  marginTop: 5,
                  marginBottom: 5,
                  height: 50,
                  borderRadius: 25,
                  flexDirection: 'row',
                  backgroundColor: '#292929',
                }}>
                <View style={{width: '25%', height: 50, borderRadius: 22}}>
                  <LinearGradient
                    colors={['#B461F4', '#671BA3']}
                    style={{
                      height: 50,
                      width: '100%',
                      borderRadius: 22,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 15,
                        fontFamily: global.fontSelect,
                      }}>
                      {Moment(item.datetime).format('DD MMM')}
                    </Text>
                  </LinearGradient>
                </View>

                <View style={{width: '41%', flexDirection: 'row'}}>
                  <View style={{marginLeft: '17%'}}>
                    <Image
                      style={{height: 22, width: 22, marginTop: 12}}
                      resizeMode="stretch"
                      source={require('../../images/Coin.png')}
                    />
                  </View>
                  <Text
                    style={{
                      marginLeft: '1%',
                      color: '#FFB800',
                      fontSize: 17,
                      fontWeight: 'bold',
                      marginTop: 11,
                      textAlign: 'center',
                      fontFamily: global.fontSelect,
                    }}>
                    {item.coins}
                  </Text>
                </View>

                <View style={{marginLeft: '12%', width: '20%', marginTop: 5}}>
                  <LinearGradient
                    colors={['#74FF67', '#1D8B14']}
                    style={{
                      height: 40,
                      width: '100%',
                      borderRadius: 22,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{color: '#fff', fontFamily: global.fontSelect}}>
                      {item.currency + ' ' + item.price}
                    </Text>
                  </LinearGradient>
                </View>
              </View>
              {/* </TouchableOpacity> */}
            </View>
          )}
        />
      </ScrollView>
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

  //modal Style
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
});
