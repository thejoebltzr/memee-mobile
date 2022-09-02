import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

export default function SettingDetailNotification(props) {
  const navigation = useNavigation();
  const [allowNotification, setAllowNotification] = useState(
    global.userData.appNotifications == 1,
  );
  const [isEnabled, setIsEnabled] = useState(false);

  const [smsPermition, setSmsPermition] = useState(false);

  const toggleSwitchNotification = () =>
    setAllowNotification(previousState => !previousState);
  const smsPermitionSwitch = () =>
    setSmsPermition(previousState => !previousState);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  function topicNotificationFN() {
    var notificationStatus = '';
    if (allowNotification == true) {
      global.userData.appNotifications = 0;
      try {
        messaging()
          .unsubscribeFromTopic('notifyAll')
          .then(() => console.log('Unsubscribed fom the topic!'));

        fetch(
          global.address +
            'toggleAppNotificationsStatus/' +
            global.userData.user_id +
            '/0',
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
            /* console.log('\n\n responseJson ', responseJson); */
          })
          .catch(error => {
            console.error(error);
          });

        return true;
      } catch (exception) {
        return false;
      }
    } else {
      fetch(
        global.address +
          'toggleAppNotificationsStatus/' +
          global.userData.user_id +
          '/1',
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
          /* console.log('\n\n responseJson ', responseJson); */
        })
        .catch(error => {
          console.error(error);
        });

      global.userData.appNotifications = 1;
      messaging()
        .subscribeToTopic('notifyAll')
        .then(() => console.log('Subscribed to topic!'));
    }

    // pushnotification status changed
  }

  return (
    <View
      style={{
        flex: 1,
        paddingLeft: '5%',
        paddingTop: '5%',
        backgroundColor: global.colorPrimary,
      }}>
      <ScrollView>
        {/* {console.log(
          '\n\n global.userData.appNotifications',
          global.userData.appNotifications,
        )} */}
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
            Notifications
          </Text>
        </View>

        {/* <TouchableOpacity> */}
        <View
          style={{
            marginTop: 15,
            paddingBottom: 10,
            width: '100%',
            height: 70,
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomColor: '#1B1B1B',
            borderBottomWidth: 1,
          }}>
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: global.colorSecondary,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{height: 25, width: 18, tintColor: global.colorIcon}}
              resizeMode="stretch"
              source={require('../../images/bellIcon.png')}
            />
          </View>

          <View
            style={{
              width: '65%',
              height: 60,
              marginLeft: 10,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: global.colorTextPrimary,
                fontSize: 16,
                fontWeight: 'bold',
                fontFamily: global.fontSelect,
              }}>
              {' '}
              Push Notifications
            </Text>
            {/* <Text style={{ color: '#BABABA', fontSize: 13, marginTop: 2 }}> John Smith</Text> */}
          </View>

          <View
            style={{
              width: '15%',
              height: 60,
              marginLeft: 'auto',
              flexDirection: 'row',
            }}>
            <Switch
              trackColor={{
                false: global.colorTextSecondary,
                true: global.colorTextActive,
              }}
              thumbColor={global.colorIcon}
              ios_backgroundColor="#FFCD2F"
              onValueChange={toggleSwitchNotification}
              onChange={() => topicNotificationFN()}
              value={allowNotification}
            />
          </View>
        </View>
        {/* </TouchableOpacity> */}

        {/* <TouchableOpacity>
                    <View style={{ marginTop: 15, paddingBottom: 10, width: "100%", height: 70, flexDirection: 'row', alignItems: 'center', borderBottomColor: '#1B1B1B', borderBottomWidth: 1 }}>

                        <View style={{ width: 50, height: 50, backgroundColor: '#201E23', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                style={{ height: 20, width: 20, tintColor: '#FBC848' }}
                                resizeMode='stretch'
                                source={require('../../images/sms.png')}
                            />
                        </View>

                        <View style={{ width: '65%', height: 60, marginLeft: 10, justifyContent: 'center' }}>
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 4, fontFamily:global.fontSelect }}>SMS Alert</Text>
                        </View>

                        <View style={{ width: '15%', height: 60, marginLeft: 'auto', flexDirection: 'row' }}>


                            <Switch
                                trackColor={{ false: "#201E23", true: "#FFCD2F" }}
                                thumbColor={smsPermition ? "#f4f3f4" : "#f4f3f4"}
                                ios_backgroundColor="#FFCD2F"
                                onValueChange={smsPermitionSwitch}
                                value={smsPermition}
                            />

                        </View>
                    </View>
                </TouchableOpacity> */}

        {/* <TouchableOpacity>
                    <View style={{ marginTop: 15, paddingBottom: 10, width: "100%", height: 70, flexDirection: 'row', alignItems: 'center', borderBottomColor: '#1B1B1B', borderBottomWidth: 1 }}>

                        <View style={{ width: 50, height: 50, backgroundColor: '#201E23', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                style={{ height: 22, width: 22, tintColor: '#FBC848' }}
                                resizeMode='stretch'
                                source={require('../../images/letter.png')}
                            />
                        </View>

                        <View style={{ width: '65%', height: 60, marginLeft: 10 }}>
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 4, fontFamily:global.fontSelect }}> Email Reminders</Text>
                            <Text style={{ color: '#BABABA', fontSize: 13, marginTop: 2, fontFamily:global.fontSelect }}> Enabled</Text>
                        </View>

                        <View style={{ width: '15%', height: 60, marginLeft: 'auto', flexDirection: 'row' }}>


                            <Switch
                                trackColor={{ false: "#201E23", true: "#FFCD2F" }}
                                thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
                                ios_backgroundColor="#FFCD2F"
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                            />

                        </View>
                    </View>
                </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tinyLogo: {
    width: 30,
    height: 20,
    marginTop: 10,
    tintColor: global.colorTextPrimary,
  },
  title: {
    fontSize: 25,
    color: global.colorTextPrimary,
    marginBottom: 25,
  },
});
