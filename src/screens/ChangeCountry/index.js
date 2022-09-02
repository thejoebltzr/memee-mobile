import React, { useState } from 'react';
// import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Modal, Image, ImageBackground, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import messaging from '@react-native-firebase/messaging';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';

export default function ChangeCountry(props) {

    const navigation = useNavigation();
    const [collapsColorCoin, setCollapsColorCoin] = useState("#0B0213")

    return (
        <View style={{ flex: 1, paddingLeft: "5%", paddingTop: "5%", backgroundColor: '#0B0213', }}>
            <ScrollView>

                <View style={{ flexDirection: 'row', }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            style={styles.tinyLogo}
                            source={require('../../images/back1.png')}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.title, { fontFamily: global.fontSelect }]}>Change Country</Text>
                </View>

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

})
