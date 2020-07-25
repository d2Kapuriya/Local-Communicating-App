import * as firebase from 'firebase';
import *as React from 'react';
import { View,Text, StyleSheet, TouchableOpacity,Image, Button,RefreshControl } from 'react-native'
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {BackHandler} from "react-native";

export default class ProfileScreen extends React.Component {
  user = firebase.auth().currentUser;
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);    
    this.state={
    fname:"",
    lname:"",
    Email:"",
    photo:"",
    refreshing:false,
  }    
  }  
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    firebase.database().ref('/users/'+this.user.uid).on('value',(snapshot)=>{
      const userObj=snapshot.val();
      if(userObj!=null){
        this.setState({fname:userObj.first_name});
        this.setState({lname:userObj.last_name});
        this.setState({Email:userObj.gmail});
        this.setState({photo:userObj.profile_picture});
      }
    }
    );
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }  
  handleBackButtonClick() {
    // Registered function to handle the Back Press
    // We are generating an alert to show the back button pressed
    // alert('You clicked back. Now Screen will move to DashBoard');
    // We can move to any screen. If we want
    this.props.navigation.navigate('DashboardScreen');
    // Returning true means we have handled the backpress
    // Returning false means we haven't handled the backpress
    return true;
  }
  static navigationOptions = {  
    title: 'ProfileScreen',  
    headerStyle: {  
        backgroundColor: '#f4511e',  
    },  
    //headerTintColor: '#0ff',  
    headerTitleStyle: {  
        fontWeight: 'bold',  
    },  
  };

  render() {    
    return (
      <View >
       {/* <RefreshControl refreshing={this.state.refreshing} />    */}
      <View>
        <Text style={styles.headerStyle}>PROFILE</Text>
      </View>
      <TouchableOpacity > 
      {/* onPress={()=>alert('image clicked')} */}
       <Image
        style={{width:'100%',height:100,resizeMode:"contain"}}
        source={{uri:this.state.photo}}               
       />
       </TouchableOpacity>
      <View style={{margin:20}}>  
        <Text>Name: {this.state.fname} {this.state.lname} </Text>
        <Text>Email: {this.state.Email}</Text>
      </View>
      <View style={{marginLeft:100,marginRight:100,justifyContent:'center'}}>
        <Button  title="Sign out" onPress={() => firebase.auth().signOut()} />  
      </View>      
      </View>
    );
  }
}
const styles=StyleSheet.create({
  profile:{
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
  },
  headerStyle:{
    fontSize:20,
    textAlign:'center',
    fontStyle:'italic',
    margin:30,
    fontWeight:'bold'
  }
});