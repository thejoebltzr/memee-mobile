import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function RankingScreen(props) {
  const navigation = useNavigation();
  const [rankingData, setRankingData] = useState([]);

  useEffect(() => {
    showRankingFN();
  }, []);

  function showRankingFN() {
    fetch(global.address + 'GetRanking', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        /* console.log(responseJson.Ranking.length); */
        for (let i = 0; i < responseJson.Ranking.length; i++) {
          if (responseJson.Ranking[i].rank_name == '1th') {
            responseJson.Ranking[i].rank_name = '1st';
          } else if (responseJson.Ranking[i].rank_name == '2th') {
            responseJson.Ranking[i].rank_name = '2nd';
          } else if (responseJson.Ranking[i].rank_name == '3th') {
            responseJson.Ranking[i].rank_name = '3rd';
          }
        }
        setRankingData(responseJson.Ranking);
      })
      .catch(error => {
        console.error(error);
      });
  }

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
            Rankings
          </Text>
        </View>

        <FlatList
          data={rankingData}
          renderItem={({item, index}) => (
            <View>
              <View
                style={{
                  width: '100%',
                  marginTop: 15,
                  marginBottom: 10,
                  height: 50,
                  borderRadius: 25,
                  flexDirection: 'row',
                  backgroundColor: '#292929',
                }}>
                <Image
                  style={{width: 80, height: 78, marginLeft: -6, marginTop: -9}}
                  resizeMode="stretch"
                  source={require('../../images/triangle2.png')}
                />
                <Image
                  style={{
                    width: 75,
                    height: 72,
                    marginLeft: -79,
                    marginTop: -10,
                  }}
                  resizeMode="stretch"
                  source={require('../../images/triangle1.png')}
                />

                <Text
                  style={{
                    color: '#fff',
                    fontSize: 15,
                    marginLeft: -55,
                    fontFamily: global.fontSelect,
                  }}>
                  {item.rank_name}
                </Text>

                <Image
                  style={{
                    width: 25,
                    height: 25,
                    marginLeft: '18%',
                    marginTop: 11,
                  }}
                  resizeMode="stretch"
                  source={require('../../images/Coin.png')}
                />
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 17,
                    fontWeight: 'bold',
                    marginTop: 11,
                    marginLeft: '2%',
                    fontFamily: global.fontSelect,
                  }}>
                  {item.prize} Coins
                </Text>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    marginBottom: 25,
    marginLeft: 5,
  },
  txt: {
    color: '#E6E6E6',
    marginTop: 20,
    marginLeft: '4%',
    marginBottom: '14%',
  },
  txtbelow: {
    color: '#E6E6E6',
    marginTop: '12%',
    alignSelf: 'center',
    marginBottom: '5%',
  },
  txtdown: {
    color: '#E6E6E6',
    marginTop: '5%',
    alignSelf: 'center',
    marginBottom: '10%',
  },
  txtdown2: {
    color: '#FBC848',
    marginTop: '5%',
    alignSelf: 'center',
    marginBottom: '10%',
    marginLeft: 10,
  },
  tinyLogo: {
    width: 30,
    height: 20,
    marginTop: 10,
  },
});
