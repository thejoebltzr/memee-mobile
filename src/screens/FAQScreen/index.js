import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from 'accordion-collapse-react-native';
import {colors} from '../../Utility/colors';

export default function FAQScreen(props) {
  const navigation = useNavigation();

  const [collapsColorCoin, setCollapsColorCoin] = useState('#0B0213');
  const [coinsToggle, setCoinsToggle] = useState(true);

  const [collapsColorPayment, setCollapsColorPayment] = useState('#0B0213');
  const [paymentToggle, setPaymentToggle] = useState(true);

  const [collapsColorCancelRequest, setCollapsColorCancelRequest] =
    useState('#0B0213');
  const [cancelRequestToggle, setCancelRequestToggle] = useState(true);

  const [collapsColorRemove, setCollapsColorRemove] = useState('#0B0213');
  const [RemoveToggle, setRemoveToggle] = useState(true);

  const [collapsColorTournament, setCollapsColorTournament] =
    useState('#0B0213');
  const [tournamentToggle, setTournamentToggle] = useState(true);

  function onTogleChanging(value) {
    if (value == '1') {
      if (coinsToggle == true) {
        setCollapsColorCoin('#201E23');
      } else {
        setCollapsColorCoin('#0B0213');
      }
      setCoinsToggle(!coinsToggle);
    }

    if (value == '2') {
      if (paymentToggle == true) {
        setCollapsColorPayment('#201E23');
      } else {
        setCollapsColorPayment('#0B0213');
      }
      setPaymentToggle(!paymentToggle);
    }

    if (value == '3') {
      if (cancelRequestToggle == true) {
        setCollapsColorCancelRequest('#201E23');
      } else {
        setCollapsColorCancelRequest('#0B0213');
      }
      setCancelRequestToggle(!cancelRequestToggle);
    }

    if (value == '4') {
      if (RemoveToggle == true) {
        setCollapsColorRemove('#201E23');
      } else {
        setCollapsColorRemove('#0B0213');
      }
      setRemoveToggle(!RemoveToggle);
    }

    if (value == '5') {
      if (tournamentToggle == true) {
        setCollapsColorTournament('#201E23');
      } else {
        setCollapsColorTournament('#0B0213');
      }
      setTournamentToggle(!tournamentToggle);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        paddingLeft: '5%',
        paddingTop: '5%',
        backgroundColor: global.colorPrimary,
        /* backgroundColor: colors.backgroundColor, */
      }}>
      <ScrollView>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={[
                styles.tinyLogo,
                {
                  /* tintColor: colors.textColor, */
                  tintColor: global.colorIcon,
                },
              ]}
              source={require('../../images/back1.png')}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.title,
              {
                fontFamily: global.fontSelect,
                color: global.colorIcon,
                /* color: colors.textColor */
              },
            ]}>
            FAQs
          </Text>
        </View>

        <Text
          style={[
            styles.title,
            {fontFamily: global.fontSelect, color: global.colorIcon},
          ]}>
          How can we help you
        </Text>

        <Collapse
          onToggle={() => onTogleChanging(1)}
          style={{
            borderWidth: 1,
            borderColor: '#454545',
            width: '90%',
            padding: 18,
            borderRadius: 20,
            backgroundColor: collapsColorCoin,
          }}>
          <CollapseHeader>
            <View style={{flexDirection: 'row', width: '98%'}}>
              <Text style={{color: '#fff', fontSize: 15, width: '87%'}}>
                How do I buy coins?
              </Text>

              {coinsToggle == true ? (
                <Image
                  style={{
                    height: 15,
                    width: 9,
                    tintColor: '#FFFFFF77',
                    alignSelf: 'center',
                    marginLeft: 'auto',
                  }}
                  resizeMode="stretch"
                  source={require('../../images/farward.png')}
                />
              ) : (
                <Image
                  style={{
                    height: 11,
                    width: 15,
                    tintColor: '#FFFFFF77',
                    alignSelf: 'center',
                    marginLeft: 'auto',
                  }}
                  resizeMode="stretch"
                  source={require('../../images/downVector.png')}
                />
              )}
            </View>
          </CollapseHeader>
          <CollapseBody style={{marginTop: 10}}>
            <Text style={{color: '#D6D6D6', opacity: 0.4}}>
              You can buy coins from Add coins page by your card. Thanks!
            </Text>
          </CollapseBody>
        </Collapse>

        <Collapse
          onToggle={() => onTogleChanging(2)}
          style={{
            marginTop: 18,
            borderWidth: 1,
            borderColor: '#454545',
            width: '90%',
            padding: 18,
            borderRadius: 20,
            backgroundColor: collapsColorPayment,
          }}>
          <CollapseHeader>
            <View style={{flexDirection: 'row', width: '98%'}}>
              <Text style={{color: '#fff', fontSize: 15, width: '87%'}}>
                What methods of payment does memee accept?
              </Text>

              {paymentToggle == true ? (
                <Image
                  style={{
                    height: 15,
                    width: 9,
                    tintColor: '#FFFFFF77',
                    alignSelf: 'center',
                    marginLeft: 'auto',
                  }}
                  resizeMode="stretch"
                  source={require('../../images/farward.png')}
                />
              ) : (
                <Image
                  style={{
                    height: 11,
                    width: 15,
                    tintColor: '#FFFFFF77',
                    alignSelf: 'center',
                    marginLeft: 'auto',
                  }}
                  resizeMode="stretch"
                  source={require('../../images/downVector.png')}
                />
              )}
            </View>
          </CollapseHeader>
          <CollapseBody style={{marginTop: 10}}>
            <Text style={{color: '#D6D6D6', opacity: 0.4}}>
              Memee accepts a variety of payment methods which includes
              Credit/Debit Cards, Google Pay, and Apple Pay
            </Text>
          </CollapseBody>
        </Collapse>

        <Collapse
          onToggle={() => onTogleChanging(3)}
          style={{
            marginTop: 18,
            borderWidth: 1,
            borderColor: '#454545',
            width: '90%',
            padding: 18,
            borderRadius: 20,
            backgroundColor: collapsColorCancelRequest,
          }}>
          <CollapseHeader>
            <View style={{flexDirection: 'row', width: '98%'}}>
              <Text style={{color: '#fff', fontSize: 15, width: '87%'}}>
                How do I place a cancellation request?
              </Text>

              {cancelRequestToggle == true ? (
                <Image
                  style={{
                    height: 15,
                    width: 9,
                    tintColor: '#FFFFFF77',
                    alignSelf: 'center',
                    marginLeft: 'auto',
                  }}
                  resizeMode="stretch"
                  source={require('../../images/farward.png')}
                />
              ) : (
                <Image
                  style={{
                    height: 11,
                    width: 15,
                    tintColor: '#FFFFFF77',
                    alignSelf: 'center',
                    marginLeft: 'auto',
                  }}
                  resizeMode="stretch"
                  source={require('../../images/downVector.png')}
                />
              )}
            </View>
          </CollapseHeader>
          <CollapseBody style={{marginTop: 10}}>
            <Text style={{color: '#D6D6D6', opacity: 0.4}}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
          </CollapseBody>
        </Collapse>

        <Collapse
          onToggle={() => onTogleChanging(4)}
          style={{
            marginTop: 18,
            borderWidth: 1,
            borderColor: '#454545',
            width: '90%',
            padding: 18,
            borderRadius: 20,
            backgroundColor: collapsColorRemove,
          }}>
          <CollapseHeader>
            <View style={{flexDirection: 'row', width: '98%'}}>
              <Text style={{color: '#fff', fontSize: 15, width: '87%'}}>
                How do I edit or remove a method?
              </Text>

              {RemoveToggle == true ? (
                <Image
                  style={{
                    height: 15,
                    width: 9,
                    tintColor: '#FFFFFF77',
                    alignSelf: 'center',
                    marginLeft: 'auto',
                  }}
                  resizeMode="stretch"
                  source={require('../../images/farward.png')}
                />
              ) : (
                <Image
                  style={{
                    height: 11,
                    width: 15,
                    tintColor: '#FFFFFF77',
                    alignSelf: 'center',
                    marginLeft: 'auto',
                  }}
                  resizeMode="stretch"
                  source={require('../../images/downVector.png')}
                />
              )}
            </View>
          </CollapseHeader>
          <CollapseBody style={{marginTop: 10}}>
            <Text style={{color: '#D6D6D6', opacity: 0.4}}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
          </CollapseBody>
        </Collapse>

        <Collapse
          onToggle={() => onTogleChanging(5)}
          style={{
            marginTop: 18,
            borderWidth: 1,
            borderColor: '#454545',
            width: '90%',
            padding: 18,
            borderRadius: 20,
            backgroundColor: collapsColorTournament,
          }}>
          <CollapseHeader>
            <View style={{flexDirection: 'row', width: '98%'}}>
              <Text style={{color: '#fff', fontSize: 15, width: '87%'}}>
                How I can enter in tournament and what is it's criteria?
              </Text>

              {tournamentToggle == true ? (
                <Image
                  style={{
                    height: 15,
                    width: 9,
                    tintColor: '#FFFFFF77',
                    alignSelf: 'center',
                    marginLeft: 'auto',
                  }}
                  resizeMode="stretch"
                  source={require('../../images/farward.png')}
                />
              ) : (
                <Image
                  style={{
                    height: 11,
                    width: 15,
                    tintColor: '#FFFFFF77',
                    alignSelf: 'center',
                    marginLeft: 'auto',
                  }}
                  resizeMode="stretch"
                  source={require('../../images/downVector.png')}
                />
              )}
            </View>
          </CollapseHeader>
          <CollapseBody style={{marginTop: 10}}>
            <Text style={{color: '#D6D6D6', opacity: 0.4}}>
              You can enter the tournament in the Tournaments section by
              agreeing to our terms and conditions. The criteria is to win by
              creating the best Memes. Judge memes on a daily basis to earn
              coins.
            </Text>
          </CollapseBody>
        </Collapse>

        <View style={{marginBottom: 10}}></View>
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
});
