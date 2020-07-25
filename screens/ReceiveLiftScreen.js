import *as React from 'react';
import { View,Text, StyleSheet,ScrollView, TouchableOpacity, Button} from 'react-native'
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {BackHandler,Picker} from "react-native";
import firebase from 'firebase';
import Modal from "react-native-modal";
import { TextInput } from 'react-native-gesture-handler';
import ItemComponent from '../components/ItemComponent';
import email from 'react-native-email';

export default class ReceiveLiftScreen extends React.Component {
  user = firebase.auth().currentUser;  
  constructor(props) {
    super(props);    
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);  
    this.state={
     Pick_up:'Vidhyanagar', //selected pick up
     Destination:'Charusat', //selected destination
     items:[],    //fetched items
     Srtitems:[], //Sorted items     
     isModalVisible: false,   //model
     Seitem:'',//selected item
     sekey:'', //selected item's key
     ValDate:true,
     firstname:'', //current user first name
     lastname:'',
     Email:'',
     Emailbody:'',
    }  
    // this.fetchCurrentUserData()    
    // let Seitem;//selected item     
    // alert(this.state.fname)
  }  
  componentDidMount() {
   try{
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick); 
      firebase.database().ref('users').on('value',(snapshot)=>{      
      let userObj=snapshot.val();
      const data = Object.values(userObj);      
      let len=data.length;   
      for(let i=0;i<len;i++){
        if(!(data[i].info==null)){
        this.state.items.push({
          userid:data[i].userid,
          fname:data[i].first_name,
          lname:data[i].last_name,
          date:data[i].info.date,
          Pick_up:data[i].info.pickup,
          Destination:data[i].info.destination,
          VehicleType:data[i].info.Vehicle,
          VehicleNumber:data[i].info.VehichleNumber,
          AvailebleSeat:data[i].info.AvailebleSeat,
          gender:data[i].info.gender,
          hours:data[i].info.hours,
          minutes:data[i].info.minutes,
          price:data[i].info.Price,
          gmail:data[i].gmail,
        });
        }   
      }                
    }    
    );     
    }catch(error){
    alert(error.message)
    } 
  
    firebase.database().ref('/users/'+this.user.uid).on('value',(snapshot)=>{
    const userObj=snapshot.val();
    if(userObj!=null){
      this.setState({firstname:userObj.first_name});
      this.setState({lastname:userObj.last_name});
      this.setState({Email:userObj.gmail});
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
    // We can move to any screen. If we want
    this.props.navigation.navigate('DashboardScreen');
    // Returning true means we have handled the backpress
    // Returning false means we haven't handled the backpress
    return true;
  }
  Datevalidation(text){
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
          this.setState({ValDate:false})
        }
        else if(year==cyear){
          if(month<cmonth){
            this.setState({ValDate:false})
          }
          else if(month==cmonth){
            if(date<cdate){
              this.setState({ValDate:false})
            }
            else{
              this.setState({                
                ValDate:true
              })
            }
          }
          else{
            this.setState({
              ValDate:true
            })
          }
        }else{
          this.setState({
            ValDate:true
          })
        }
  }
  handleSubmit=()=>{     
   this.state.Srtitems.length=0;
   this.state.items.map((item,key)=>{     
      if((item.Pick_up==this.state.Pick_up)&&(item.Destination==this.state.Destination)&&(item.AvailebleSeat!=0)){
        if(!this.state.Srtitems.includes(item)){
          this.Datevalidation(item.date)
          if(this.state.ValDate){            
            this.state.Srtitems.push(item)
          }          
        }
      }
    
    
    })
    // alert(this.state.items[1].lname)    
    alert("Available Lift: "+this.state.Srtitems.length)   
    
  }
  freelift=()=>{     
    // alert(this.state.items[1].lname)     
    //  this.state.Srtitems.length=0;
   this.state.Srtitems.map((item,key)=>{     
      if((item.price!=0)){        
          this.state.Srtitems.splice(key,1);        
      }
    })
    alert("Free lift: "+this.state.Srtitems.length)    
  }
  static navigationOptions = {  
    title: 'ReceiveLiftScreen',  
    headerStyle: {  
        backgroundColor: '#f4511e',  
    },  
    //headerTintColor: '#0ff',  
    headerTitleStyle: {  
        fontWeight: 'bold',  
    },  
  }; 
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  bookseat=()=>{          
      let uid=this.state.Seitem.userid;
      let seat=this.state.Seitem.AvailebleSeat-1;
      this.state.Seitem.AvailebleSeat=seat;  
      
      // alert(this.state.firstname)
      firebase
      .database()
      .ref('/users/' + uid + '/info/')
      .update({        
        AvailebleSeat: seat,         
      })
      alert("Your Lift is book");
      this.state.Emailbody='Your lift from '+this.state.Seitem.Pick_up+' to '+this.state.Seitem.Destination
      +' is book.'+'\n'+'Lift Receiver: '+this.state.firstname+' '+this.state.lastname+'\n'+         
      'Date: '+this.state.Seitem.date+'\n'+"***ADD EXTRA  INFORMATION BELOW THAT YOU WANT TO ADD***";
      const  to=[this.user.gmail,this.state.Seitem.gmail]
      email(to,{
        subject:'Your lift Receiver information',
        body:this.state.Emailbody
        // 'Vehichle Number: '+this.state.Seitem.VehicleNumber+'\n'+
        // 'Vehicle Type: '+this.state.Seitem.Vehicle+'\n'+
        // 'Pick Up time: '+this.state.Seitem.hours+':'+this.state.Seitem.minutes+'\n'        
      }).catch(console.error)

      this.setState({ isModalVisible: !this.state.isModalVisible });
      if(this.state.Seitem.AvailebleSeat<=0){
        delete this.state.Srtitems[this.state.sekey];
      }       
  }
  showArrayItem = (item,key) => {    
    this.state.Seitem=item;
    this.state.sekey=key; 
    // alert(this.state.Seitem.gmail)
    this.setState({ isModalVisible: !this.state.isModalVisible });   
  }
render() {  
    return(      
      <View style={{marginLeft:10,marginRight:10}}>
        <View>
          <Text style={styles.header}>Receive-Lift</Text>
        </View>
        <ScrollView>
            <View style={styles.filter}>
                <Text >Pick up point</Text>
                <Picker
                          // placeholder='Pick up'
                          selectedValue={this.state.Pick_up}
                          style={{height:50,width:75}}
                          onValueChange={(itemValue)=>this.setState({Pick_up:itemValue})}
                        >
                          <Picker.Item label="Vidhyanagar" value="Vidhyanagar"/>
                          <Picker.Item label="Charusat" value="Charusat"/>
                          <Picker.Item label="Anand" value="Anand"/>                
                          <Picker.Item label="Nadiad" value="Nadiad"/>
                          <Picker.Item label="Ahemdabad" value="Ahemdabad"/>
                          <Picker.Item label="Vadodara" value="Vadodara"/>              
                </Picker>
                <Text>Destination point</Text>
                <Picker
                          style={{height:50,width:75}}
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
              <Button title="show" color="#E4717F" type='outline' onPress={()=>{this.handleSubmit()}}/>
            </View>
            {/* <Button title="Free Lift" color="#E4717F" type='outline' onPress={()=>{this.freelift()}}/>                    */}
            <Text style={{paddingTop:5,paddingBottom:5}}>Name                  Pickup          Destination  Price(₹) Time(24)</Text>
            <View style={{ width: '100%', height: 1, backgroundColor: '#000' }} />
        </ScrollView>        
        <ScrollView>
        {
          this.state.Srtitems.map((item, key) => (
            <TouchableOpacity style={styles.TouchableOpacity} key={key} onPress={()=>this.showArrayItem(item,key)}>
              <Text style={styles.TextStyle} >{item.fname} {item.lname}   {item.Pick_up}        {item.Destination}    {item.price}      {item.hours}:{item.minutes}</Text>
              <View style={{ width: '100%', height: 3, backgroundColor: '#000' }} />
            </TouchableOpacity>              
          ))         
        }       
        <Modal isVisible={this.state.isModalVisible} backdropColor='white' borderColor='black'>
          <View style={styles.model}>             
            <Text>Available Seat:     {this.state.Seitem.AvailebleSeat}</Text>
            <Text>Date:                     {this.state.Seitem.date}</Text>
            <Text>Gender:                 {this.state.Seitem.gender}</Text>
            <Text>VehicleNumber:  {this.state.Seitem.VehicleNumber}</Text>
            <Text>Vehicle Type:       {this.state.Seitem.VehicleType}</Text> 
            <View style={{flexDirection:"row"}}>
              <Button style={styles.bookbutton} title="Book Lift" onPress={()=>this.bookseat()} />
              <Button style={styles.bookbutton} title="Cancel" onPress={this.toggleModal} />
            </View>        
          </View>
        </Modal>        
        </ScrollView>
      </View>
    )
  }
}
const styles=StyleSheet.create({
  model:{
    height:200,
    width:300,
   flexDirection:'column',
   justifyContent:'center',
   alignItems:'flex-start',
  },
  bookbutton:{
    borderRadius:10,
    backgroundColor:'#200910'
  },
  container: {
    flex: 1,
    paddingTop: 45,
    paddingRight:20,
    paddingLeft:20,
    backgroundColor: '#F5FCFF',
  },
  header: {
    paddingRight:20,
    paddingLeft:20,
    fontStyle:'italic',
    fontSize: 25,
    textAlign: 'center',
    marginTop: 30,
    fontWeight: 'bold'
  },
  filter:{
    paddingRight:20,
    paddingLeft:20,
    backgroundColor:'#79E5EA',
    flexDirection:'row',
    justifyContent:'space-between',
   
  },
  inputContainer: {
    paddingTop: 15
  },
  textInput: {
    paddingRight:20,
    paddingLeft:20,
    borderColor: '#CCCCCC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 50,
    fontSize: 25,
    paddingLeft: 20,
    paddingRight: 20
  },
  saveButton: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    borderWidth: 10,
    borderColor: '#007BFF',
    backgroundColor: '#233333',
    padding: 15,
    marginTop:10
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center'
  },
  TextStyle: {
    fontSize: 15,
    color: '#000',
    textAlign: 'left'
  },
  TouchableOpacity:{
    backgroundColor:'#D8FEEB',
    paddingTop:5,
    paddingBottom:5,
  }
});