import *as React from 'react';
import { View,ScrollView,
  TextInput,Text, StyleSheet,Keyboard, TouchableOpacity, Button } from 'react-native'
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {BackHandler,Select,Picker,Image,ImageBackground} from "react-native";
import firebase from 'firebase';
import DatePicker from 'react-native-datepicker';
import TimePicker from 'react-native-simple-time-picker';

export default class GiveLiftScreen extends React.Component {
  user = firebase.auth().currentUser;
  static navigationOptions = {  
    title: 'GiveLiftScreen',  
    headerStyle: {  
        backgroundColor: '#f4511e',  
    },  
    //headerTintColor: '#0ff',  
    headerTitleStyle: {  
        fontWeight: 'bold',  
    },  
  };
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);    
      this.state = {        
        Date :null,
        Pick_up:'Vidhyanagar',
        Destination:'Charusat',
        Aval_Seat:null,        
        Vehicle:'Two-Wheeler',
        Gender:'Male',
        selectedHours: null,
        selectedMinutes: null,
        Price:null,        
        Vehichle_Num:null,
        ValDate:true,
        ValHours:true,
        ValAval_Seat:true,  //validate availebel seat
        Valprice:true,      //validate price
        ValVehiclenum:true,  //validate vehicle number
        currentDate:''
      };       
  }  
  handleSubmit=()=>{
    if(this.state.Date==null){
      this.setState({ValDate:false})
    }
    if(this.state.selectedHours==null){
      this.setState({ValHours:false})
    }
    if(this.state.Aval_Seat==null){
      this.setState({ValAval_Seat:false})
    }
    if(this.state.Price==null){
      this.setState({Valprice:false})
    }
    if(this.state.Vehichle_Num==null){
      this.setState({ValVehiclenum:false})
    }    
    if(this.state.Date==null || this.state.selectedHours==null ||this.state.Aval_Seat==null||this.state.Price==null||this.state.Vehichle_Num==null){
      alert("fill all red border details")
    }
    else{
    firebase
      .database()
      .ref('/users/' + this.user.uid + '/info/')
      .update({
        date: this.state.Date,
        pickup: this.state.Pick_up,
        destination: this.state.Destination,
        AvailebleSeat: this.state.Aval_Seat,
        Vehicle: this.state.Vehicle,
        gender: this.state.Gender,
        hours: this.state.selectedHours,
        minutes:this.state.selectedMinutes,
        Price: this.state.Price,
        VehichleNumber: this.state.Vehichle_Num,       
      })
      alert("Thanks for giving a lift")
    }    
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
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
  validate(text,type){
   var num=new RegExp('^[0-9]+$') //available seat and price validation pattern
   var vehiclePattern=/(([A-Za-z]){2,3}(|-)(?:[0-9]){1,2}(|-)(?:[A-Za-z]){2}(|-)([0-9]){1,4})|(([A-Za-z]){2,3}(|-)([0-9]){1,4})/ 
    // var emailPattern=new RegExp('(charusat\.edu\.in)|(charusat\.ac\.in)')
    // vehiclePattern=new RegExp('^[a-zA-Z]{2}\s[0-9]{2}\s[0-9]{3}')
    // vehiclePattern=/[a-zA-Z]{2}/
    // num=/^[0-9]+$/
    if(type=='Date'){
      // if(this.state.Date!=null){
        var cdate = new Date().getDate();
        var cmonth = new Date().getMonth() + 1;
        var cyear = new Date().getFullYear();
        // this.state.currentDate=toString(cyear+ '-' + cmonth + '-' + cdate)
        // alert(cyear+ '-' + cmonth + '-' + cdate);
  
        var year=text.split("-")[0]
        var month=text.split("-")[1]
        var date=text.split("-")[2]
        // alert(year+ '-' + month + '-' + date);
  
        if(year<cyear){
          alert("Select apropriate Year")
          this.setState({ValDate:false})
        }
        else if(year==cyear){
          if(month<cmonth){
            alert("Select apropriate Month")
            this.setState({ValDate:false})
          }
          else if(month==cmonth){
            if(date<cdate){
              alert("select apropriate Date")
              this.setState({ValDate:false})
            }
            else{
              this.setState({
                Date:text,
                ValDate:true
              })
            }
          }
          else{
            this.setState({
              Date:text,
              ValDate:true
            })
          }
        }else{
          this.setState({
            Date:text,
            ValDate:true
          })
        }
      // }
    }
    else if(type=='aval_seat'){
      if(num.test(text)){
        this.setState({
          Aval_Seat:text,
          ValAval_Seat:true
        })        
      }
      else{
        alert("Seat is not valid");
        this.setState({
          Aval_Seat:0,
          ValAval_Seat:false
        })
      }    
    }
    else if(type=='price'){
      if(num.test(text)){
        // console.warn("Price is valid");
        this.setState({
          Price:text,
          Valprice:true,
        })        
      }
      else{
        alert("Only Integer is price valid");
        this.setState({
          Price:0,
          Valprice:false
        })
      }    
    }
    else if(type=='vehicle num'){
      if(vehiclePattern.test(text)){
        // console.warn("Price is valid");
        this.setState({
          Vehichle_Num:text,
          ValVehiclenum:true,
        })        
      }
      else{
        // alert("Vehicle Number is not valid");
        this.setState({
          Vehichle_Num:null,
          ValVehiclenum:false
        })
      }    
    }
  }
   
  render() {
    const { selectedHours, selectedMinutes,time } = this.state;
    return (
     <View>
        <View>
          <Text style={styles.header}>Give-Lift</Text>    
        </View>
        <ScrollView>
          <View style={styles.inputContainer}>            
            <DatePicker
              style={[styles.TextInput,!this.state.ValDate? styles.error:null]}
              date={this.state.Date}
              mode="date"
              placeholder="select date"
              format="YYYY-MM-DD"
              minDate="2020-05-07"
              maxDate="2021-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(Date)=>this.validate(Date,'Date')}
              // onDateChange={(Date) => {this.setState({Date: Date})}}
            />
            <View>
              <Text>Pick Up Place</Text>
              <Picker
                selectedValue={this.state.Pick_up}
                onValueChange={(itemValue)=>this.setState({Pick_up:itemValue})}
              >
                <Picker.Item label="Vidhyanagar" value="Vidhyanagar"/>
                <Picker.Item label="Charusat" value="Charusat"/>
                <Picker.Item label="Anand" value="Anand"/>                
                <Picker.Item label="Nadiad" value="Nadiad"/>
                <Picker.Item label="Ahemdabad" value="Ahemdabad"/>
                <Picker.Item label="Vadodara" value="Vadodara"/>              
              </Picker>
            </View>
            <View>
              <Text>Destination Place</Text>
              <Picker
                selectedValue={this.state.Destination}
                onValueChange={(itemValue)=>this.setState({Destination:itemValue})}
              >
                <Picker.Item label="Charusat" value="Charusat"/>
                <Picker.Item label="Vidhyanagar" value="Vidhyanagar"/>
                <Picker.Item label="Anand" value="Anand"/>
                <Picker.Item label="Nadiad" value="Nadiad"/>
                <Picker.Item label="Ahemdabad" value="Ahemdabad"/>
                <Picker.Item label="Vadodara" value="Vadodara"/>              
              </Picker>
            </View>
            <View>
              <Text>Select Vehicle</Text>
              <Picker
                selectedValue={this.state.Vehicle}
                onValueChange={(itemValue)=>this.setState({Vehicle:itemValue})}
              >
                <Picker.Item label="Two-Wheeler" value="Two-Wheeler"/>
                <Picker.Item label="Three-Wheeler" value="Three-Wheeler"/>
                <Picker.Item label="Four-Wheeler" value="Four-Wheeler"/>                           
              </Picker>
            </View>
            <View>
              <Text>Select Gender</Text>
              <Picker
                selectedValue={this.state.Gender}
                onValueChange={(itemValue)=>this.setState({Gender:itemValue})}
              >
                <Picker.Item label="Male" value="Male"/>
                <Picker.Item label="Female" value="Female"/>                                          
              </Picker>
            </View>
            <View style={[styles.container,!this.state.ValHours? styles.error:null]}>
              <Text>Select Time(Hours '&' Minutes)</Text>              
              <TimePicker
                  // selectedHours={selectedHours}                  
                  // selectedMinutes={selectedMinutes}
                  onChange={(hours, minutes) => this.setState({ 
                  selectedHours: hours, selectedMinutes: minutes 
                  })}
                />
            </View>
            <TextInput
              style={[styles.textInput,!this.state.ValAval_Seat? styles.error:null]}
              placeholder="Available Seats"
              maxLength={20}
              keyboardType={'numeric'}
              value={this.state.Aval_Seat} 
              onChangeText={(Aval_Seat)=>this.validate(Aval_Seat,'aval_seat')}                          
            />  
            <TextInput
              style={[styles.textInput,!this.state.Valprice? styles.error:null]}
              placeholder="Price"
              maxLength={20}
              keyboardType={'numeric'}
              value={this.state.Price} 
              onChangeText={(Price)=>this.validate(Price,'price')}
            />
            <TextInput
              style={[styles.textInput,!this.state.ValVehiclenum? styles.error:null]}
              placeholder="Vechile Number(Ex. Gj05ch0034)"
              maxLength={20}                        
              value={this.state.Vehichle_Num} 
              onChangeText={(Vehichle_Num)=>this.validate(Vehichle_Num,'vehicle num')}
            />
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={this.handleSubmit}
            >
            <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
          <Image
            style={{width:400,height:300,resizeMode:"contain"}}
            source={require('./thanks.jpg')}
          />
     </View>
    );
  }
}

const styles=StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:5,
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 25,
    textAlign: 'center',
    fontStyle:'italic',
    marginTop: 20,
    fontWeight: 'bold'
  },
  inputContainer: {
    paddingTop: 15,
    paddingLeft:20,
    paddingRight:20,
  },
  textInput: {
    borderColor: '#CCCCCC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 40,
    fontSize: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  saveButton: {
    borderWidth: 1,
    borderColor: '#080808',
    backgroundColor: '#1284D6',
    padding: 15,
    margin: 5
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center'
  },
  error:{
    borderWidth:3,
    borderColor:'red',
  }
  
});