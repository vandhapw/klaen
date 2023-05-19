import axios from "axios";

// const BACKEND_URL = 'https://data.mongodb-api.com/app/data-uwehr/endpoint/data/v1'

// BACKEND_URL = "https://klaen-11d13-default-rtdb.firebaseio.com";
// BACKEND_URL = "https://vpw.my.id/microcontroller/sendAQI.php"


export async function storeAqd(expenseData) {

    // var axios = require('axios');
    // var data = JSON.stringify({
    //     "collection": "sensorsData",
    //     "database": "sensors",
    //     "dataSource": "Cluster0",
    //     // "projection": {
    //     //     "_id": "63a96bc8c4795fd31c672aba",                               
    //     // },
    //     "documents" :{
    //         "name": "John Sample",
    //     "age": 42
    //     }
    // });

    // var config = {
    //     method: 'post',
    //     url: 'https://data.mongodb-api.com/app/data-uwehr/endpoint/data/v1/action/insertOne',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Access-Control-Request-Headers': '*',
    //       'api-key': 'F0f2CeoszPfsR5kuGwwnJirqvCdqmLTF2loshnx3QaiWGGt3rFt61uGOGda2N67C',
    //     },
    //     data: data
    // };
                
    // axios(config)
    //     .then(function (response) {
    //         console.log(JSON.stringify(response.data));
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });

    
    let res = await axios.post(BACKEND_URL, expenseData);

    let data = res.data;
    // if (data == null) {
    //     console.log('loading')
    // } else {
    //     // return data
    //     console.log(data, "data check")
    // }
   
}

export async function storeRealtime(){
    const API = "https://api.ambeedata.com/latest/by-postal-code?postalCode=12110&countryCode=ID"
       let response = await fetch(API, {
        method: 'GET',
        headers: {
            "Content-Type" : "application/json",
            "x-api-key": "dccbdca1072e7695dedda8c6663c232bd1587b2235b850ac4e0d72a3b635de8d"
        },
    });

    // setInterval()
    let date = new Date().getDate(); //Current Date
    let month = new Date().getMonth() + 1; //Current Month
    let year = new Date().getFullYear(); //Current Year
    let hours = new Date().getHours(); //Current Hours
    let min = new Date().getMinutes(); //Current Minutes
    let sec = new Date().getSeconds(); //Current Seconds
    let dateTime = date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec;
    let json = await response.json();
    for (value of json.stations){
        let co = value.CO;
        let aqi = value.AQI;
        let no2 = value.NO2;
        let ozone = value.OZONE;
        let pm10 = value.PM10;
        let pm25 = value.PM25;
        let so2 = value.SO2;
        let city = value.city;
        let countryCode = value.countryCode;
        let lat = value.lat;
        let long = value.lng;
        let timestamps = dateTime;
        expenseData = {co,aqi,no2,ozone,pm10,pm25,so2,city,countryCode,lat,long,timestamps}
        // console.log(expenseData)
        storeAqd(expenseData)
    }
    // console.log(json.stations)    
}

export async function fetchRealTime() {

    try {
      const response = await fetch(
        'https://vpw.my.id/microcontroller/sendAQI.json',
      );
      const json = await response.json();
        return json;
    } catch (error) {
      console.error(error);
    }
}

// export async function fetchSensorAPI() {

//     const API = "https://vpw.my.id/microcontroller/postData.json"
//        let response = await fetch(API, {
//         method: 'GET',
//         headers: {
//             "Content-Type" : "application/json",
//             // "x-api-key": "dccbdca1072e7695dedda8c6663c232bd1587b2235b850ac4e0d72a3b635de8d"
//         },
//     });
//     let json = await response.json();
//     // console.log(json)
//     return json
// }

export const getSensorValue = async () => {
    // console.log('a')
    try {
      const response = await fetch(
        'https://vpw.my.id/microcontroller/sensorData.json',
      );
      const json = await response.json();
      // console.log(json)
        return json;
    } catch (error) {
      console.error(error);
    }
  };

  export const getSwitchValue = async () => {
    // console.log('a')
    try {
      const response = await fetch(
        // 'https://vpw.my.id/microcontroller/sendDataMobile.json',
        'http://139.150.73.211:8000/scheduler/api/dust/switch/get/'
      );
      const json = await response.json();
      // console.log("tes",json)
        return json;
    } catch (error) {
      console.error(error);
    }
  };

  // export async function fetchMainData(){
  //   await axios.get('https://vpw.my.id/microcontroller/sendDataMobile.json')
  //   .then((res) => {
  //     json = res.data
  //     // token = response.data;
  //     // console.log("token", token)
  //     // console.log(response.status)
  //     console.log("response :", json)
  //   })
  //   .catch(err => console.log("error", err));
  //   return json;
  // }

  export const postSwitchDevice = async (humidity, temperature,dust,lighting) => {
    console.log(humidity, temperature, dust, lighting)
    const options = {
      method: "POST",
      headers: {'Content-Type': 'application/json','Accept' : 'application/json, text/plain, */*',},
      body:JSON.stringify({"humidity":humidity, "temperature":temperature,"dust":dust, "lighting":lighting})
    };
    const response = await fetch('http://139.150.73.211:8000/scheduler/dust/switch/modify/adu/', options)
    const data = await response.json()
    // console.log(data)
    return data
    // console.log("tes",data)
    // try {
    //   const response = await axios.post(
    //     // 'https://vpw.my.id/microcontroller/sendDataMobile.php', {
    //       'http://139.150.73.211:8000/scheduler/dust/switch/modify/adu/',{
    //         // method: 'POST',
    //         headers: {
    //             'Accept' : 'application/json',
    //             'Content-Type' : 'application/json',
    //             // "X-CSRFToken": 'sessionid=uvs2ttoklubvx58nn08vyztbekf7ncvk',
    //             //  "Content-Length" : 1*DIGIT
    //         },
    //         body: JSON.stringify({
    //             "humidity": humidity,
    //             "temperature": temperature,
    //             "dust": dust,
    //             "lighting": lighting
    //         })
    //     }        
    //   );
    //   console.log(response)
    //   const json = await response.json();
    // return json;
    // } catch (error) {
    //   console.error(error);
    // }
  };

  // article
  
  export const API_KEY = 'ab695d0072a34175bb963db7e5bddaef';
  export const endpoint= 'https://newsapi.org/v2/top-headlines';
  export const country= 'in';
  export async function articles(category = 'general'){
    let articles = await fetch(`${endpoint}?country=${country}&apiKey=${API_KEY}`
    );

    let result = await articles.json();
    articles = null;

    return result.articles;
}








