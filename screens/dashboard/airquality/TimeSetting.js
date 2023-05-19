import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ToastAndroid,
  Pressable
} from 'react-native';
import {Card, Button, TextInput} from 'react-native-paper';

import {images, icons, COLORS, FONTS, SIZES} from '../../../constants';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import sendDataMobile from '../../../util/getPost'

const IconLabel = ({icon, label}) => {
    return (
      <View style={{alignItems: 'center'}}>
        <Image
          source={icon}
          resizeMode="cover"
          style={{
            width: 50,
            height: 50,
          }}
        />
        <Text style={{marginTop: SIZES.padding, color: COLORS.gray, ...FONTS.h3}}>
          {label}
        </Text>
      </View>
    );
  };

const TimeSetting = ({data}) => {
    const bottomSheet = useRef();
    const [selfTime, setSelfTime] = useState("");
    const [timerDisplay, setTimerDisplay] = useState("00:00:00");
    const [labelSwitch, setLabelSwitch] = useState(data.textSwitch)
    
    // console.log('tes data ', data.textSwitch, 'lighting ', data.lightingValue)

    function timerCounter(timer){
        // if(textSwitch == "OFF"){
        if(timer > 0){
        timer = Number(timer);
        currentDates = new Date();
        currentDates.setMinutes(currentDates.getMinutes()+timer);
    
        countDownDate = new Date(currentDates).getTime();
        setSmallText(false)
          
    
        // update count down every 1 second
        x = setInterval(function() {
          now = new Date().getTime(); // get todays date and time
          distance = countDownDate - now; // find the distance between now and count down date
          // Time calulations for hours, minutes and seconds
          hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
          // output the result
          timerDisplays = hours+ "h " + minutes + "m " + seconds + "s ";
          setTimerDisplay(timerDisplays)
          // console.warn(smallText)
          
          // if the count down is over, change with this result
          if(distance < 0 && data.textSwitch > 0){
            clearInterval(x);
            pressSwithOff(0,0,0, data.lightingValue);
            setLabelSwitch(0)
            setTimerDisplay("00:00:00")
            // console.log(timerDisplay)
          }else if(distance < 0 && data.textSwitch < 1) {
            clearInterval(x);
            pressSwithOff(1,1,1, data.lightingValue);
            setTimerDisplay("00:00:00")
            setLabelSwitch(1)
          }
        }, 1000)
       }
       else {
          setTimerDisplay("00:00:00")
          clearInterval(x);
       }
      }
    
      //  const pressSwithOff = async(humidity, temperatur, dust, lighting) => {
        async function pressSwithOff(humidity, temperatur, dust, lighting){
        // console.log("onpRess ", humidity, temperatur, dust, lighting)
        await sendDataMobile(humidity, temperatur,dust, lighting)
        .then((response) => {    
          if(humidity == 0){
            setTextSwitch(0)
          }else {
            setTextSwitch(1)
          } 
          ToastAndroid.show("Changing Device Successfully", ToastAndroid.SHORT)
        })
        .catch(err => console.log(err))
        // console.log('asd');
      }
    
      function reset(){
        timerCounter(0);
        setTimerDisplay("00:00:00");    
      }
    

    return (
    <View>
     <BottomSheet hasDraggableIcon ref={bottomSheet} height={400}>
     <View
       style={{
         backgroundColor: 'white',
         padding: 6,
         height: 400,
         alignItems: 'center',
         justifyContent: 'center',
         width:'100%',
         marginTop:0
         // position:'absolute'
       }}>
       <Text style={[styles.panelTitle, {marginBottom: 100, color:'#000000'}]}>Timer Setting</Text>
       <View style={{width: '75%', paddingStart: 10, marginTop:-70}}>
           <Card style={[{paddingTop:0}]}>
               <TextInput label={"in Minute"} placeholder={"Ex. 120"} style={{backgroundColor: 'transparent'}} 
                 value={selfTime}
                 onChangeText={selfTime => parseInt(setSelfTime(selfTime))}
               />
           </Card>
           <Pressable onPress={()=>timerCounter(selfTime)} style={styles.pressableButton}>
             <Card style={[{paddingTop:0, width: '100%', paddingRight: 15, paddingStart: 5, backgroundColor: '#26ADE4', marginTop: 10, justifyContent:'center' }]}>
               <Text style={{margin: 5, color: '#ffffff', textAlign:'center'}}>Submit</Text>
             </Card>
             </Pressable>
             <Pressable onPress={() => reset()} style={styles.pressableButton}>
             <Card style={[styles.card, {paddingTop:0, width: '100%',paddingRight: 25, paddingStart: 5, backgroundColor: '#8D091B', marginTop: 10 }]}>
               <Text style={{margin:5,color: '#ffffff', textAlign:'center'}}>Reset</Text>
             </Card>
             </Pressable>
             {labelSwitch > 0 || labelSwitch == null ? 
                <Pressable style={styles.pressableButton} onPress={() => pressSwithOff(0,0,0,lightingValue) }>
                <Card style={[styles.card, {paddingTop:0, width: '100%', paddingRight: 15, paddingStart: 5, backgroundColor: '#8D091B', marginTop: 10, justifyContent:'center' }]}>
                  <Text style={{margin: 5, color: '#ffffff', textAlign:'center'}}>Turn OFF Device</Text>
                </Card>
                </Pressable> 
               :
               <Pressable style={styles.pressableButton} onPress={() => pressSwithOff(1,1,1, lightingValue)}>
               <Card style={[styles.card, {paddingTop:0, width: '100%', paddingRight: 15, paddingStart: 5, backgroundColor: '#8D091B', marginTop: 10, justifyContent:'center' }]}>
                 <Text style={{margin: 5, color: '#ffffff', textAlign:'center'}}>Turn ON Device</Text>
               </Card>
               </Pressable> 
             }
            
             <View style={styles.timeCounting}>
             <Text style={[styles.textWhite,{fontSize: 16, textAlign:'center', color:'#000000'}]}>{timerDisplay}</Text> 
           {/* }      */}
           </View> 
       </View>
     </View>
   </BottomSheet>

    <TouchableOpacity onPress={() => bottomSheet.current.show()}>
        <IconLabel icon={icons.timeIcon} label="Time Setting" />
    </TouchableOpacity>
 
    </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  
});

export default TimeSetting;
