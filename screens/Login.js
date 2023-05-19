import React, { useState, useContext } from "react";
import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView, Alert, ToastAndroid } from "react-native"

import LoadingOverlay from "../component/LoadingOverlay";
import Authentication from "../component/authentication/Authentication";
import {AuthLogin} from "../util/ExecuteAuthentication"


import {AuthProcess} from "../util/AuthenticationProcess";
import { useNavigation } from "@react-navigation/native";


function Login (){

    const navigation = useNavigation();

    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const authCtx = useContext(AuthProcess);

    async function signInHandler({ userId, userPw}) {
      // console.log(userId, userPw, "token")
        setIsAuthenticating(true);
        try{
          const token = await AuthLogin(userId, userPw);
          // console.log("tokens ", token)
          authCtx.authenticate(token)
          if(token !== null){
            if(token.message === 'success!'){
              // Alert.alert(
              //   'Login Successfully',
              //   token.message,
              //   [
              //     { text: "OK", onPress: () => navigation.navigate("MainScreen")
              //    }
              //   ]
              // );
             
              setIsAuthenticating(false);
            }else {
              // Alert.alert(
              //   'Authentication Failed',
              //   token.message,
              //   [
              //     { text: "OK", onPress: () => navigation.navigate("Login")
              //    }
              //   ]
              // );
              setIsAuthenticating(false);
            }
          }else {
            // Alert.alert(
            //   'Authentication Failed',
            //   token.message,
            //   [
            //     { text: "OK", onPress: () => navigation.navigate("Login")
            //    }
            //   ]
            // );
            setIsAuthenticating(false);
          }
          // console.log('isi tempData '+tempData.user_id)
          // navigation.navigate("Home")
          
        }
        catch(error){
          ToastAndroid.show("Error to connect API", ToastAndroid.SHORT)
          // console.log("print error", error)
        setIsAuthenticating(false);
        }
        
      }
    
      if (isAuthenticating) {
        return (
          <LoadingOverlay message="Sign in..." />
          // <MainScreen /> 
        );
        // return <AuthContentLogin/>;
      }else {
        return <Authentication onAuthenticate={signInHandler} />
        
      }
    
      
    }

export default Login;

const styles = StyleSheet.create({
  
})



