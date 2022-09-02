import * as React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const InputMultiline = ({ placeholder, value, onChangeText, secureTextEntry, font, ref,}) => {
    return (
        <TextInput style={[styles.input, {fontFamily : font}]}
            placeholder={placeholder}
            placeholderTextColor = "#707070"
            value={value}
            multiline={true}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            ref={ref}
        
        />
    );
}
export default InputMultiline;

const styles = StyleSheet.create({
    input: {
        // height: 40,
        width: '90%',
        // borderBottomColor: '#E6E6E6',
        // borderBottomWidth: 1,
        alignSelf: 'center',
        marginTop: 5,
        paddingHorizontal: 15,
        paddingVertical: 15,
        fontSize: 16,
        color: '#707070',
        fontFamily: 'OpenSans-Regular'
    }
})