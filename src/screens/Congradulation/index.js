import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
var windowWidth = Dimensions.get('window').width;
export default function Congradulation({navigation, route}) {
  const [likesHave, setLikesHave] = useState(0);
  const [place, setPlace] = useState('last');

  useEffect(() => {
    likes = route.params?.likes || 0;
    rank = route.params?.place || 'Last';

    setLikesHave(likes);
    setPlace(rank);
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: global.colorPrimary}}>
      <View style={{flexDirection: 'row', marginLeft: '4%', marginTop: 10}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.tinyLogo}
            source={require('../../images/back1.png')}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0B0213',
        }}>
        <Image
          style={{
            width: (windowWidth * 98) / 100,
            height: (windowWidth * 180) / 100,
            marginTop: -(windowWidth * 60) / 100,
          }}
          source={require('../../images/tournamentSuccess.png')}
          resizeMode="stretch"
        />
        <Text
          style={{
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: -(windowWidth * 40) / 100,
            marginBottom: 10,
          }}>
          Congratulations
        </Text>
        <Text
          style={{
            color: '#fff',
            opacity: 0.5,
            fontSize: 15,
            width: '80%',
            textAlign: 'center',
          }}>
          Congrats, You have won the tournament by getting {likesHave} likes.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    color: '#E6E6E6',
    marginBottom: 25,
  },
  tinyLogo: {
    width: 30,
    height: 20,
    marginTop: 10,
    tintColor: '#ffffff',
  },
});
