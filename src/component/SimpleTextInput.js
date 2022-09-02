import * as React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const SimpleInput = ({ placeholder, value, onChangeText, secureTextEntry, Editable, color}) => {
    return (
        <TextInput style={[styles.input, {color: Editable == false ? "#707070" : (color==undefined ? '#fff' : color)}]}
            placeholder={placeholder}
            placeholderTextColor = {"#707070"}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            editable={Editable}
        />
    );
}
export default SimpleInput;

const styles = StyleSheet.create({
    input: {
        height: 40,
        width: '90%',
        // borderBottomColor: '#454545',
        // borderBottomWidth: 1,
        alignSelf: 'center',
        marginTop: 10,
        paddingHorizontal: 5,
        fontSize: 15,
        fontFamily: 'OpenSans-Regular', 
    }
})