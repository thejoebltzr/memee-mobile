// import * as React from 'react';
import React, {useState, useEffect} from 'react';
import {AppState} from 'react-native';
import {View, Text, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import SplashScreen from './src/screens/SplashScreen';
import Dashboard from './src/screens/Dashboard';
import CommentScreen from './src/screens/CommentScreen';
import NewPost from './src/screens/NewPost';
import ProfileScreen from './src/screens/ProfileScreen';
import ProfileSetting from './src/screens/ProfileSetting';
import NotificationScreen from './src/screens/NotificationScreen';
import ActivityNotification from './src/screens/ActivityNotification';
import FollowRequest from './src/screens/FollowRequest';
import NavigateScreen from './src/screens/NavigateScreen';
import SettingScreen from './src/screens/SettingScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import ExploreDetail from './src/screens/ExploreDetail';
import TrendingPostExplore from './src/screens/TrendingPostExplore';
import SearchScreen from './src/screens/SearchScreen';
import ProfileImageShow from './src/screens/ProfileImageShow';
import SettingDetailNotification from './src/screens/SettingDetailNotification';
import Tournament from './src/screens/Taurnament';
import TounamentScreen from './src/screens/TournamentScreen';
import RankingScreen from './src/screens/RankingScreen';
import Store from './src/screens/Store';
import JudgeScreen from './src/screens/JudgeScreen';
import JudgeMeme from './src/screens/JudgeMeme';
import PaymentMethod from './src/screens/PaymentMethod';
import AddCoins from './src/screens/AddCoins';
import ForgetPassword from './src/screens/ForgetPassword';
import VerifyEmail from './src/screens/VerifyEmail';
import NewPassword from './src/screens/NewPassword';
// import PhotoEditingTry from './src/screens/PhotoEditingTry';
import StoreTab from './src/screens/StoreTab';
import IconsScreen from './src/screens/ScreensForStoreTab/IconsScreen';
import ButtonsScreen from './src/screens/ScreensForStoreTab/ButtonsScreen';
import FontScreen from './src/screens/ScreensForStoreTab/FontScreen';
import ProfileBackgroundScreen from './src/screens/ScreensForStoreTab/ProfileBackgroundScreen';
import ProfileOverlayScreen from './src/screens/ScreensForStoreTab/ProfileOverlayScreen';
import CoinsConfirmation from './src/screens/CoinsConfirmation';
import OrganizeBadges from './src/screens/OrganizeBadges';
import EditProfileScreen from './src/screens/EditProfileScreen';
import BillingDetail from './src/screens/BillingDetail';
import FAQScreen from './src/screens/FAQScreen';
import ChangeCountry from './src/screens/ChangeCountry';
import SharePost from './src/screens/SharePost';
import Onboarding from './src/screens/Onboarding';
import ChatScreen from './src/screens/ChatScreen';
import Inbox from './src/screens/Inbox';
import NewMessage from './src/screens/NewMessage';

import {Settings} from 'react-native-fbsdk-next';
import {Provider} from 'react-redux';
import configureStore from './src/redux/store/index';
import {PersistGate} from 'redux-persist/integration/react';
import Congradulation from './src/screens/Congradulation';

import Toast from 'react-native-toast-message';
import {toggleOnlineStatus} from './src/redux/actions/Auth';

const {store, persistor} = configureStore();

const Stack = createStackNavigator();

global.profileBGArray = '1';
global.bgOverlay = '1';
global.address = 'http://memee.techticksdigital.com/Api/';
// global.address = "http://192.168.18.106/memee-services/Api/"

Settings.initializeSDK();
function App() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (global.userData) {
        if (nextAppState == 'active') {
          /* console.log('Online'); */
          toggleOnlineStatus('1');
        } else {
          /* console.log('Offline'); */
          toggleOnlineStatus('0');
        }
      }
    });

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <StatusBar
            animated={true}
            backgroundColor="#0D0219"
            // barStyle={statusBarStyle}
            // showHideTransition={statusBarTransition}
            // hidden={hidden}
          />
          <Stack.Navigator
            initialRouteName="SplashScreen"
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="CommentScreen" component={CommentScreen} />
            <Stack.Screen name="NewPost" component={NewPost} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="ProfileSetting" component={ProfileSetting} />
            <Stack.Screen
              name="NotificationScreen"
              component={NotificationScreen}
            />
            <Stack.Screen
              name="ActivityNotification"
              component={ActivityNotification}
            />
            <Stack.Screen name="FollowRequest" component={FollowRequest} />
            <Stack.Screen name="NavigateScreen" component={NavigateScreen} />
            <Stack.Screen name="SettingScreen" component={SettingScreen} />
            <Stack.Screen name="ExploreScreen" component={ExploreScreen} />
            <Stack.Screen name="ExploreDetail" component={ExploreDetail} />
            <Stack.Screen
              name="TrendingPostExplore"
              component={TrendingPostExplore}
            />
            <Stack.Screen name="SearchScreen" component={SearchScreen} />
            <Stack.Screen
              name="ProfileImageShow"
              component={ProfileImageShow}
            />
            <Stack.Screen
              name="SettingDetailNotification"
              component={SettingDetailNotification}
            />
            <Stack.Screen name="Tournament" component={Tournament} />
            <Stack.Screen name="TounamentScreen" component={TounamentScreen} />
            <Stack.Screen name="RankingScreen" component={RankingScreen} />
            <Stack.Screen name="Store" component={Store} />
            <Stack.Screen name="JudgeScreen" component={JudgeScreen} />
            <Stack.Screen name="JudgeMeme" component={JudgeMeme} />
            <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
            <Stack.Screen name="AddCoins" component={AddCoins} />
            <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
            <Stack.Screen name="NewPassword" component={NewPassword} />
            <Stack.Screen name="StoreTab" component={StoreTab} />
            <Stack.Screen name="IconsScreen" component={IconsScreen} />
            <Stack.Screen name="ButtonsScreen" component={ButtonsScreen} />
            <Stack.Screen name="FontScreen" component={FontScreen} />
            <Stack.Screen
              name="ProfileBackgroundScreen"
              component={ProfileBackgroundScreen}
            />
            <Stack.Screen
              name="ProfileOverlayScreen"
              component={ProfileOverlayScreen}
            />
            <Stack.Screen
              name="CoinsConfirmation"
              component={CoinsConfirmation}
            />
            <Stack.Screen name="OrganizeBadges" component={OrganizeBadges} />
            <Stack.Screen
              name="EditProfileScreen"
              component={EditProfileScreen}
            />
            <Stack.Screen name="BillingDetail" component={BillingDetail} />
            <Stack.Screen name="FAQScreen" component={FAQScreen} />
            <Stack.Screen name="ChangeCountry" component={ChangeCountry} />
            <Stack.Screen name="Congradulation" component={Congradulation} />
            <Stack.Screen name="SharePost" component={SharePost} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="Inbox" component={Inbox} />
            <Stack.Screen name="NewMessage" component={NewMessage} />

            {/* <Stack.Screen name="PhotoEditingTry" component={PhotoEditingTry} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
      <Toast position="bottom" ref={ref => Toast.setRef(ref)} />
    </Provider>
  );
}

export default App;
