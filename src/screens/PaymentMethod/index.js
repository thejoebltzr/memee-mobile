import React, { useState } from 'react';
// import { useState } from 'react';
import { View, Text, FlatList, Switch, TouchableOpacity, StyleSheet, ScrollView, Modal, Image, ImageBackground, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import messaging from '@react-native-firebase/messaging';
import ButtonLarge from '../../component/ButtonLarge';


export default function PaymentMethod(props) {

    const navigation = useNavigation();
    const [allowNotification, setAllowNotification] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);

    const [smsPermition, setSmsPermition] = useState(false);

    const toggleSwitchNotification = () => setAllowNotification(previousState => !previousState);
    const smsPermitionSwitch = () => setSmsPermition(previousState => !previousState);

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);


    return (
        <View style={{ flex: 1, paddingTop: "5%", backgroundColor: '#0B0213' }}>
            <ScrollView>

                <View style={{ flexDirection: 'row', marginLeft: "5%" }}>
                    <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
                        <Image
                            style={styles.tinyLogo}
                            source={require('../../images/back1.png')}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.title, {fontFamily:global.fontSelect}]}>Payment Method</Text>
                </View>


                <TouchableOpacity>
                    <View style={{ alignSelf: 'center', borderRadius: 35, marginTop: 15, width: "90%", height: 60, flexDirection: 'row', alignItems: 'center', backgroundColor: '#292929' }}>

                        <View>
                            <View style={{ marginLeft: 10, width: 45, height: 45, backgroundColor: '#fff', borderRadius: 25, alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    style={{ height: 25, width: 25, }}
                                    resizeMode='stretch'
                                    source={require('../../images/apple.png')}
                                />
                            </View>
                        </View>

                        <View style={{ width: '65%', height: 60, marginLeft: '8%', justifyContent: 'center' }}>
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold',fontFamily:global.fontSelect }}>Apple Pay</Text>
                        </View>


                    </View>
                </TouchableOpacity>


                <TouchableOpacity>
                    <View style={{ alignSelf: 'center', borderRadius: 35, marginTop: 15, width: "90%", height: 60, flexDirection: 'row', alignItems: 'center', backgroundColor: '#292929' }}>

                        <View>
                            <View style={{ marginLeft: 10, width: 45, height: 45, backgroundColor: '#fff', borderRadius: 25, alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    style={{ height: 25, width: 25, }}
                                    resizeMode='stretch'
                                    source={require('../../images/google.png')}
                                />
                            </View>
                        </View>

                        <View style={{ width: '65%', height: 60, marginLeft: '8%', justifyContent: 'center' }}>
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', fontFamily:global.fontSelect }}>Google Pay</Text>
                        </View>


                    </View>
                </TouchableOpacity>


                <TouchableOpacity>
                    <View style={{ alignSelf: 'center', borderRadius: 35, marginTop: 15, width: "90%", height: 60, flexDirection: 'row', alignItems: 'center', backgroundColor: '#292929' }}>

                        <View>
                            <View style={{ marginLeft: 10, width: 45, height: 45, backgroundColor: '#fff', borderRadius: 25, alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    style={{ height: 25, width: 18, }}
                                    resizeMode='stretch'
                                    source={require('../../images/paypal.png')}
                                />
                            </View>
                        </View>

                        <View style={{ width: '65%', height: 60, marginLeft: '8%', justifyContent: 'center' }}>
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold',fontFamily:global.fontSelect }}>Paypal</Text>
                        </View>


                    </View>
                </TouchableOpacity>




            </ScrollView>


            <ButtonLarge
                title="Confirm"
                // onPress={() => validation()}
                bgClrFirst={global.btnColor1}
                bgClrSecond={global.btnColor2}
                txtClr={global.btnTxt}
                font= {global.fontSelect}
            />

            <View style={{height: 20}}></View>

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
