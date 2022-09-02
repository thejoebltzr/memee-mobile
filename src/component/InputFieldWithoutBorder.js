import * as React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const InputWithoutBorder = ({ placeholder, value, onChangeText, secureTextEntry}) => {
    return (
        <TextInput style={styles.input}
            placeholder={placeholder}
            placeholderTextColor = "#707070"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}

        />
    );
}
export default InputWithoutBorder;

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
        color: '#FFFFFF',
        fontFamily: 'OpenSans-Regular'
    }
})