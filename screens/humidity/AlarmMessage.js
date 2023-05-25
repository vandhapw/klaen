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


function AlarmMessage(props){

    const bottomSheet = useRef();
    let alarmFalseData = false; // default false
    let alarmBadData = false; // default false

    useEffect(() => {
        if(props.humidity == null){
            alarmFalseData = true;
          }
        if(props.humidity > 65){
            alarmBadData = true;
        }

        if(alarmFalseData || alarmBadData){
            send_mail(props.humidity)
        }
    },[])
  
  

    const send_mail = async(hum) => {
        // if(dataHumidity.length > 0){
        //   dataHumidity.map((val) => {
            if(hum == null){
              let to = "jervis.vandraz@gmail.com";
              let subject = "Error Receive Sensor Data";
               let contents = "Dear Customer, \n I would like to inform to you that based on humidity sensor value of our device, there is error on receiving data, please check the device \n Thank you \n Regards, \n Klaen team."
              // let contents = "Dear Customer, \n I would like to inform to you that, based on dust sensor value of our device, the dust sensor value is Bad, please check your room regularly \n turn on your humidifier. \n Thank you very much for your attention. \n Regards, \n Klaen team."
              sendingEmail(to, subject, contents)
              .then((res) => {
                // bottomSheet.current.show(subject)
                // console.log('Message send successfully');
              })
              .catch((err) => {console.log(err)})
            }
            // dust > 80 && dust <= 150
            else if (hum > 65){
              let to = "jervis.vandraz@gmail.com";
              let subject = "Humidity Value of your Room Too Humid";
              let contents = "Dear Customer, \n I would like to inform to you that based on humidity sensor value of our device, the humidity sensor value is Too Humid, please check your room regularly \n. \n Thank you very much for your attention. \n Regards, \n Klaen team."
              sendingEmail(to, subject, contents)
              .then((res) => {
                bottomSheet.current.show()
                // console.log('Message send successfully');
              })
              .catch((err) => {console.log(err)})
            }
      }
   
  return (
      <>
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
        <Text style={[styles.panelTitle,{fontSize: 24, textAlign:'center', color:'#ffffff', fontWeight:'bold', textDecorationLine:'underline'}]}>Your room's Humidity Value is Too Dry or Humid</Text>
      </View>
    </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  
});

export default AlarmMessage;
