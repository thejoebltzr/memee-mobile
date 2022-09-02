import React, { useState, useEffect } from 'react';
// import { useState } from 'react';
import { View, Text, TouchableOpacity, MaskedViewIOS, Modal, StyleSheet, ScrollView, Image, FlatList, ImageBackground, ViewBase } from 'react-native';
import { Avatar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';


import axios from 'axios';


export default function NavigateScreen() {

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', marginBottom: -30, }}>

            <ScrollView >
                <Text style={{marginBottom: 20}}>Error: {global.CoinError}</Text>
                <Text>Products: {global.CoinProduct}</Text>
            </ScrollView>

        </View>
    );
}





const styles = StyleSheet.create({
    tinyLogo: {
        width: 30,
        height: 20,
        marginTop: 10,
        tintColor: '#ffffff'
    },
    title: {
        fontSize: 25,
        color: '#E6E6E6',
        marginBottom: 25
    },
    imageStyle: {
        width: 150,
        height: 150,
        margin: 5,
    },

    //modal


    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: '120%',

    },
    modalView: {
        margin: 20,
        borderColor: '#FBC848',
        borderWidth: 1,
        backgroundColor: "#201E23",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        elevation: 2,
        marginRight: '-72%',
        marginTop: '-11%'
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#0B0213",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 15
    },
    modalText: {
        marginBottom: 0,
        marginTop: 5,
        textAlign: "center",
        color: '#ffffff'
    }

})
