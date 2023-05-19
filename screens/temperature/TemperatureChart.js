/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {getSensorValue, getSwitchValue} from '../../util/getPost';
import {COLORS, icons, SIZES, FONTS} from '../../constants';

function TemperatureChart() {
  const [textSelected, setTextSelected] = useState();
  const [isLoading, setLoading] = useState(true);

  const [sensorData, setSensorData] = useState([]);

  let last10Date = [];
  let last10Sensor = [];
  let last10Temp = [];

  const [chartData, setChartData] = useState({
    labels: ['x1', 'x2', 'x3', 'x4', 'x5'],
    datasets: [
      {
        data: [12, 45, 67, 89, 12],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    // legend: ["Moisture Values"]
  });

  const getDataApi = async () => {
    await getSensorValue()
      .then((data) => {
        let tenData = data.filter(function (el, index) {
          return index >= data.length - 5; // default 10
        });
        setSensorData(tenData)
        tenData.map(value => {
          let x = value.datetime.split('-');
          let y = x[2].split(':');
          let y1 = y[0].split(' ');
          // let z = x[1] + '/' + y[0] + ':' + y[1] + ' ';
          let z = y1[1] + ':' +y[1];

          last10Date.push(z);
          last10Temp.push(parseFloat(value.temperature));
        });

        // temperature data
        setTextSelected('Temperature');
        setChartData({
          ...chartData,
          labels: last10Date.reverse(),
          datasets: [
            {
              ...chartData.datasets[0],
              data: last10Temp.reverse(),
            },
          ],
        });
        setLoading(false);
        

        //   console.log("Data", last10Date)
      })
      .catch(err => {
        console.log(err);
      });
      last10Date = []
      last10Temp = []
  };

  // console.log(sensorData)
       

  // logic to get new data
  const getData = async () => {
    await getSensorValue()
      //await fetch('https://api.waqi.info/feed/here/?token=71fd05aec3047c1be05e19c77f1a5fa911be8c3a')
      .then(data => {
        let last_data = data[Object.keys(data).length - 1];
        let x = last_data.datetime.split('-');
        let y = x[2].split(':');
        let y1 = y[0].split(' ');
        // let z = x[1] + '/' + y[0] + ':' + y[1] + ' ';
        let z = y1[1] + ':' +y[1];
        last10Date.push(z);
        last10Temp.push(parseFloat(last_data.temperature)); // setTimeout(last10Date.push(last_data.datetime), 1000)
        // console.log("temp ",last10Date.length)
        if (last10Date.length >= 15) {
          last10Date.splice(0, 5);
          last10Temp.splice(0, 5);
          console.log("overloaded!!!", last10Date.length);
          setChartData({
            ...chartData,
            labels: last10Date.reverse(),
            datasets: [
              {
                ...chartData.datasets[0],
                data: last10Temp.reverse(),
              },
            ],
          });
        }
      });
  };

  useEffect(() => {
       getDataApi();
      // getData();
    const ref = setInterval(() => {
      // getDataApi();
      getData();
    }, 60*1000);
    return () => 
      clearInterval(ref);
    
  }, []);

  return (
    <ScrollView style={{backgroundColor: '#ffffff'}}>
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
            // marginBottom: 10,
            marginEnd: 40,
            marginTop: 10,
          },
          styles.shadow,
        ]}>
        <Text
          style={{
            ...FONTS.h2,
            textAlign: 'center',
            paddingTop: 10,
            color: '#000000',
            fontWeight: 'bold',
            textDecorationLine: 'underline',
          }}>
          Temperature Chart Data
        </Text>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              marginHorizontal: SIZES.radius,
              justifyContent: 'space-around',
            }}></View>
          <View
            style={{
              marginHorizontal: SIZES.radius,
              marginStart: 20,
              justifyContent: 'space-around',
            }}>
            <Text
              style={{
                ...FONTS.h1,
                color: '#CD0404',
                fontWeight: 'bold',
              }}></Text>
          </View>
        </View>
      </View>

      <View>
        {isLoading ? 
          <Text style={styles.whiteColor}>Loading data...</Text>
         : 
          <View
            style={{
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 14, fontWeight: 'bold', color:'#7B8FA1'}}>
              Range Date Start: {sensorData[0].datetime}
            </Text>
            <Text style={{fontSize: 14, fontWeight: 'bold', color:'#7B8FA1'}}>
              Range Date End: {sensorData[4].datetime}
            </Text>
            <Text style={styles.whiteColor}>
              {textSelected} (updated per minute)
            </Text>
          </View>
        }
      </View>

      {isLoading ? 
        <ActivityIndicator
          size="large"
          color="#2A3990"
          style={styles.loadingView}
        />
       : 
        <View>
          <LineChart
            data={chartData}
            // width={Dimensions.get("window").width} // from react-native
            width={380}
            height={420}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: '#13005A',
              backgroundGradientFrom: '#1C82AD',
              backgroundGradientTo: '#00337C',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#00204A',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
              paddingStart: 7,
              paddingEnd: 2,
            }}
          />
        </View>
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  whiteColor: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    paddingBottom: 10,
  },

  loadingView: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default TemperatureChart;
