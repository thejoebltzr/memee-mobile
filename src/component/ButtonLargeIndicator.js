import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'


const ButtonLargeIndicator = ({ title, onPress, bgClrFirst, bgClrSecond, txtClr }) => {

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={onPress}
            style={{ height: 50, width: '90%', marginTop: 30, justifyContent: 'center', alignSelf: 'center', borderRadius: 22, elevation: 10 }}>

            <LinearGradient
                colors={[bgClrFirst, bgClrSecond]}
                style={{ height: 50, width: '100%', justifyContent: 'center', alignSelf: 'center', borderRadius: 22, }}
            >
                <ActivityIndicator animating={true} color="#0D0219" />
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: '#FBC848',
        height: 50,
        width: '90%',
        marginTop: 30,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 22,
        elevation: 10
    },
    buttonTitleStyle: {
        textAlign: "center",
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
        color: '#000000'
    },
})

export default ButtonLargeIndicator;