import React, {useState} from 'react';
import {View, Text} from 'react-native';
import App from './App';
import firebase from '@react-native-firebase/app';

import messaging from '@react-native-firebase/messaging';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDLMTo1X70qO_r6N0bBorEfvHulLghNK68",
//   authDomain: "memee-app.firebaseapp.com",
//   projectId: "memee-app",
//   databaseURL: '',
//   storageBucket: "memee-app.appspot.com",
//   messagingSenderId: "740829831906",
//   appId: "1:740829831906:web:767e5db8fb770efc6274bb",
//   measurementId: "G-H15CTD7WSB"
// };

/* var firebaseConfig = {
  apiKey: 'AIzaSyAfjXyX-CXZTpLZKZiZVqSc_Rr2-wp8iN0',
  authDomain: 'memee-ce64c.firebaseapp.com',
  projectId: 'memee-app-d35d3',
  databaseURL: '',
  storageBucket: 'memee-app-d35d3.appspot.com',
  messagingSenderId: '665746906328',
  appId: '1:628249846461:android:54ea0b987cde5aa6698dd4',
  measurementId: 'G-ST2GTWP2RL',
}; */

const firebaseConfig = {
  apiKey: 'AIzaSyD9J-gxMObldqQJGX1SKYY24A3rBmc89bk',
  authDomain: 'memee-app-d35d3.firebaseapp.com',
  databaseURL: 'https://memee-app-d35d3-default-rtdb.firebaseio.com',
  projectId: 'memee-app-d35d3',
  storageBucket: 'memee-app-d35d3.appspot.com',
  messagingSenderId: '628249846461',
  appId: '1:628249846461:web:0c55fc1c27ffdf52698dd4',
  measurementId: 'G-7ZC1956Z48',
};

if (!firebase.apps.length) {
  /* console.log("running setup....") */
  firebase.initializeApp(firebaseConfig);
}

export {firebase, messaging};

const Setup = () => {
  const [loading, setLoading] = useState(true);

  const setupCloudMessaging = async () => {
    messaging()
      .subscribeToTopic('notifyAll')
      .then(() => console.log('Subscribed to topic!'));
  };

  React.useEffect(async () => {
    setupCloudMessaging();
  }, []);

  return <App />;
};

export default Setup;
