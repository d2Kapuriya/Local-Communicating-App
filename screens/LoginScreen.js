import React, { Component } from 'react';
import { View, Text, StyleSheet,ImageBackground, Button,Image,TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import * as Google from 'expo-google-app-auth';
import {MaterialCommunityIcons,AntDesign} from '@expo/vector-icons';

class LoginScreen extends Component {
  constructor(props) {
    super(props)      
    this.state={
      mailid:'',
      userid:"",
      refreshing:false,
    }        
  }
  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };
  onSignIn = googleUser => {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(
      function(firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          // Sign in with credential from the Google user.
          firebase
            .auth()
            .signInAndRetrieveDataWithCredential(credential)
            .then(function(result) {
              // if(resu.user.email==this.state.mailid){
              //   console.log("valid email id")
              // }
              console.log('user signed in ');
              if (result.additionalUserInfo.isNewUser) {                
                  firebase
                  .database()
                  .ref('/users/' + result.user.uid)
                  .set({
                    userid:result.user.uid,
                    gmail: result.user.email,
                    profile_picture: result.additionalUserInfo.profile.picture,
                    first_name: result.additionalUserInfo.profile.given_name,
                    last_name: result.additionalUserInfo.profile.family_name,
                    info:null,
                    created_at: Date.now(),
                    last_logged_in: Date.now()
                  })
                  .then(function(snapshot) {
                    console.log('Snapshot', snapshot);
                  });                               
              } else {
                firebase
                  .database()
                  .ref('/users/' + result.user.uid)
                  .update({                    
                    gmail: result.user.email,
                    userid:result.user.uid,
                    profile_picture: result.additionalUserInfo.profile.picture,
                    first_name: result.additionalUserInfo.profile.given_name,
                    last_name: result.additionalUserInfo.profile.family_name,
                    info:'',
                    // created_at: Date.now(),
                    last_logged_in: Date.now()                   
                });                
              }
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var  credential = error.credential;
              // ...
            });
        } else {
          console.log('User already signed-in Firebase.');
        } 
      }.bind(this)
    );
  };
  signInWithGoogleAsync = async () => {
    try {      
      const config={
        expoClientId:"write your expo client id",
        androidClientId:"write your android client id",
        androidStandaloneAppClientId: "write your android stand alone client id",
        behavior:'web',
        scopes:['profile','email']
      };
      const result = await Google.logInAsync(config);

      if (result.type === 'success') {
        // alert("login successful");
        this.onSignIn(result);
        return result.accessToken;
      } else {
        alert("login unsuccessful");
        return { cancelled: true };
      }
    } catch (e) {
      alert("login error");
      alert(e.message);
      console.log("error",e)
      return { error: true };
    }
  };
  static navigationOptions = {  
    title: 'LoginScreen',  
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
        <View>              
          <Text style={styles.header}>LOGIN</Text>              
        </View>        
        <View style={styles.container}>
          <Image
            style={{width:250,height:250,resizeMode:"cover",marginTop:20,marginBottom:20}}
            source={require('C:/Users/Lenovo/Charusat/screens/login2.png')}        
          />
          <Text style={{fontSize:20}}>Welcome</Text>          
          <Text style={{fontSize:20,marginBottom:10}}>Sign in with Google</Text>
          <View>
            <Text style={{width:75,height:100}} onPress={() => this.signInWithGoogleAsync()}>
              <Image
                style={{width:70,height:70,resizeMode:"cover"}}
                source={require('C:/Users/Lenovo/Charusat/screens/googlelogo.png')}              
              />           
            </Text>                             
          </View>
          {/* <AntDesign value='Sign In With Google' name="google" size={32} color='orange' onPress={() => this.signInWithGoogleAsync()}/> */}
        </View>        
      </View>
    );
  }
}
export default LoginScreen;

const styles = StyleSheet.create({
  header:{
    fontSize:20,
    textAlign:'center',
    fontStyle:'italic',
    margin:50,
    fontWeight:'bold'
  },
  container: {
    flex: 1,
    marginTop:150,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
