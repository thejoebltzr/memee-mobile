import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const ButtonShort = ({ title, onPress, bgClrFirst, bgClrSecond, btnTxtClr, font }) => {

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={onPress}
            style={styles.buttonStyle}>
            <LinearGradient
                colors={[bgClrFirst, bgClrSecond]}
                style={{ height: 32, width: '100%', justifyContent: 'center', alignSelf: 'center', borderRadius: 22, }}
            >
                <Text style={{
                    textAlign: "center",
                    fontFamily: font,
                    fontSize: 12,
                    color: btnTxtClr,
                }}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonStyle: {
        // backgroundColor: "#FBC848",
        height: 32,
        width: '43%',
        // paddingHorizontal: 20,
        marginTop: 2,
        // marginLeft: 'auto',
        marginRight: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 22,
        elevation: 10
    },
    buttonTitleStyle: {
        textAlign: "center",
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 12,
        color: global.btnTxt
    },
})

export default ButtonShort;