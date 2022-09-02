import * as React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const Input = ({ screen, placeholder, value, onChangeText, secureTextEntry, Editable, color}) => {
    return (
        <TextInput style={[styles.input, {color: Editable == false ? "#707070" : (color==undefined ? '#fff' : color), borderBottomColor: screen === 'editprofile' ? global.editProfileInputBorderBottom : '#454545'}]}
            placeholder={placeholder}
            placeholderTextColor = {"#707070"}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            editable={Editable}
        />
    );
}
export default Input;

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: '90%',
    borderBottomWidth: 1,
    alignSelf: 'center',
    marginTop: 10,
    paddingHorizontal: 5,
    fontSize: 15,
    fontFamily: 'OpenSans-Regular',
  },
});