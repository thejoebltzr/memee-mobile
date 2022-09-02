import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import IconsScreen from '../ScreensForStoreTab/IconsScreen';
import ButtonsScreen from '../ScreensForStoreTab/ButtonsScreen';
import FontScreen from '../ScreensForStoreTab/FontScreen';
import ProfileBackgroundScreen from '../ScreensForStoreTab/ProfileBackgroundScreen';
import ProfileOverlayScreen from '../ScreensForStoreTab/ProfileOverlayScreen';




const Tab = createMaterialTopTabNavigator();

export default function StoreTab() {
    return (

        <Tab.Navigator
            tabBarOptions={{
                scrollEnabled: true,
                activeTintColor: global.colorTextPrimary,
                inactiveTintColor: global.colorTextPrimary,
                labelStyle: { fontSize: 15, textTransform: 'none', },
                tabStyle: { width: 'auto'},
                style: { backgroundColor: global.colorPrimary },
                indicatorStyle: {
                    backgroundColor: global.colorTextPrimary,
                },
            }}
        >
            <Tab.Screen name="Icons" component={IconsScreen} />
            <Tab.Screen name="Buttons" component={ButtonsScreen} />
            <Tab.Screen name="Fonts" component={FontScreen} />
            <Tab.Screen name="Profile Background" component={ProfileBackgroundScreen} />
            <Tab.Screen name="Profile Overlay" component={ProfileOverlayScreen} />

        </Tab.Navigator>

    );
}