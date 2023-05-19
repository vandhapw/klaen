import axios from 'axios';


// const API_KEY = 'AIzaSyDCYasArcOwcALFhIj2szug5aD2PgUQu1E'
const BASE_URL = "http://139.150.73.211:8000/";

// function 

export async function createUser(user_id, user_name, user_pwd,user_phone, user_email,user_birth) {
  const response = await axios.post(BASE_URL+'/api/signup',null,{
    params: {
        user_id: user_id,
        user_pwd: user_pwd,
        user_name: user_name,
        user_email: user_email,
        user_phone: user_phone,
        user_birth: user_birth
    },
  }
  );
  // console.log(response.data);
  const tempData = {
   message : "Congratulations, your data has been registered. Please Continue to Login!!",
   status : response.data,
   prosess: 'register',
  };
  return tempData;
  // console.log(tempData)
}

export async function AuthLogin(userId, userPw) {
    //  await axios.get(BASE_URL+'/account/login/api',
    // await axios.get(`http://139.150.73.211:8000/account/logins/api?username=${userId}&password=${userPw}`)
    try {
      const response = await axios.get(`http://139.150.73.211:8000/account/login/api?username=${userId}&password=${userPw}`)
      // const json = await response.json();
      let token = {
              message: response.data,
              username: userId,
              authID: '1'
            }
      // console.log(token)
   
    return token;
    } catch (error) {
      console.error(error);
    }
 }
    
  
  
