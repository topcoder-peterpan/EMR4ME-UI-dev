import I18n from 'react-native-i18n';
import { I18nManager } from "react-native";
import { enableRTL, disableRTL } from '../store/actions/creators'
//import Moment from "moment/min/moment-with-locales";
import * as store from './../store/configStore';

import es from "../i18n/es";
import en from "../i18n/en";
import AsyncStorage from '@react-native-community/async-storage';
I18n.fallbacks = true;
I18n.translations = {
  es,
  en,
};
I18n.defaultLocale = "en";

const isEs = () => I18n.currentLocale().indexOf('es') === 0;
const isEn = () => I18n.currentLocale().indexOf('en') === 0;
const setLanguage = language => async (dispatch) => {
  if (language in I18n.translations) {
    await AsyncStorage.setItem("lang", language);
    I18n.locale = language;
    return true;
  }

  return false;
}
const language = {
  t: I18n.t.bind(I18n),
  setLanguage,
  isEn,
  isEs
  //Moment: Moment,
};
AsyncStorage.getItem("lang").then((lang) => {
  if (!lang) {
    return store.dispatch(setLanguage("en"));
  }
  return store.dispatch(setLanguage(lang));
}).catch(err => console.error("error lang", err));

export default language;
