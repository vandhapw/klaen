
import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity, FlatList, ActivityIndicator,
    Dimensions
} from 'react-native';
import { Card } from 'react-native-paper';

import { images, icons, COLORS, FONTS, SIZES } from '../../constants';

import { getSensorValue, getSwitchValue, sendDataMobile } from '../../util/getPost';
import { LineChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';



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

const CurrentChart = ({ loading, area }) => {
    const navigation = useNavigation()


    const [dataHumidity, setHumidityData] = useState();
    // const [flatlistHumidityData, setHumidityData] = useState();
    // const [isLoading, setLoading] = useState({props.loading});
    const [currentTemperature, setCurrentTemperature] = useState();
    const [currentHumidity, setCurrentHumidity] = useState();
    const [currentDust, setCurrentDust] = useState();
    const [currentLighting, setCurrentLighting] = useState();
    const [isPage, setPage] = useState(1);
    const [initialData, setInitialData] = useState(11);
    const [lastData, setLastData] = useState();
    const [isEnabled, setIsEnabled] = useState(isEnabled);
  
    const chartButton = () => {
        if(area == "OUTDOOR AIR"){
            navigation.navigate('AqiOutdoor')
        }else if(area == "INDOOR AIR"){
            navigation.navigate('AqiIndoor')
        }else {
            navigation.navigate('WeatherScreen')
        }
    }

  
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            data: [20, 45, 28, 80, 99, 43],
            // color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2,
          },
          {
            data: [99, 80, 28, 45, 20, 43],
            // color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      };

    // Render

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={{ flex: 2}}>
                <Image
                    source={images.skiVillaBanner}
                    resizeMode="cover"
                    style={{
                        width: '100%',
                        height: '70%',
                    }}
                />
                <View
                    style={[{
                        position: 'absolute',
                        bottom: "15%",
                        left: "35%",
                        right: "35%",
                        marginBottom:'40%',
                        borderRadius: 100/2,
                        width:120,
                        height:50,
                        padding: SIZES.padding,
                        backgroundColor: COLORS.white,
                        borderColor: 'green',
                        borderWidth: 1
                    }, styles.shadow]}
                >
                    <View style={{ flexDirection: 'row', justifyContent:'center', alignContent:'center' }}>
                        <View style={{}}>
                            <Text style={{ fontSize: 10, alignItems:'center',fontWeight:'bold',paddingBottom:5 }}>{area}</Text>
                            <Text style={{ alignItems:'center',textAlign:'center', fontSize:20,fontWeight:'bold',paddingTop:10 }}>12</Text>
                            <Text style={{ alignItems:'center',textAlign:'center', ...FONTS.body3,paddingTop:10 }}>Good</Text>

                        </View>
                    </View>
                </View>

                {/* Header Buttons */}
            </View>

            {/* Body */}
            <View style={{position:'absolute', flex:1, flexDirection:'row', top:'40%'}}>
                <View style={{paddingStart:'45%'}}>
                    <TouchableOpacity onPress={() => chartButton()}>
                        <Text style={{fontWeight:'bold'}}>Data</Text>
                    </TouchableOpacity>
                </View>
                <View style={{marginStart: 50}}>
                    <TouchableOpacity>
                        <Text>Chart</Text>
                    </TouchableOpacity>
                </View>
               
            </View>
            {loading ? <ActivityIndicator size="large" /> : 
        
            <View style={{ flex: 1.5, marginBottom:30 }}>

            <LineChart
                    data={{
                    labels: ["January", "February", "March", "April", "May", "June"],
                    datasets: [
                        {
                        data: [
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100
                        ],
                        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red color
                        },
                        {
                        data: [
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100
                        ],
                        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Green color
                        },
                        {
                        data: [
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100
                        ],
                        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Blue color
                        },
                    ]
                    }}
                    width={Dimensions.get("window").width} // from react-native
                    height={310}
                    yAxisLabel="$"
                    yAxisSuffix="k"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#fb8c00",
                    backgroundGradientTo: "#ffa726",
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#ffa726"
                    }
                    }}
                    bezier
                    style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    marginStart:2,
                    marginEnd:2
                    }}
                />
  
            </View>
           
            }
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
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
        maxHeight:75,
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
        marginStart:'5%',
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

export default CurrentChart;
