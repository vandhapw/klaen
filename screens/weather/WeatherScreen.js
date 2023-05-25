
import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity, FlatList, ActivityIndicator
} from 'react-native';
import { Card } from 'react-native-paper';

import { images, icons, COLORS, FONTS, SIZES } from '../../constants';

import { getSensorValue, getSwitchValue, sendDataMobile } from '../../util/getPost';

import FrontPage from '../../component/klaen/FrontPage';


const IconLabel = ({ icon, label }) => {
    return (
        <View style={{ alignItems: 'center' }}>
            <Image
                source={icon}
                resizeMode="cover"
                style={{
                    width: 50,
                    height: 50,
                }}
            />
            <Text style={{ marginTop: SIZES.padding, color: COLORS.gray, ...FONTS.h3 }}>{label}</Text>
        </View>
    )
}

const WeatherScreen = ({ navigation }) => {

    const [dataHumidity, setHumidityData] = useState();
    // const [flatlistHumidityData, setHumidityData] = useState();
    const [isLoading, setLoading] = useState(true);
    const [currentTemperature, setCurrentTemperature] = useState();
    const [currentHumidity, setCurrentHumidity] = useState();
    const [currentDust, setCurrentDust] = useState();
    const [currentLighting, setCurrentLighting] = useState();
    const [isPage, setPage] = useState(1);
    const [initialData, setInitialData] = useState(11);
    const [lastData, setLastData] = useState();
    const [isEnabled, setIsEnabled] = useState(isEnabled);
  
    let last10Data = []
    let humValue;
    let Index={};
  
    const getHumidityData = async () => {
      await getSensorValue()
      .then ((res) => {
        let tenData = res.filter(function(el,index){
          setLastData(res.length)
          return index >= res.length - initialData; // default 10
        })
        let flatlistData = res.filter(function(el,index){
          setLastData(res.length)
          return index >= res.length - initialData; // default 10
        })
        // console.log("tenData", initialData)
        tenData.map((val) => {
          // console.log("a",val.humidity[0])
          switch (true){
            case (val.humidity < 40):
              Index = {"datetime": val.datetime, "dustDensity": val.dustDensity, "humidity": val.humidity, "temperature": val.temperature, "timestamps": val.timestamps, "index":"Too Dry", "color": "#FF1E00"}
            break;
            case (val.humidity > 40 && val.humidity < 60):
              Index = {"datetime": val.datetime, "dustDensity": val.dustDensity, "humidity": val.humidity, "temperature": val.temperature, "timestamps": val.timestamps, "index":"Ideal", "color": "#1F8A70"}
             break;
            case (val.humidity > 65):
              Index = {"datetime": val.datetime, "dustDensity": val.dustDensity, "humidity": val.humidity, "temperature": val.temperature, "timestamps": val.timestamps, "index":"Too Humid", "color": "#A10035"}
              // alarmBadData = true;
              humValue = val.humidity;
              break;
            default:
          }
          if(val.humidity == null){
            Index = {"datetime": val.datetime, "dustDensity": val.dustDensity, "humidity": val.humidity, "temperature": val.temperature, "timestamps": val.timestamps, "index":"Null", "color": "#000000"}
          //   alarmFalseData = true;
            humValue = val.humidity
          }
          last10Data.push(Index)
          last10Data.reverse()
          // dustValue = val.humidity
        })
          setHumidityData(last10Data)
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
          if(data[0].humidity > 0){
            setIsEnabled(false)
          }else {
            setIsEnabled(true)
          }
        })
        .catch((err)=> console.log(err))
    }

    const Item = ({item}) => (
        <Card title={"Humidity Data"} style={[styles.shadow,{marginBottom: '2%'}]}>
        <View style={[styles.cardList]}>
          <View style={{paddingEnd: 20}}>
          <IconLabel icon={icons.humidityIcon} label={""} />
          </View>
          <View>
          <Text style={[styles.title,{color:'#060047'}]}>Humidity Value : </Text>
          <Text style={styles.smallText}>On : {item.datetime}</Text>
          </View>
          <View>
          <Text style={[styles.score,{color:'#060047'}]}>{item.humidity}</Text>
        </View>
        <View style={{ width: '25%'}}>
          <Text style={[styles.index, {backgroundColor:item.color}]}>{item.index}</Text>
        </View>
        </View>
       
        </Card>
      );

      useEffect(() => {
        getHumidityData();
        currentData();
      }, [initialData])

    // Render

    return (
        <View style={styles.container}>
          
          <FrontPage data={dataHumidity} loading={isLoading} area={'WEATHER DATA'} />
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
   
});

export default WeatherScreen;
