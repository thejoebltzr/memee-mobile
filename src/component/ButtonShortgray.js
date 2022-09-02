import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';


const ButtonShortgray = ({ title, onPress, font, color, textColor }) => {

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={onPress}
            style={[styles.buttonStyle, {backgroundColor: color}]}>
            <Text style={[styles.buttonTitleStyle, {fontFamily: font, color: textColor}]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonStyle: {
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
    },
})

export default ButtonShortgray;