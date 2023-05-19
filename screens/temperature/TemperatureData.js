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

function TemperatureData(){

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
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    // console.log(isEnabled, " toggle");
    if(isEnabled){
      onoffStatus(currentHumidity, 0, currentDust, currentLighting);
    }else {
      onoffStatus(currentHumidity, 1, currentDust, currentLighting);
    }
  }

  const styles = getStyles();

  const bottomSheet = useRef();


  let last10Data = []
  let tempValue;
  let Index={};
  let alarmFalseData = false; // default false
  let alarmBadData = false; // default false



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
            alarmBadData = true;
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
            alarmBadData = true;
            tempValue = val.temperature;
            break;
         default:
            Index = {"datetime": val.datetime, "dustDensity": val.dustDensity, "humidity": val.humidity, "temperature": val.temperature, "timestamps": val.timestamps, "index":"Null", "color": "#D61355"}
        }
        // let temperatureV = null
        if (val.temperature == null ){
          Index = {"datetime": val.datetime, "dustDensity": val.dustDensity, "humidity": val.humidity, "temperature": val.temperature, "timestamps": val.timestamps, "index":"Null", "color": "#D61355"}
          alarmFalseData = true;
          tempValue = val.temperature;
        }
        // console.log(val.temperature)
        last10Data.push(Index)
        last10Data.reverse()
      })
        setTemperatureData(last10Data)
        if(alarmFalseData || alarmBadData){
          send_mail(tempValue)
        }
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

  const onoffStatus = async(humidity, temperature, dust, lighting) => {
    await sendDataMobile(humidity, temperature, dust, lighting)
    .then((res) => {
      ToastAndroid.show("Change Status Successfully!", ToastAndroid.SHORT)
    })
    .catch((err) => err)
    // console.log(temperature)
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
    <View style={{ width: '30%'}}>
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

  // console.log(temperatureData)
   
  return (
    <SafeAreaView style={styles.container}>
       {/* Header */}
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
            Temperature Sensor Data
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
    </SafeAreaView>
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
    marginStart: '12%'
  },

  index:{
    padding: 5,
    fontSize: 12,
    fontWeight:'bold',
    marginEnd:'20%',
    // backgroundColor:isColor,
    color:'#ffffff',
    borderRadius: 10
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

export default TemperatureData;
