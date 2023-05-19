import { createContext, useEffect, useState } from 'react';

import { Alert, ToastAndroid } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { menuBackend } from './MenuBackend';
// import { Alert, AsyncStorageStatic } from 'react-native';


export const AuthProcess = createContext({
  token: '',
  tempData: '',
  isAuthenticated: false,
  authenticate: (isStatus) => {},
  register: (tempData) => {},
  logout: () => {},
  
});
 

function AuthenticationProcess({ children }) {
  const [authToken, setAuthToken] = useState({});
  const [isStatus, setStatus] = useState();
  const [listMenu, setMenu] = useState();
   // const [authTempData, setAuthTempData] = useState();

  // const [status, setStatus] = useState();

  useEffect(() => {
    // async function fetchToken(){
    // const storedToken = await AsyncStorage.getItem('token');  
    // if(storedToken){
    //   setAuthToken(storedToken); // auto login
    //   // console.log('tokennya ',storedToken)
    // }
    // getMenuBackend()
    // }

    // fetchToken();
  }, [])

  const getMenuBackend = async () => {
    await menuBackend()
    .then((val) => {
      // console.log(val)
      setMenu(val)
      // return val
    })
    .catch((err) => console.log(err))
  }
    

  function authenticate(token) {
    // console.log('auth ', token)
    if(token.authID == '1'){// 1 for Login - 2 fro Register 
        if(token.message === 'success!'){
            setAuthToken(token);
            ToastAndroid.show(token.message, ToastAndroid.SHORT)
            setStatus(true)
        }else {
            // setAuthToken(false);
            ToastAndroid.show(token.message, ToastAndroid.SHORT)
            setStatus(false)
        }
        // console.log('authentication', isAuthenticated);
     
        
    }
    // // const navigation = useNavigation();
    // if(token.message == 'success!'){
    //   Alert.alert(
    //     'Your data has been saved, successfully!!',
    //     'Please Continue to login!!'
    //   );        
    // //   return <AuthProcess.Provider value={value}></AuthProcess.Provider>;
    // }else {
    //   setAuthToken(token);
    //   AsyncStorage.setItem('token', JSON.stringify(token));
  
    // }
      // setStatus({message: token.message, status: token.status})
  }

  
  // const navigation = useNavigation();
  function logout() {
    setAuthToken(null);
    setStatus(false);
    AsyncStorage.removeItem('token');
    // navigation.navigate("MainScreen",{

    // })
    // console.log('testing ',authTempData);
  }

  const value = {
    token: authToken,
    // tempData: authTempData,
    status: isStatus,
    isAuthenticated: isStatus,
    // menu: listMenu, 
    authenticate: authenticate,
    logout: logout,
  };

  
  // console.log('value ', value)

  return <AuthProcess.Provider value={value}>{children}</AuthProcess.Provider>;
}

export default AuthenticationProcess;
