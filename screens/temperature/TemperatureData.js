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

import { COLORS, FONTS, icons, SIZES } from '../../constants';

import TemperatureTable from './TemperatureTable';


function TemperatureData(){

  console.log('temperature')
   
  return (
    <SafeAreaView style={styles.container}>
      
    <TemperatureTable />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container :{
    // flex: 1
    // width: '100%'
  },

  
});

export default TemperatureData;
