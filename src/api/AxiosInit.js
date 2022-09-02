import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {urls} from './urls';

export const API = axios.create({
  baseURL: urls.baseUrl,
});
