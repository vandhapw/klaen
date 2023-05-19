import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  ToastAndroid,
} from 'react-native';

import {images, icons, COLORS, FONTS, SIZES} from '../../../constants';
import {Card, Button, TextInput} from 'react-native-paper';
import LoadingOverlay from '../../../component/LoadingOverlay';
import { getSensorValue, getSwitchValue, sendDataMobile } from '../../../util/getPost';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import TimeSetting from './TimeSetting';
import CameraControl from './CameraControl';


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

const Aqi = ({navigation}) => {
  const [modalLighting, setModalLighting] = useState(false);
  const [modalTime, setModalTime] = useState(false);
  const [modalControl, setModalControl] = useState();

  const [latestData, setLatestData] = useState([{}]);
  const [isLoading, setLoading] = useState(true);
  const [smallText, setSmallText] = useState(false);
  const [readHumidity, setHumidity] = useState();
  const [readTemperature, setTemperature] = useState();
  const [readDust, setDust] = useState();
  const [SwitchData, setSwitchData] = useState([{}]);
  const [styleSwitch, setStyleSwitch] = useState(styleSwitch);
  const [textSwitch, setTextSwitch] = useState();
  const [dustValue, setDustValue] = useState();
  const [aqiValue, setAqiValue] = useState();
  const isFocused = useIsFocused(true);
  const [lightingValue, setLightingValue] = useState();
  const [lampLevel, setLampLevel] = useState(lampLevel);
  const [textLevel, setTextLevel] = useState(textLevel);
  const [selfTime, setSelfTime] = useState("");
  const [timerDisplay, setTimerDisplay] = useState("00:00:00");
  const [onoffstatus, setOnOffStatus] = useState();
  const [statusTemperature, setStatusTemperature] = useState();
  const [statusHumidity, setStatusHumidity] = useState();
  const [statusDust, setStatusDust] = useState();
  

  const bottomSheet = useRef();

  let newData = [];
  
  const getSensor = async () => {
    await getSensorValue()
      .then(response => {
        newData = response.filter(function (el, index) {
          return index >= response.length - 1;
        });
        // console.log("Control ", newData)
        setLatestData(newData);
        if(newData.length > 0){
          let hum = newData[0].humidity;
          let temper = newData[0].temperature;
          let dust = newData[0].dustDensity;
          dust = parseInt(dust);
          // console.log(typeof dust);
          // if(newData[0].dustDensity > 50){
          //   console.log("50 ")
          // }
          // console.log(hum)
          switch (true){
            case (hum < 40):
              setHumidity("Too Dry");
              // console.log(hum)
              break;
            case (hum > 40 && hum < 60):
              setHumidity("Ideal");
              break;
            case (hum > 65):
              setHumidity("Too Humid");
              break;
            default:
              setHumidity("No Data");
          }
          // temperature
          switch (true){
            case (temper < 18):
              setTemperature("Too Cold");
              break;
            case (temper > 18 && temper < 24):
              setTemperature("Comfortable");
              break;
            case (temper > 24 && temper < 32):
              setTemperature("Acceptable");
              break;
            case (temper > 32 ):
                setTemperature("Too Hot");
                break;  
            default:
              setTemperature("No Data");
          }
    
          // console.log(dust)
          switch (true){
            case (dust <= 30):
              setDust("Good");
              setAqiValue("Good");
              // console.log(dust)
              break;
            case (dust > 30 && dust <= 80):
              setDust("Normal");
              setAqiValue("Normal");
              // console.log(dust)
              break;
            case (dust > 80 && dust <= 150):
              setDust("Bad");
              setAqiValue("Bad");
              break;
            case (dust > 150):
              setDust("Warning");
              setAqiValue("Warning");
              // console.log(dust)
              break;
            default:
              setDust("No Data");
              setAqiValue("No Data");
          }
    
    
             
          // if(latestData[0].humidity)
        }
        // fetchCurrentData();
        setLoading(false);
      })
      .catch(err => console.log(err));
  };

  const fetchCurrentData = async() => {
    await getSwitchValue()
    .then((res) => {
      setStatusDust(res[0].dust)
      setStatusHumidity(res[0].hum)
      setStatusTemperature(res[0].temp)
      if(res[0].temp > 0){
        setTextSwitch(1)
      }else {
        setTextSwitch(0)
      }
      setLightingValue(res[0].lighting)
      switch (res[0].lighting){
        case 1:
          setLampLevel(icons.lamp100);
          setTextLevel("Lighter");
          break;
        case 2:
            setLampLevel(icons.lamp75);
            setTextLevel("Light");
            break;
        case 3:
          setLampLevel(icons.lamp40)
          setTextLevel("Soft")
          break;
        case 4:
          setLampLevel(icons.lamp10)
          setTextLevel("Softer")
          break;
        case 5:
          setLampLevel(icons.lampOff)
          setTextLevel("OFF")
          break;
        default:
          setLampLevel(icons.lampOff)
          setTextLevel("OFF")
      }
      // console.log("ligthing ", res[0].lighting)
    })
}


  useEffect(() => {
    fetchCurrentData();
    getSensor();
 }, [isFocused, lightingValue]);


    return (
      <View style={styles.container}>
    
        {/* Header */}
        <View style={{flex: 1}}>
          <Text style={{...FONTS.h2, textAlign: 'center', paddingTop: 0, color:'#000000'}}>
            Dashboard
          </Text>
          <Text style={{textAlign: 'center', fontSize: 12, fontWeight: 'bold', color: '#000000'}}>
            Last Updated on : {latestData[0].datetime}
          </Text>
          <View
            style={[
              {
                position: 'absolute',
                bottom: '20%',
                left: '5%',
                right: '5%',
                borderRadius: 15,
                padding: 2,
                // alignItems:'center',
                backgroundColor: COLORS.white,
              },
              styles.shadow,
            ]}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={[
                  styles.shadow,
                  COLORS.primary,
                  {marginTop: 30, marginStart: 30},
                ]}>
                <IconLabel icon={icons.aqIcon} />
              </View>

              <View
                style={{
                  marginHorizontal: SIZES.radius,
                  justifyContent: 'space-around',
                }}>
                <Text style={{...FONTS.h1, marginStart: 35, color:'#000000'}}>{latestData[0].dustDensity}</Text>
              </View>
              <View
                style={{
                  marginHorizontal: SIZES.radius,
                  marginStart: 20,
                  justifyContent: 'space-around',
                }}>
                <Text style={{...FONTS.h1, color: 'green', fontWeight: 'bold'}}>
                  {aqiValue}
                </Text>
              </View>
            </View>
            <View
              style={{position: 'absolute', marginTop: 90, marginStart: 10}}>
              <Text style={{...FONTS.h4, color: 'green', fontWeight: 'bold'}}>
                Air Quality Data
              </Text>
            </View>
          </View>
        </View>

        {/* Body */}
        <View style={{flex: 1.5, bottom: '5%'}}>
          {/* Icons */}
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: SIZES.padding * 2,
              justifyContent: 'space-between',
            }}>
            <IconLabel icon={icons.humidityIcon} label={latestData[0].humidity} />

            <IconLabel icon={icons.temperatureIcon} label={latestData[0].temperature} />

            <IconLabel icon={icons.dust_icon} label={latestData[0].dustDensity} />
          </View>
          <View
            style={[
              {
                flexDirection: 'row',
                marginTop: SIZES.base,
                paddingHorizontal: SIZES.padding * 2,
                justifyContent: 'space-between',
              },
            ]}>
            <Text style={{color:'#000000'}}>{readHumidity} </Text>
            <Text style={{color:'#000000', marginEnd:30}}>{readTemperature} </Text>
            <Text style={{color:'#000000'}}>{readDust}</Text>
          </View>
          <View
            style={[
              {
                flexDirection: 'row',
                marginTop: SIZES.base,
                paddingHorizontal: SIZES.padding * 2,
                justifyContent: 'space-between',
              },
            ]}>
            <Text style={{color:'#000000'}}>Humidity  </Text>
            <Text style={{color:'#000000'}}> Temperature</Text>
            <Text style={{color:'#000000'}}> Dust Density</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: SIZES.base,
              paddingHorizontal: SIZES.padding * 2,
              justifyContent: 'space-between',
              marginTop: 30,
            }}>
            <TouchableOpacity onPress={() => navigation.navigate("Lighting")}>
              <IconLabel icon={lampLevel} label={textLevel} />
            </TouchableOpacity>

            <TimeSetting data={{textSwitch:textSwitch,lightingValue:lightingValue}}/>

            <CameraControl />
            </View>
      
       
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
  centeredView: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    marginTop: '50%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 35,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelHeader: {
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  pressableButton:{
    position: 'relative',
    top:0,
    left:0
  },
  timeCounting: {
    padding: 10,
    marginTop: 10,
    backgroundColor: '#ffffff',
    // paddingBottom: '10%',
    borderRadius:10,
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  selfTimeSetup: {
    width: '50%',
    fontSize: 8,
    flex: 1,
    // flexDirection: 'row'
  },
});

export default Aqi;
