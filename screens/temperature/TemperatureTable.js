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

import SwitchTemperature from './SwitchTemperature';
import TemperatureAlarm from './TemperatureAlarm';


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

function TemperatureTable(){

    const [temperatureData, setTemperatureData] = useState();
    const [isLoading, setLoading] = useState(true);
    const [currentTemperature, setCurrentTemperature] = useState();
    const [currentHumidity, setCurrentHumidity] = useState();
    const [currentDust, setCurrentDust] = useState();
    const [currentLighting, setCurrentLighting] = useState();
    const [isPage, setPage] = useState(1);
    const [initialData, setInitialData] = useState(11);
    const [lastData, setLastData] = useState();
    const [isEnabled, setIsEnabled] = useState(isEnabled);
  
  
    const styles = getStyles();
  
   
    let last10Data = []
    let tempValue;
    let Index={};
   
  
    const getTemperatureData = async () => {
      await getSensorValue()
      .then ((res) => {
        let tenData = res.filter(function(el,index){
          setLastData(res.length)
          return index >= res.length - initialData; // default 10
        })
        // console.log("tenData", initialData)
        tenData.map((val) => {
          // console.log("a",val.temperature[0])
          
          switch (true){
            case (val.temperature < 18):
              Index = {"datetime": val.datetime, "dustDensity": val.dustDensity, "humidity": val.humidity, "temperature": val.temperature, "timestamps": val.timestamps, "index":"Too Cold", "color": "#00337C"}
            //   alarmBadData = true;
              tempValue = val.temperature;
              break;
            case (val.temperature >= 18 && val.temperature < 24):
              Index = {"datetime": val.datetime, "dustDensity": val.dustDensity, "humidity": val.humidity, "temperature": val.temperature, "timestamps": val.timestamps, "index":"Comfortable", "color": "#1F8A70"}
              break;
            case (val.temperature >= 24 && val.temperature < 32):
              Index = {"datetime": val.datetime, "dustDensity": val.dustDensity, "humidity": val.humidity, "temperature": val.temperature, "timestamps": val.timestamps, "index":"Acceptable", "color": "#00425A"}
              break;
            case (val.temperature > 32 ):
              Index = {"datetime": val.datetime, "dustDensity": val.dustDensity, "humidity": val.humidity, "temperature": val.temperature, "timestamps": val.timestamps, "index":"Too Hot", "color": "#D61355"}
            //   alarmBadData = true;
              tempValue = val.temperature;
              break;
           default:
              Index = {"datetime": val.datetime, "dustDensity": val.dustDensity, "humidity": val.humidity, "temperature": val.temperature, "timestamps": val.timestamps, "index":"Null", "color": "#D61355"}
          }
          last10Data.push(Index)
          last10Data.reverse()
        })
          setTemperatureData(last10Data)
          setLoading(false)
         })
        //  last10Data = []
      .catch((err) => console.log(err))
      // last10Data = [];
    }
  
    const currentData = async() =>{
        await getSwitchValue()
        .then((data) => {
          // console.log("data ",data)
          setCurrentTemperature(data[0].temperature)
          setCurrentHumidity(data[0].humidity)
          setCurrentDust(data[0].dust)
          setCurrentLighting(data[0].lighting)
          if(data[0].temperature > 0){
            setIsEnabled(false)
          }else {
            setIsEnabled(true)
          }
        })
        .catch((err)=> console.log(err))
    }
  
    const previousPage = () => {
      setLoading(true)
      setInitialData(initialData - 10)
      setPage(isPage - 1);
      getTemperatureData()
    }
  
    const nextPage = () => {
      setLoading(true)
      setPage(isPage + 1)
      setInitialData(initialData + 10)
      getTemperatureData()
    }
  

  
    const Item = ({item}) => (
      <Card title={"Temperature Data"} style={[styles.shadow,{marginBottom: '2%'}]}>
      <View style={[styles.cardList]}>
        <View style={{paddingEnd: 20}}>
        <IconLabel icon={icons.temperatureIcon} label={""} />
        </View>
        <View>
        <Text style={[styles.title,{color:'#060047'}]}>Temperature Value : </Text>
        <Text style={styles.smallText}>On : {item.datetime}</Text>
        </View>
        <View>
        <Text style={[styles.score, {color:'#060047'}]}>{item.temperature}</Text>
      </View>
      <View style={{ width: '22%'}}>
        <Text style={[styles.index, {backgroundColor: item.color}]}>{item.index}</Text>
      </View>
      </View>
     
      </Card>
    );
  
  
    useEffect(() => {
      getTemperatureData();
      currentData();
      // console.log(initialData)
     }, [initialData])

  // console.log(dataHumidity)
   
  return (
    <>
    <SwitchTemperature status={isEnabled} />

        <View style={{flexDirection:'row', justifyContent:'center', alignContent:'center', alignItems:'center'}}>
        {isPage != 1 ? 
          <TouchableOpacity style={{marginEnd:'10%'}} onPress={() => previousPage()}>
          <Text style={{color:'#060047'}}> Previous</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity style={{marginEnd:'10%'}} disabled={true}>
          <Text style={{color: '#DDDDDD'}}> Previous</Text>
        </TouchableOpacity>
        }        
        <Text style={{color:'#060047'}}>Page {isPage}</Text>
        {(lastData - isPage) >= 10 ? 
        <TouchableOpacity  style={{marginStart:'10%'}} onPress={() => nextPage()}>
          <Text style={{color: '#060047'}}>Next</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity  style={{marginStart:'10%'}} disabled={true}>
          <Text style={{color: '#DDDDDD'}}>Next</Text>
        </TouchableOpacity>
        }
        </View>
        
      {isLoading ? <ActivityIndicator size="large" /> : 
        
          <FlatList 
            data={temperatureData}
            keyExtractor={(item, index) => {
              return item.timestamps;
            }}
            renderItem={Item}
          />
      }

      <TemperatureAlarm temperature={tempValue} />

    
    </>
  );
};

const getStyles = () =>StyleSheet.create({
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
    marginStart: '15%'
  },

  index:{
    padding: 5,
    fontSize: 12,
    fontWeight:'bold',
    // marginStart:'2%',
    // marginEnd:'20%',
    // backgroundColor:isColor,
    color:'#ffffff',
    borderRadius: 10,
    textAlign:'center'
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

export default TemperatureTable;
