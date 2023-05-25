/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useRef} from 'react';
import {
    Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ActivityIndicator,
  Image,
  FlatList,
  Switch,
  ToastAndroid,
  Pressable,
  TouchableOpacity
} from 'react-native';


import BottomSheet from 'react-native-gesture-bottom-sheet';

import { sendingEmail } from '../../util/sendingEmail';


function TemperatureAlarm(props){

    const bottomSheet = useRef();
    let alarmFalseData = false; // default false
    let alarmBadData = false; // default false

    useEffect(() => {
        if(props.temperature == null){
            alarmFalseData = true;
        }
        if(props.temperature > 65){
            alarmBadData = true;
        }
        if(props.temperature < 18){
            alarmBadData = true
        }
        if(alarmFalseData || alarmBadData){
            send_mail(props.temperature)
        }
    },[])
  
  

    const send_mail = async(temp) => {
      if(temp == null){
        let to = "jervis.vandraz@gmail.com";
        let subject = "Error Receive Sensor Data";
         let contents = "Dear Customer, \n I would like to inform to you that based on temperature sensor value of our device, there is error on receiving data, please check the device \n Thank you \n Regards, \n Klaen team."
        // let contents = "Dear Customer, \n I would like to inform to you that, based on dust sensor value of our device, the dust sensor value is Bad, please check your room regularly \n turn on your humidifier. \n Thank you very much for your attention. \n Regards, \n Klaen team."
        sendingEmail(to, subject, contents)
        .then((res) => {
          // bottomSheet.current.show(subject)
          // console.log('Message send successfully');
        })
        .catch((err) => {console.log(err)})
      }
      // dust > 80 && dust <= 150
      else if (temp > 32){
        let to = "jervis.vandraz@gmail.com";
        let subject = "Temperature Value of your Room Too Hot";
        let contents = "Dear Customer, \n I would like to inform to you that based on temperature sensor value of our device, the temperature sensor value is Too Hot, please check your room regularly \n. \n Thank you very much for your attention. \n Regards, \n Klaen team."
        sendingEmail(to, subject, contents)
        .then((res) => {
          bottomSheet.current.show()
          // console.log('Message send successfully');
        })
        .catch((err) => {console.log(err)})
      }
      else if (val.temperature < 18){
        let to = "jervis.vandraz@gmail.com";
        let subject = "Temperature Value of your Room Too Cold";
        let contents = "Dear Customer, \n I would like to inform to you that based on temperature sensor value of our device, the temperature sensor value is Too Cold, please check your room regularly \n. \n Thank you very much for your attention. \n Regards, \n Klaen team."
        sendingEmail(to, subject, contents)
        .then((res) => {
          bottomSheet.current.show()
          // console.log('Message send successfully');
        })
        .catch((err) => {console.log(err)})
      }
  // console.log(contents)
}
   
  return (
      <>
       {/* // bottom Sheet */}
       <BottomSheet hasDraggableIcon ref={bottomSheet} height={200}>
          <View
            style={{
              backgroundColor: '#CD0404',
              padding: 6,
              height: 200,
              alignItems: 'center',
              justifyContent: 'center',
              width:'100%',
              marginTop:0
              // position:'absolute'
            }}>
            <Text style={[styles.panelTitle, {color:'#ffffff', fontSize: 16, textAlign:'center', paddingBottom:10}]}>The device is detecting</Text>
            <Text style={[styles.panelTitle,{fontSize: 24, textAlign:'center', color:'#ffffff', fontWeight:'bold', textDecorationLine:'underline'}]}>Your room's Temperature Value is Too Cold or Hot</Text>
          </View>
        </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  
});

export default TemperatureAlarm;
