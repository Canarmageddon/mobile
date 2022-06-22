import checkStatus from "./checkStatus";
import AsyncStorage from '@react-native-async-storage/async-storage';

const refreshToken = async (userUpdate) => {
  const refresh_token = await AsyncStorage.getItem('@refresh_token');

  fetch("http://vm-26.iutrs.unistra.fr/api/token/refresh" , {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({refresh_token: refresh_token})  
  })
  .then(checkStatus)
  .then(response => response.json())
  .then((data) => {
    userUpdate[1](data.token);
    AsyncStorage.setItem('@refresh_token', data.refresh_token);
  })
  .catch((error) => {
    console.log(error);
  });
}
  
export default refreshToken;