import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image} from 'react-native';
import StoreTab from '../StoreTab';

var windowWidth = Dimensions.get('window').width;
windowWidth = (windowWidth * 85) / 100;
var seassionWidth = (windowWidth * 80) / 100;
var windowWidthSeasion = (windowWidth * 20) / 100;

export default function Store(props) {

    return (
        <View style={{ flex: 1,  paddingTop: "0%", backgroundColor: global.colorPrimary, paddingBottom: 50 }}>
            <ScrollView>
                <Image
                    style={{ width: windowWidth, height: windowWidth + 50, alignSelf: 'center' }}
                    resizeMode='stretch'
                    source={require('../../images/store.png')}
                />
                <Image
                    style={{ width: seassionWidth, height: windowWidthSeasion, alignSelf: 'center', marginTop: -(windowWidthSeasion + 6) }}
                    resizeMode='stretch'
                    source={require('../../images/sesion.png')}
                />
                <Text style={{ color: global.colorTextPrimary, marginTop: 20, marginLeft: 10, fontWeight: 'bold', fontSize: 15, fontFamily: global.fontSelect }}>Store items</Text>
                <StoreTab />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 25,
        color: '#E6E6E6',
        marginBottom: 25,
        marginLeft: 5,
    },
    txt: {
        color: '#E6E6E6',
        marginTop: 20,
        marginLeft: "4%",
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
        tintColor: '#ffffff'
    },


})
