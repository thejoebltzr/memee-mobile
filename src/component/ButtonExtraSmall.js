import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


var btnClr = global.btnColor;
const ButtonExtraSmall = ({ title, onPress, bgClrFirst, bgClrSecond, btnTxtClr, font }) => {

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={onPress}
            style={styles.buttonStyle}>
            <LinearGradient
                colors={[bgClrFirst, bgClrSecond]}
                style={{ height: 30, width: 60, justifyContent: 'center', alignSelf: 'center', borderRadius: 22, }}
            >
                <Text style={{
                    textAlign: "center",
                    fontFamily: font,
                    fontSize: 10,
                    color: btnTxtClr
                }}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: "#FBC848",
        height: 30,
        width: 60,
        marginTop: 0,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 22,
        elevation: 10
    },
    buttonTitleStyle: {
        textAlign: "center",
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 10,
        color: global.btnTxt
    },
})

export default ButtonExtraSmall;