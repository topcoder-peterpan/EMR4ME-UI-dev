import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';

class APIRequest {
  createRequest = async (method, endpoint, headers, data) => {
    let token = '';
    try {
      let loginData = await AsyncStorage.getItem('@LoginData');

      if (loginData != null) {
        token = JSON.parse(loginData).token;
      }
    } catch (error) {
      return false;
    }

    return RNFetchBlob.config({
      trusty: false,
    }).fetch(
      method,
      `https://lisa.fiithealth.com/${endpoint}`,
      {
        authorization: `${token}`,
        ...headers,
      },
      data,
    );
  };
}

export const API = new APIRequest();
