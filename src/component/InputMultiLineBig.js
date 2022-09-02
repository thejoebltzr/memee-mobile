import * as React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const InputMultilineBig = ({ placeholder, value, onChangeText, secureTextEntry, color}) => {
    return (
        <TextInput style={[styles.input, {color: color}]}
            placeholder={placeholder}
            placeholderTextColor = "#707070"
            value={value}
            multiline={true}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}

        />
    );
}
export default InputMultilineBig;

const styles = StyleSheet.create({
    input: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 15,
        paddingHorizontal: 0,
        fontSize: 16,
        fontFamily: 'OpenSans-Regular'
    }
})