import React, { Component } from 'react';
// import { useState } from 'react';
import { View, Text, RefreshControl, TextInput, TouchableOpacity, MaskedViewIOS, StyleSheet, ScrollView, Image, FlatList, ImageBackground, ViewBase } from 'react-native';
import { Avatar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Top from '../TopScreen';
import Accounts from '../AccountsScreen';
import Tags from '../TagsScreen';


function Places() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D0219' }}>
            <Text style={{ color: '#fff', marginVertical: 25, fontFamily:global.fontSelect }}>Coming Soon!</Text>
        </View>
    );
}


const Tab = createMaterialTopTabNavigator();

export default function SearchScreen() {

    return (
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: global.colorTextPrimary,
          inactiveTintColor: global.colorTextPrimary,
          labelStyle: {fontSize: 12},
          style: {backgroundColor: global.colorPrimary},
          labelStyle: {textTransform: 'none'},
          indicatorStyle: {
            backgroundColor: global.colorTextPrimary,
          },
        }}>
        <Tab.Screen name="Top" component={Top} />
        <Tab.Screen name="Accounts" component={Accounts} />
        <Tab.Screen name="Tags" component={Tags} />
        {/* <Tab.Screen name= "Places" component={Places} /> */}
      </Tab.Navigator>
    );

}