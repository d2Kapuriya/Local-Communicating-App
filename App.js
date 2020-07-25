import * as firebase from 'firebase';
import { firebaseConfig } from './config';
firebase.initializeApp(firebaseConfig);

import {Asset} from 'expo-asset';
import {AppLoading} from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import LoadingScreen from './screens/LoadingScreen';
import ProfileScreen from './screens/ProfileScreen';
import ReceiveLiftScreen from './screens/ReceiveLiftScreen';
import GiveLiftScreen from './screens/GiveLiftScreen';
// import { S_IFIFO } from 'constants';


export default class App extends React.Component {
  render() {    
    return <AppNavigator />;
  }
}
const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  DashboardScreen: DashboardScreen,
  ProfileScreen:ProfileScreen,
  GiveLiftScreen:GiveLiftScreen,
  ReceiveLiftScreen:ReceiveLiftScreen
});

const AppNavigator = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
