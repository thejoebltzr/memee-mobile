import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';


const ButtonSmall = ({ title, onPress, bgClrFirst, bgClrSecond, btnTxtClr, font, loader =  false }) => {

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={onPress}
            style={styles.buttonStyle}>
            <LinearGradient
                colors={[bgClrFirst, bgClrSecond]}
                style={{ height: 50, width: '100%', justifyContent: 'center', alignSelf: 'center', borderRadius: 22 }}
            >
                {!loader ?
                <Text style={{
                    textAlign: "center",
                    fontFamily: 'OpenSans-SemiBold',
                    fontSize: 16,
                    color: btnTxtClr,
                    fontFamily: font,
                }}>{title}</Text>
                : <ActivityIndicator size='small' color="#0D0219" /> }
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: "#FBC848",
        height: 50,
        width: '50%',
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
        fontSize: 16,
        color: global.btnTxt
    },
})

export default ButtonSmall;