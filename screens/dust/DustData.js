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
import BottomSheet from 'react-native-gesture-bottom-sheet';

import { sendingEmail } from '../../util/sendingEmail';
import DustTable from './DustTable';


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

function DustData(){

   
  return (
    <SafeAreaView style={styles.container}>
       {/* Header */}
     <DustTable />
       
    </SafeAreaView>
  );
};

const styles=StyleSheet.create({
  container :{
    // flex: 1
    // width: '100%'
  },

  titleText:{
    fontSize: 16,
    fontWeight:'bold',
    textAlign:'center',
    padding: 20,
    color: '#000000',
    marginStart: '5%'
    // fontFamily:'Times'
  },

  cardList :{
    padding: 20,
    flex: 1,
    flexDirection:'row',
    maxHeight:75
  },

  score: {
    // padding: 10,
    fontSize: 14,
    fontWeight:'bold',
    paddingStart: '5%',
    // width:'100%',
    // backgroundColor: 'yellow',
    textAlign:'center',
  },

  index:{
    padding: 5,
    fontSize: 12,
    fontWeight:'bold',
    marginStart:'10%',
    // paddingStart:20,
    // marginEnd:'10%',
    // backgroundColor:isColor,
    color:'#ffffff',
    borderRadius: 10,
    textAlign:'center',
  },

  smallText:{
    fontSize: 10,
    color: 'gray'
  },

  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

});

export default DustData;
