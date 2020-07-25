 import React, { Component } from 'react';
import { View, Text, StyleSheet,ImageBackground, Button} from 'react-native';
import {MaterialCommunityIcons,AntDesign} from '@expo/vector-icons';
import {BackHandler} from "react-native";

import firebase from 'firebase';
class DashboardScreen extends Component {
  user = firebase.auth().currentUser;
  
  static navigationOptions = {  
    title: 'DashboardScreen',  
    headerStyle: {  
        backgroundColor: '#f4511e',  
    },  
    //headerTintColor: '#0ff',  
    headerTitleStyle: {  
        fontWeight: 'bold',  
    },  
  };     
  constructor(props) {
    super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);              
  }  
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick); 
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  handleBackButtonClick() {
    BackHandler.exitApp();
    return true;
  }  
  render() {
    return (      
      <View style={styles.container}>      
        <ImageBackground source={require('./ReceiveLift6.jpg')} style={styles.backgroundImage}>
          <View style={styles.container}>
          <MaterialCommunityIcons style={{marginLeft:10}}name="face-profile" size={32} color="orange" onPress={() => this.props.navigation.navigate('ProfileScreen')}/>
          <AntDesign value='give Lift' name="upcircleo" size={32} color='orange' onPress={() => this.props.navigation.navigate('GiveLiftScreen')}/>
          <AntDesign style={{marginRight:10}}name="downcircleo" size={32} color='orange' onPress={() => this.props.navigation.navigate('ReceiveLiftScreen')}/>    
          </View>  
        </ImageBackground>
      </View>
    );
  }
}
export default DashboardScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode:"contain"
},
  container: {
    flex: 1,
    flexDirection:'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  }
});
