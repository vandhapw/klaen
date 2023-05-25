import React, { useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions
} from 'react-native';

import { icons, images, COLORS, SIZES, FONTS } from '../../constants';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { LineChart } from 'react-native-chart-kit';
import { Card } from 'react-native-paper';

import { OutdoorAqi_All } from '../../util/getPost';

import LoadingOverlay from '../LoadingOverlay';
import { Legend } from 'chart.js';

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

const RequirementBar = ({ icon, barPercentage }) => {
    return (
        <View style={{ height: 60, alignItems: 'center' }}>
            <View
                style={{
                    width: 50,
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#EEEEEE'
                }}
            >
                <Image
                    source={icon}
                    resizeMode="cover"
                    style={{
                        tintColor: '#EEEEEE',
                        width: 30,
                        height: 30
                    }}
                />
            </View>

            {/* Bar */}
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: 3,
                    marginTop: SIZES.base,
                    backgroundColor: '#EEEEEE'
                }}
            ></View>

            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: barPercentage,
                    height: 3,
                    marginTop: SIZES.base,
                    backgroundColor: COLORS.primary
                }}
            ></View>
        </View>
    )
}

const RequirementDetail = ({ icon, label, detail }) => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    source={icon}
                    resizeMode="cover"
                    style={{
                        tintColor: COLORS.secondary,
                        width: 30,
                        height: 30
                    }}
                />

                <Text style={{ marginLeft: SIZES.base, color: COLORS.secondary, ...FONTS.h4 }}>{label}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={{ marginLeft: SIZES.base, color: COLORS.gray, ...FONTS.h3 }}>{detail}</Text>
            </View>
        </View>
    )
}

const FrontPage2 = ({ navigation }) => {

    const [catergoryIndex, setCategoryIndex] = React.useState(0);
    const [chartTabIndex, setChartTab] = React.useState(0);
    const [latest_outdoor_aqi, setLatestOutdoor_Aqi] = React.useState();
    const [week_outdoor_aqi, setWeekOutdoor_Aqi] = React.useState();
    const [month_outdoor_aqi, setMonthOutdoor_Aqi] = React.useState();
    const [historyData, setHistoryData] = React.useState();
    const [isLoading,setLoading] = React.useState(true);


    async function fetch_all_aqi (){
        await OutdoorAqi_All()
        .then((data) => {

            let filteredData = [];
            const currentDate = new Date();

            let last_five_data = []
            let five_Data = data.filter(function(el,index){
                return index >= data.length - 6; // default 10
              })
              // console.log("tenData", initialData)
              // last10Data.push(tenData)
              five_Data.map((val) => {
                historyValue = {"SO2": val.so2, "NO2": val.no2, "O3": val.o3, "CO": val.co, "PM25": val.pm25, "pm10":val.pm10}
           
                // console.log(val.dustDensity)
                last_five_data.push(historyValue)
                last_five_data.reverse()  
              })  
              setHistoryData(last_five_data)    

            // latest Data
            let latestData = data[data.length -1];
            let arrayLatestData = [
                {"label":"SO2","value":latestData.so2, "color":'#FF6347'},
                {"label":"NO2","value":latestData.no2, "color":'#00CED1'},
                {"label":"O3","value":latestData.o3, "color":'#FFA500'},
                {"label":"CO","value":latestData.co, "color":'#800080'},
                {"label":"PM25","value":latestData.pm25, "color":'#8A2BE2'},
                {"label":"PM10","value":latestData.pm10, "color":'#32CD32'},
            ]
            console.log(arrayLatestData)
            setLatestOutdoor_Aqi(arrayLatestData)

            // data per week
            let oneWeekData = data.slice(-7)
            let weekData={}
            let weekArray = []
            oneWeekData.map((item, index) => {
                weekData = [
                    { color: "rgba(255, 99, 71, 1)", index: `day-${index + 1}`, data: { label: "SO2", value: item.so2 } },
                    { color:"rgba(0, 206, 209, 1)", index:`day-${index +1}`, data:{label:"NO2","value":item.no2,}},
                    {color : "rgba(255, 165, 0, 1)",index:`day-${index +1}`,data:{label:"O3","value":item.o3}},
                        {color : "rgba(128, 0, 128, 1)", index:`day-${index +1}`, data:{"label":"CO","value":item.co}, },
                        {color: "rgba(138, 43, 226, 1)", index:`day-${index +1}`,data:{"label":"PM25","value":item.pm25}, },
                        {color: "rgba(50, 205, 50, 1)", index:`day-${index +1}`, data:{"label":"PM10","value":item.pm10},},

                  ];
                  
                weekArray.push(weekData)
            }
            )
            // console.log('week array', weekArray)
            const groupedData = weekArray.reduce((result, dayData) => {
                const index = dayData[0].index;
                if (result[index]) {
                    // result[index] = [];
                  result[index].push(...dayData);
                } else {
                  result[index] = [...dayData];
                // result[index].push(...dayData);
                }
                return result;
              }, {});
            // const weekLabel = Object.keys(groupedData)
            // console.log('group',groupedData)
            setWeekOutdoor_Aqi(groupedData)
            
            // data per month
            let oneMonthData = data.slice(-30)
            let monthData={}
            let monthArray = []
            oneMonthData.map((item, index) => {
                monthData = [
                    { color: "rgba(255, 99, 71, 1)", index: `day-${index + 1}`, data: { label: "SO2", value: item.so2 } },
                    { color:"rgba(0, 206, 209, 1)", index:`day-${index +1}`, data:{label:"NO2","value":item.no2,}},
                    {color : "rgba(255, 165, 0, 1)",index:`day-${index +1}`,data:{label:"O3","value":item.o3}},
                        {color : "rgba(128, 0, 128, 1)", index:`day-${index +1}`, data:{"label":"CO","value":item.co}, },
                        {color: "rgba(138, 43, 226, 1)", index:`day-${index +1}`,data:{"label":"PM25","value":item.pm25}, },
                        {color: "rgba(50, 205, 50, 1)", index:`day-${index +1}`, data:{"label":"PM10","value":item.pm10},},

                  ];
                  
                monthArray.push(monthData)
            }
            )
            // console.log('month', monthArray)
            const groupedDataMonth = monthArray.reduce((result, monthData) => {
                const index = monthData[0].index;
                if (result[index]) {
                    // result[index] = [];
                  result[index].push(...monthData);
                } else {
                  result[index] = [...monthData];
                // result[index].push(...dayData);
                }
                return result;
              }, {});
            // const weekLabel = Object.keys(groupedData)
            // console.log('group',groupedDataMonth)
            setMonthOutdoor_Aqi(groupedDataMonth)

            // data per year
            // let oneYearData = data.slice(-360)
            // setYearOutdoor_Aqi(oneYearData)

            setLoading(false)
        })
        .catch(err => console.log(err))
    }

    React.useEffect(() => {     

        fetch_all_aqi()
    },[])


    const tabCategories = ['DATA', 'CHART', 'HISTORY']

    const chartTab = ['DAY','WEEK','MONTH']

    // useEffect(() => {
    //     console.log('index selected ', chartTabIndex)
    // },[chartTabIndex])

    const renderContent = () => {
        switch (catergoryIndex){
            case 0:
                return <DataContent />;
            case 1:
                return <ChartContent />;
            case 2:
                return <HistoryContent />;
            default:
                return null;
        }
      }

      const renderChart = () => {
        switch (chartTabIndex){
            case 0:
                return <DailyChart />;
            case 1:
                return <WeeklyChart />;
            case 2:
                return <MonthlyChart />;
            default:
                return null;
        }
      }

    const CategoryList = () => {
        return (
          <View style={styles.categoryContainer}>
            {tabCategories.map((item, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => setCategoryIndex(index)}>
                <Text
                  style={[
                    styles.categoryText,
                    catergoryIndex === index && styles.categoryTextSelected,
                  ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
            {/* {renderContent()} */}
          </View>
        );
      };

      const ChartTabList = () => {
        return (
          <View style={styles.categoryContainer}>
            {chartTab.map((item, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => setChartTab(index)}>
                <Text
                  style={[
                    styles.categoryText,
                    chartTabIndex === index && styles.categoryTextSelected,
                  ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
            {/* {renderContent()} */}
          </View>
        );
      };

    // Render

    function renderHeader() {
        return (
            <View
                style={{
                    position: 'absolute',
                    top: 50,
                    left: SIZES.padding,
                    right: SIZES.padding
                }}
            >
                
                <View style={{ flexDirection: 'row', marginTop: "25%", marginStart:'12%' }}>
                <View style={{ flex: 2}}>
                <View
                    style={[{
                        position: 'absolute',
                        bottom: "2%",
                        left: "35%",
                        right: "35%",
                        marginTop: '10%',
                        marginBottom:'2%',
                        borderRadius: 100/2,
                        width:100,
                        height:100,
                        padding: 12,
                        backgroundColor: '#FFFFFF',
                        borderColor: '#609966',
                        borderWidth: 2
                    }, styles.shadow]}
                >
                    <View style={{ flexDirection: 'row', justifyContent:'center', alignContent:'center' }}>
                        <View style={{}}>
                            <Text style={{ fontSize: 10, alignItems:'center',fontWeight:'bold',paddingBottom:5 }}>OUTDOOR AIR</Text>
                            <Text style={{ alignItems:'center',textAlign:'center', fontSize:20,fontWeight:'bold',paddingTop:10 }}>12</Text>
                            <Text style={{ alignItems:'center',textAlign:'center', ...FONTS.body3,paddingTop:10 }}>Good</Text>
                        </View>
                    </View>
                        <View>
                    </View>
                </View>

                {/* Header Buttons */}
            </View>
                    <View style={{ flex: 1 }}></View>
            </View>
            <View style={{flex:1,flexDirection:'row', marginStart:'20%', paddingStart:'7%'}}>
                <View>
                <Image
                        source={icons.compass}
                        resizeMode="contain"
                        style={{
                            // marginLeft: SIZES.padding,
                            width: 15,
                            height: 15,
                            color:'#562B08'
                        }}
                    />
                   
                </View>
                <View style={{marginStart:'2%'}}>
                <Text style={{fontWeight:'bold', color:'#562B08', fontSize:12}}>Busan, South Korea</Text>
                </View>
                </View>
            </View>
        )
    }

    function renderRequirementsBar() {
        return (
            <View style={{ flexDirection: 'row', marginTop: SIZES.padding, paddingHorizontal: SIZES.padding, justifyContent: 'space-between' }}>
                <RequirementBar
                    icon={icons.sun}
                    barPercentage="50%"
                />
                <RequirementBar
                    icon={icons.drop}
                    barPercentage="25%"
                />
                <RequirementBar
                    icon={icons.temperature}
                    barPercentage="80%"
                />
                <RequirementBar
                    icon={icons.garden}
                    barPercentage="30%"
                />
                <RequirementBar
                    icon={icons.seed}
                    barPercentage="50%"
                />
                <RequirementBar
                    icon={icons.seed}
                    barPercentage="50%"
                />
            </View>
        )
    }

    function renderRequirements() {
        return (
            <View style={{ flex: 2.5, marginTop: SIZES.padding, paddingHorizontal: SIZES.padding, justifyContent: 'space-around' }}>
                
                <RequirementDetail
                    icon={icons.sun}
                    label="SO2 (Sulfur-Dioxide)"
                    detail={latest_outdoor_aqi[0].value}
                />
                <RequirementDetail
                    icon={icons.drop}
                    label="NO2 (Nitrogen Dioxide)"
                    detail={latest_outdoor_aqi[1].value}
                />
                <RequirementDetail
                    icon={icons.temperature}
                    label="O3 (Ozone)"
                    detail={latest_outdoor_aqi[2].value}
                />
                <RequirementDetail
                    icon={icons.garden}
                    label="CO (Carbon Monoxide)"
                    detail={latest_outdoor_aqi[3].value}
                />
                <RequirementDetail
                    icon={icons.seed}
                    label="PM.25 (Particulate-Matter)"
                    detail={latest_outdoor_aqi[4].value}
                />
                <RequirementDetail
                    icon={icons.seed}
                    label="PM.10 (Particulate-Matter)"
                    detail={latest_outdoor_aqi[5].value}
                />
            </View>
        )
    }

    const DataContent = () => {
        return (
            <>
                 {renderRequirementsBar()}

                {renderRequirements()}
            </>
        )
    }

    
    DailyChart = () => {
        return (
            <View>
                 <LineChart
                   data={{
                    labels: latest_outdoor_aqi.map(item => item.label),
                    datasets: [
                        {
                        data: latest_outdoor_aqi.map(item => item.value),
                        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red color
                        },
                    ]
                  }}
                    width={Dimensions.get("window").width} // from react-native
                    height={310}
                    yAxisLabel=""
                    yAxisSuffix=""
                    yAxisInterval={1} // optional, defaults to 1
                    withDots={true}
                    withShadow={false}
                    withVerticalLines={false}
                    withHorizontalLines={false}
                    withInnerLines={false}
                    withOuterLines={false} // Set this prop to false to avoid the TypeError
                    withLegend={true}
                    // withScrollableDot={true} // Enable scrollable dots for legends
                    // segments={4} // Adjust the number of segments as needed
                    // verticalLabelRotation={110}
                    chartConfig={{
                    backgroundColor: "#850000",
                    backgroundGradientFrom: "#850000",
                    backgroundGradientTo: "#594545",
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
                    marginTop: '15%',
                    marginStart:5,
                    // marginLeft:5
                    }}
                />
                <View>
                <ChartTabList />
                </View>
                
            </View>
        )
    }

    WeeklyChart = () => {
        const labels = Object.keys(week_outdoor_aqi);
      
        const data = [];

        for (const dayKey in week_outdoor_aqi) {
        const dayData = week_outdoor_aqi[dayKey];
        dayData.forEach(item => {
            const { label, value } = item.data;
            const existingData = data.find(obj => obj.label === label);
            if (existingData) {
            existingData.value.push(value);
            } else {
            data.push({ label, value: [value] });
            }
        });
        }

        // console.log(data);

        const chartData = data.map(item => ({
            data: item.value,
            color: (opacity = 1) => item.label === "SO2" ? `rgba(255, 99, 71, ${opacity})` : item.label === "NO2" ? "rgba(86, 43, 8, 1)" : item.label === "O3" ? "rgba(255, 30, 30, 1)":item.label === "CO" ? "rgba(139, 188, 204, 1)":item.label === "PM25" ? "rgba(92, 46, 126, 1)":item.label === "PM10" ? "rgba(0, 0, 0, 1)":`rgba(50, 205, 50, ${opacity})`
        }));
        // console.log(chartData)
        return (
            <View>
                 <LineChart
                   data={{
                    labels: labels,
                    datasets: chartData,
                    legend:["SO2", "NO2", "O3", "CO", "PM25", "PM10"]
                  }}
                    width={Dimensions.get("window").width} // from react-native
                    height={310}
                    yAxisLabel=""
                    yAxisSuffix=""
                    yAxisInterval={1} // optional, defaults to 1
                    withDots={true}
                    withShadow={false}
                    withVerticalLines={false}
                    withHorizontalLines={false}
                    withInnerLines={false}
                    withOuterLines={false} // Set this prop to false to avoid the TypeError
                    withLegend={true}
                    // withScrollableDot={true} // Enable scrollable dots for legends
                    // segments={4} // Adjust the number of segments as needed
                    // verticalLabelRotation={110}
                    chartConfig={{
                    backgroundColor: "#850000",
                    backgroundGradientFrom: "#850000",
                    backgroundGradientTo: "#594545",
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
                    marginTop: '15%',
                    marginStart:5,
                    // marginLeft:5
                    }}
                />
                <View>
                <ChartTabList />
                </View>
                
            </View>
        )
    }

    const MonthlyChart = () => {
        const labels = Object.keys(month_outdoor_aqi);
      
        const data = [];

        for (const monthKey in month_outdoor_aqi) {
        const monthData = month_outdoor_aqi[monthKey];
        monthData.forEach(item => {
            const { label, value } = item.data;
            const existingData = data.find(obj => obj.label === label);
            if (existingData) {
            existingData.value.push(value);
            } else {
            data.push({ label, value: [value] });
            }
        });
        }

        // console.log(data);

        const chartData = data.map(item => ({
            data: item.value,
            color: (opacity = 1) => item.label === "SO2" ? `rgba(255, 99, 71, ${opacity})` : item.label === "NO2" ? "rgba(86, 43, 8, 1)" : item.label === "O3" ? "rgba(255, 30, 30, 1)":item.label === "CO" ? "rgba(139, 188, 204, 1)":item.label === "PM25" ? "rgba(92, 46, 126, 1)":item.label === "PM10" ? "rgba(0, 0, 0, 1)":`rgba(50, 205, 50, ${opacity})`
        }));
        // console.log(chartData)
        return (
            <View>
                 <LineChart
                   data={{
                    labels: labels,
                    datasets: chartData,
                    legend:["SO2", "NO2", "O3", "CO", "PM25", "PM10"]
                  }}
                    width={Dimensions.get("window").width} // from react-native
                    height={310}
                    yAxisLabel=""
                    yAxisSuffix=""
                    yAxisInterval={1} // optional, defaults to 1
                    withDots={true}
                    withShadow={false}
                    withVerticalLines={false}
                    withHorizontalLines={false}
                    withInnerLines={false}
                    withOuterLines={false} // Set this prop to false to avoid the TypeError
                    withLegend={true}
                    // withScrollableDot={true} // Enable scrollable dots for legends
                    // segments={4} // Adjust the number of segments as needed
                    // verticalLabelRotation={110}
                    chartConfig={{
                    backgroundColor: "#850000",
                    backgroundGradientFrom: "#850000",
                    backgroundGradientTo: "#594545",
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
                    marginTop: '15%',
                    marginStart:5,
                    // marginLeft:5
                    }}
                />
                <View>
                <ChartTabList />
                </View>
                
            </View>
        )
    }
    
    const ChartContent = () => {
        return (
            <>
            {renderChart()}
            </>
        )
        
    }

    const HistoryContent = () => {

        // console.log('hsit', historyData)
        // const historyData = [
        //     { id: '1', title: 'History Item 1' },
        //     { id: '2', title: 'History Item 2' },
        //     { id: '3', title: 'History Item 3' },
        //     // Add more history items as needed
        //   ];

          const Item = ({item}) => (
            <View style={{ flex: 1.5, padding:5, marginStart: 10, marginEnd:10}}>
            <Card title={"Humidity Data"} style={[styles.shadow,{}]}>
            <View style={[styles.cardList]}>
              <View style={{paddingEnd: 20}}>
              <IconLabel icon={icons.sun} label={""} />
              </View>
              <View style={{flexDirection:'column'}}>
                <View style={{flexDirection:'row'}}>
                    <View>
                    <Text style={[styles.title,{color:'#060047'}]}>SO2: </Text>
                    </View>
                    <View>
                    <Text style={[styles.score,{color:'#060047'}]}>{item.SO2}</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row'}}>
                    <View>
                        <Text style={[styles.title,{color:'#060047'}]}>NO2: </Text>
                        </View>
                        <View>
                        <Text style={[styles.score,{color:'#060047'}]}>{item.NO2}</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row'}}>
                    <View>
                        <Text style={[styles.title,{color:'#060047'}]}>PM25: </Text>
                        </View>
                        <View>
                        <Text style={[styles.score,{color:'#060047'}]}>{item.PM25}</Text>
                    </View>
                </View>              
              </View>

              <View style={{flexDirection:'column'}}>
                <View style={{flexDirection:'row'}}>
                <View>
                    <Text style={[styles.title,{color:'#060047'}]}>O3: </Text>
                    </View>
                    <View>
                    <Text style={[styles.score,{color:'#060047'}]}>{item.O3}</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row'}}>
                    <View>
                        <Text style={[styles.title,{color:'#060047'}]}>CO: </Text>
                        </View>
                        <View>
                        <Text style={[styles.score,{color:'#060047'}]}>{item.CO}</Text>
                        </View>
                </View>
                <View style={{flexDirection:'row'}}>
                    <View>
                        <Text style={[styles.title,{color:'#060047'}]}>PM10: </Text>
                        </View>
                        <View>
                        <Text style={[styles.score,{color:'#060047'}]}>{item.pm10}</Text>
                    </View>
                </View>                
              </View>
            
            {/* <View style={{ width: '25%'}}>
              <Text style={[styles.index, {backgroundColor:'#060047'}]}>{item.title}</Text>
            </View> */}
            </View>
           
            </Card>
            </View>
          );

        //   const renderHistory = ({item}) => {
        //     return (
        //         <View>
        //             <Text>{item.title}</Text>
        //         </View>
        //     );
        //   };

          return (
            <View style={{marginTop: '20%'}}>
                <FlatList 
                    data={historyData}
                    renderItem={Item}
                    keyExtractor={(item) => item.id}
                />
            </View>
          )
    }

    if(!isLoading){
    return (
        <View style={styles.container}>
            {/* Banner Photo */}
            <View style={{ height: "35%" }}>
                <Image
                    source={require('../../assets/imagess/ski_villa_banner.jpg')}
                    resizeMode="cover"
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                />
            </View>

            {/* Requirements */}
            <View
                style={{
                    flex: 1,
                    marginTop: -40,
                    backgroundColor: '#482121',
                    borderTopLeftRadius: 40,
                    borderTopRightRadius: 40,
                    paddingVertical: SIZES.padding
                }}
            >
                <CategoryList />
                {/* <Text style={{ paddingHorizontal: SIZES.padding, color: COLORS.secondary, ...FONTS.h1 }}>Data</Text>
                <Text style={{ paddingHorizontal: SIZES.padding, color: COLORS.secondary, ...FONTS.h1 }}>Chart</Text>
                <Text style={{ paddingHorizontal: SIZES.padding, color: COLORS.secondary, ...FONTS.h1 }}>History</Text> */}

            {renderContent()}
               

            </View>

            {renderHeader()}
        </View>
    )
    }
    else {
        return (
            <LoadingOverlay message={'Reading Data....'}/>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    categoryContainer: {
        flexDirection: 'row',
        // marginTop: 30,
        // marginBottom: 20,
        justifyContent: 'space-evenly',
      },
      categoryText: {fontSize: 16, color: 'grey', fontWeight: 'bold'},
      categoryTextSelected: {
        color: COLORS.green,
        paddingBottom: 5,
        borderBottomWidth: 2,
        borderColor: COLORS.green,
      },

      cardList :{
        padding: 20,
        flex: 1,
        flexDirection:'row',
        maxHeight:85,
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
})

export default FrontPage2;