import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import InputWithoutBorder from '../../component/InputFieldWithoutBorder';
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';

export default function BillingDetail(props) {

    const navigation = useNavigation();
    const [cellNo, setCellNo] = useState('1234 1234 1234 0123');
    const [cvvCode, setCVVCode] = useState('123');

    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    return (
        <View style={{ flex: 1, paddingLeft: "5%", paddingTop: "5%", backgroundColor: '#0B0213' }}>
            <ScrollView>

                <View style={{ flexDirection: 'row', }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            style={styles.tinyLogo}
                            source={require('../../images/back1.png')}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.title, { fontFamily: global.fontSelect }]}>Billing Details</Text>
                </View>

                <Text style={{ color: '#fff', fontSize: 11, marginTop: 15 }}>Card Number</Text>
                <View style={{ marginTop: 10, paddingBottom: 10, width: "100%", height: 70, flexDirection: 'row', alignItems: 'center', borderBottomColor: '#1B1B1B', borderBottomWidth: 1 }}>
                    <View style={{ width: 50, height: 50, backgroundColor: '#201E23', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            style={{ height: 25, width: 25, tintColor: '#FBC848' }}
                            resizeMode='stretch'
                            source={require('../../images/Icon.png')}
                        />
                    </View>

                    <View style={{ width: '75%', height: 60, marginLeft: 10, }}>
                        <InputWithoutBorder
                            placeholder="Password"
                            onChangeText={text => setCellNo(text)}
                            value={cellNo}
                            secureTextEntry={false}
                        />
                    </View>
                </View>

                <Text style={{ color: '#fff', fontSize: 11, marginTop: 20 }}>Expiry Date</Text>
                <View style={{ marginTop: 10, paddingBottom: 10, width: "100%", height: 70, flexDirection: 'row', alignItems: 'center', borderBottomColor: '#1B1B1B', borderBottomWidth: 1 }}>
                    <TouchableOpacity onPress={showDatepicker}>
                        <View style={{ width: 50, height: 50, backgroundColor: '#201E23', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                style={{ height: 27, width: 25, tintColor: '#FBC848' }}
                                resizeMode='stretch'
                                source={require('../../images/table.png')}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={{ width: '75%', height: 60, marginLeft: 10, }}>
                       <Text style={{color : '#fff', marginTop: 17, marginLeft: '6%'}}>{Moment(date).format('MM/DD')}</Text>
                    </View>
                </View>

                <Text style={{ color: '#fff', fontSize: 11, marginTop: 20 }}>CVV Code</Text>
                <View style={{ marginTop: 10, paddingBottom: 10, width: "100%", height: 70, flexDirection: 'row', alignItems: 'center', borderBottomColor: '#1B1B1B', borderBottomWidth: 1 }}>
                    <View style={{ width: 50, height: 50, backgroundColor: '#201E23', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            style={{ height: 30, width: 24, tintColor: '#FBC848' }}
                            resizeMode='stretch'
                            source={require('../../images/cvvcode.png')}
                        />
                    </View>

                    <View style={{ width: '75%', height: 60, marginLeft: 10, }}>
                        <InputWithoutBorder
                            placeholder="Password"
                            onChangeText={text => setCVVCode(text)}
                            value={cvvCode}
                            secureTextEntry={false}
                        />
                    </View>
                </View>

            </ScrollView>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    tinyLogo: {
        width: 30,
        height: 20,
        marginTop: 10,
        tintColor: '#ffffff'
    },
    title: {
        fontSize: 25,
        color: '#E6E6E6',
        marginBottom: 25
    },

})
