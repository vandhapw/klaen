/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect,useRef} from 'react';
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
  TouchableOpacity,
  Pressable,
  Animated
} from 'react-native';

import { NavigationContainer, useNavigation } from '@react-navigation/native';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


import IndexAir from './dashboard/airquality/IndexAir';
import Lighting from './dashboard/Lighting';

const Tab = createMaterialTopTabNavigator();

function MainScreen(){


  return (
   <Tab.Navigator>
      <Tab.Screen name='Air Quality' component={IndexAir} />
      <Tab.Screen name='Lighting' component={Lighting} />
   </Tab.Navigator>
   
   
  )
}

export default MainScreen;

const styles = StyleSheet.create({
    MainColor: {
      color: '#000000',
      fontWeight: 'bold',
      fontSize: 12,
      paddingBottom: 5,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
      textTransform: 'uppercase'
    },

    mainView: {
      flex: 1,
      flexDirection: 'row',
      paddingTop: 10
    },
    secondView: {
      flex: 1,
      flexDirection: 'column'
    },
    thirdView: {
      flex: 1,
      flexDirection: 'row',
    },

    randomMainValue: {
      padding: 10,
      paddingStart: 5,
      // backgroundColor: 'yellow',
      maxWidth: '50%',
      width: '100%',
      maxHeight: '100%'
    },
    cardMainValue:{
      backgroundColor: '#7D0000',
      maxWidth: '100%',
      alignItems: 'center',
      paddingBottom: 20
    },
    textMainValue:{
      color: '#ffffff',
      textAlign: 'center'
    },

    secondView: {
      padding: 10,
      paddingStart: 0,
      paddingRight:5,
      // backgroundColor: 'yellow',
      maxWidth: '50%',
      width: '100%',
      maxHeight: '100%'
    },
    chartView: {
      maxWidth: '100%',
      maxHeight: '50%',
    },
    cardChart: {
      backgroundColor: '#344D6C',
      paddingTop:5,
      paddingBottom: '10%'
    },
    textChart: {
      color: '#ffffff',
      textAlign: 'center'
    }, 

    controlView: {
      // backgroundColor: 'blue',
      maxHeight: '50%',
      paddingTop: 10,
    },
    cardControl: {
      backgroundColor: '#4B4545',
      paddingBottom:'10%'
    },
    textcontrol: {
      color: '#ffffff',
      textAlign: 'center'
    },

    articleView: {
      padding: 0,
      paddingStart: 5,
      // backgroundColor: 'yellow',
      maxWidth: '48%',
      width: '100%',
      maxHeight: '100%'
    },
    cardArticle: {
      backgroundColor: '#372650',
     
    },
    textArticle:{
      color: '#ffffff',
      textAlign: 'center'

    },

    aqiView: {
      padding: 0,
      paddingEnd: 5,
      paddingStart:10,
      // backgroundColor: 'yellow',
      maxWidth: '52%',
      width: '100%',
      maxHeight: '100%'
    },
    cardAqi: {
      backgroundColor: '#9B3321'
    },
    textAqi: {
      color: '#ffffff',
      textAlign: 'center'
    },

    pressableButton:{
      position: 'relative',
      top:0,
      left:0
    }
  });

