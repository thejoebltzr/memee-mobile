import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const ButtonCoinsShort = ({ title, onPress, showAdd, font, loading }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={onPress}
            style={styles.buttonStyle}>

            {loading == 0 ?
                <LinearGradient
                    colors={['#73FF66', '#19850F']}
                    style={{ height: '100%', minWidth: 70, flexDirection: 'row', alignItems: 'center', borderRadius: 22, }}
                >

                    <Image
                        style={{ height: 20, width: 20, marginLeft: 8, marginRight: 8 }}
                        resizeMode='stretch'
                        source={require('../images/Coin.png')}
                    />
                    <Text style={[styles.buttonTitleStyle, { fontFamily: font }]}>{title}</Text>

                </LinearGradient>
                :
                <LinearGradient
                    colors={['#73FF66', '#19850F']}
                    style={{ height: '100%', minWidth: 70, alignItems: 'center', flexDirection: 'row', alignItems: 'center', borderRadius: 22, }}
                >
                    <Image
                        style={{ height: 20, width: 20, marginLeft: 8, marginRight: 8 }}
                        resizeMode='stretch'
                        source={require('../images/Coin.png')}
                    />
                    <ActivityIndicator size="small" color="#0D0219"
                        style={{marginLeft: 8}}
                    />

                </LinearGradient>
            }
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: '#60E654',
        height: 35,
        minWidth: 70,
        alignSelf: 'center',
        borderRadius: 22,
        flexDirection: 'row'
    },
    buttonTitleStyle: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 15,
        color: '#fff',
        marginLeft: 'auto',
        marginRight: 10
    },
    addCircle: {
        width: 22, height: 22, borderRadius: 25,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    }
})

export default ButtonCoinsShort;