import AsyncStorage from '@react-native-async-storage/async-storage';
import {API} from './AxiosInit';
import Toast from 'react-native-toast-message';
import {urls} from './urls';

API.interceptors.request.use(
  config => {
    config.timeout = 5000;
    config.headers['Content-Type'] = 'application/json';
    config.headers.accept = 'application/json';
    return config;
  },
  error => Promise.reject(error),
);

export const RegisterUserAPI = async data => {
  try {
    const res = await API.post(urls.register, data);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};
