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
import { getSensorValue, getSwitchValue, sendDataMobile } from '../../util/getPost';
import { Card } from 'react-native-paper';

import { COLORS, FONTS, icons, SIZES } from '../../constants';


function SwitchDust(props){

  const [isEnabled, setIsEnabled] = useState(props.status);
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    // console.log(isEnabled, " toggle");
    if(isEnabled){
      onoffStatus(currentHumidity, currentTemperature, 0, currentLighting);
    }else {
      onoffStatus(currentHumidity, currentTemperature, 1, currentLighting);
    }
  }


 


  const onoffStatus = async(humidity, temperature, dust, lighting) => {
    await sendDataMobile(humidity, temperature, dust, lighting)
    .then((res) => {
      ToastAndroid.show("Change Status Successfully!", ToastAndroid.SHORT)
    })
    .catch((err) => err)
    // console.log(temperature)
  }


   
  return (
    <View>
          
    <View
      style={[
        {
          // position: 'absolute',
          // bottom: '20%',
          left: '5%',
          right: '5%',
          borderRadius: 15,
          padding: 2,
          // alignItems:'center',
          backgroundColor: COLORS.white,
          marginBottom: 10,
          marginEnd: 40,
          marginTop: 10
        },
        styles.shadow,
      ]}>
        <Text style={{...FONTS.h2, textAlign: 'center', paddingTop: 10, color:'#000000', fontWeight:'bold', textDecorationLine:'underline'}}>
      Dust Sensor Data
    </Text>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            marginHorizontal: SIZES.radius,
            justifyContent: 'space-around',
          }}>
          <Text style={{...FONTS.h3, marginStart: 35, color:'#000000'}}>Sensor Status : </Text>
        </View>
        <View
          style={{
            marginHorizontal: SIZES.radius,
            marginStart: 20,
            justifyContent: 'space-around',
          }}>
          <Text style={{...FONTS.h1, color: '#CD0404', fontWeight: 'bold'}}>
          <Switch 
        trackColor={{false: '#CD0404', true:'#1F8A70'}}
        thumbColor={isEnabled ? '#EEEEEE' : '#EEEEEE'}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      {isEnabled ? "OFF" : "ON"}
          </Text>
        </View>
      </View>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  
});

export default SwitchDust;
