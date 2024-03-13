/**
 * @format
 */
import Geolocation from '@react-native-community/geolocation';
Geolocation.setRNConfiguration(config); // Replace 'config' with your configuration object

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
    rootTag: document.getElementById('app-root') || document.getElementById('root'),
  });
  