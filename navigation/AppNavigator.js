import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView,DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';


import WelcomeScreen from '../screens/Welcome';
import ChartScreen from '../screens/Charts';
import IndexTemperature from '../screens/temperature/IndexTemperature';
import IndexHumidity from '../screens/humidity/IndexHumidity';
import IndexDust from '../screens/dust/IndexDust';
import HumidityData from '../screens/sidebar/HumidityData';
// import DustData from '../screens/sidebar/DustData';
import Article from '../screens/Article';
import LoginScreen from '../screens/Login';
import SignupScreen from '../screens/Signup';
// import HumidityChart from '../screens/sidebar/HumidityChart';
import Control from '../screens/sidebar/Control';
import MainScreen from '../screens/MainScreen';
import DetailNews from '../component/articles/DetailNews';
import AllNews from '../component/articles/AllNews';
import BackEndMenu from '../screens/backend-menu/BackEndMenu';
import IndexAir from '../screens/dashboard/airquality/IndexAir';
// import ContextState like session
import AuthenticationProcess, {AuthProcess} from '../util/AuthenticationProcess';



const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DefineNavigator() {
  return (
      <Stack.Navigator>
          <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                  tabBarIcon: () => (
                      <Entypo
                          name="login"
                          size={30}
                          color
                      />
                  ),
                  // headerTitle: () => (
                  //     ""
                  // ),
                  // headerShown: false
              }}
          />
           <Stack.Screen
              name="Login"
              component={Logout}
              options={{
                 
                  // headerTitle: () => (
                  //     ""
                  // ),
                  // headerShown: false
              }}
          />
      
      </Stack.Navigator>
  )
}

function articleNavigator(){
  return(
  <Stack.Navigator>
        <Stack.Screen
              name="DetailNews"
              component={DetailNews}
              options={{
                 
                  // headerTitle: () => (
                  //     ""
                  // ),
                  headerShown: false
              }}
          />
           <Stack.Screen
              name="AllNews"
              component={AllNews}
              options={{
                 
                  // headerTitle: () => (
                  //     ""
                  // ),
                  headerShown: false
              }}
          />
  </Stack.Navigator>
  )
}

  //testing
function AuthStack(){
  return(
    <Drawer.Navigator>
    <Drawer.Screen name="Login" component={LoginScreen}
    options={{
      // headerTitle: () => (
      //     ""
      // ),
      headerShown: false
  }}
    />
</Drawer.Navigator>
  )
}

function AppDrawerContent(props){
  const authCtx = useContext(AuthProcess)

  return (
     <DrawerContentScrollView {...props} contentContainerStyle={{flex:1}}>
       {/*all of the drawer items*/}
       <DrawerItemList {...props}  style={{borderWidth:1}}/>
       <View style={{flex:1,marginTop:200, }}>
         {/* here's where you put your logout drawer item*/}
         <DrawerItem 
           label="Log out"
           onPress={()=>{
           
  // console.log('tes')
  Alert.alert(
    "Logout",
   "Are you sure? You want to logout?",
    [
     {
       text: "Cancel",
      onPress: () => {
        },
     },
      {
       text: "Confirm",
       onPress: () => {
        authCtx.logout()
        },
     },
   ],
   { cancelable: false }
  );
            //  AsyncStorage.clear();
            //  props.navigation.replace("loginScreen");
           }}
           style={{flex:1,justifyContent:'flex-end'}}
         />
       </View>
     </DrawerContentScrollView>
   );
 }

function AuthenticatedStack(){

  const authCtx = React.useContext(AuthProcess)
  // console.log("Token ID ", tokenId)
  // username = authCtx.menu[0].menu_id
  // console.log(authCtx.menu[0].menu_id)

  return (
  <Drawer.Navigator drawerContent={props=><AppDrawerContent {...props} />} >
      <Drawer.Screen name="Home" component={MainScreen}
    options={{
      headerTitle: () => (
          ""
      ),
      headerStyle: {
      backgroundColor: '#ffffff'
    },
      headerShown: true
  }}
    />
    {/* <Drawer.Screen name="Air Quality" component={WelcomeScreen}
    options={{
      headerTitle: () => (
          ""
      ),
      headerStyle: {
      backgroundColor: '#990000'
    },
      headerShown: true
  }}
    /> */}
  
    {/* <Drawer.Screen name="Charts" component={ChartScreen}
    options={{
      headerTitle: () => (
        ""
    ),
    headerStyle: {
    backgroundColor: '#990000'
  },
      headerShown: true
  }} */}
    {/* /> */}
    <Drawer.Screen name="Humidity" component={IndexHumidity}
    options={{
      headerTitle: () => (
        ""
    ),
    headerStyle: {
    backgroundColor: '#ffffff'
  },
      headerShown: true
  }}
    />
    <Drawer.Screen name="Temperature" component={IndexTemperature}
    options={{
      headerTitle: () => (
        ""
    ),
    headerStyle: {
    backgroundColor: '#ffffff'
  },
      headerShown: true
  }}
    />
        <Drawer.Screen name="Dust Density" component={IndexDust}
    options={{
      headerTitle: () => (
        ""
    ),
    headerStyle: {
    backgroundColor: '#ffffff'
  },
      headerShown: true
  }}
    />
    <Drawer.Screen name="Articles" component={Article}
    options={{
      headerTitle: () => (
        ""
    ),
    headerStyle: {
    backgroundColor: '#990000'
  },
      headerShown: true
  }}
    />
    {/* <Drawer.Screen name="Charts" component={HumidityChart}
    options={{
      headerTitle: () => (
        ""
    ),
    headerStyle: {
    backgroundColor: '#ffffff'
  },
      headerShown: true
  }}
    /> */}
    <Drawer.Screen name="Control" component={Control}
    options={{
      headerTitle: () => (
        ""
    ),
    headerStyle: {
    backgroundColor: '#ffffff'
  },
      headerShown: true
  }}
    />
    <Drawer.Screen name="backend-menu" component={BackEndMenu}
    options={{
      headerTitle: () => (
        ""
    ),
    headerStyle: {
    backgroundColor: '#ffffff'
  },
      headerShown: true
  }}
    />
    {/* <Drawer.Screen name="Logout" component={LogoutFunction} /> */}
</Drawer.Navigator>
  )
}

function AlatNavigasi(){
  const authCtx = React.useContext(AuthProcess)
  // console.log("authenticated ", authCtx.token)
    return (
      <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  )
}

function AppNavigator(){

  return (
             <AuthenticationProcess>
                <AlatNavigasi />
             </AuthenticationProcess>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default AppNavigator;
