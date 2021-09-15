import {
  GET_PROVIDERS,
  GET_PROVIDERS_STARTED,
  CLEAR_PROVIDERS,
  UPDATE_PROVIDERS,
  GET_MY_PROVIDERS,
  SET_REMINDER_NAVIGATED,
} from "./actions";
import {
  getAllergies,
  getMedications,
  getImmunizations,
  getConditions,
  getResultsTypesReq,
  getUserDocumentsNames,
  getUserDocumentsIds,
  getUserDocuments,
  addUserReminder,
  updateUserReminder,
  deleteUserReminder,
  getUserReminder,
  getUserReminders,
  getResults,
  getVisits,
  getUserProviders,
  // checkProvidersSync,
  getUserDocData,
  getVitalsData,
  linkProviders,
  getResultsCategories,
  getSearchProviders,
  checkLinkProviders,
  getMyProviders,
  getNotes,
  checkLinkEpic,
  checkLinkGeneric,
} from "./../../../apis/user";

import store, { dispatch } from "./../../configStore";
import { showAlert, startLoading } from "./UI";
import SplashScreen from "react-native-splash-screen";

export const getResultsTypes = (data) => getResultsTypesReq(data);
export const getAllAllergies = (data) => getAllergies(data);
export const getAllMedications = (data) => getMedications(data);
export const getAllImmunizations = (data) => getImmunizations(data);
export const getAllConditions = (data) => getConditions(data);
export const getResultCategories = (data) => getResultsCategories(data);
export const getAllResults = (data) => getResults(data);
export const getAllNotes = (data) => getNotes(data);
export const getAllVisits = (data) => getVisits(data);
export const getAllVitalsData = (vitals) => {
  store.dispatch(startLoading());
  return getVitalsData(vitals);
};
export const getDocumentsNames = (data) => getUserDocumentsNames(data);
export const getDocumentsIds = (data) => getUserDocumentsIds(data);
export const getDocuments = (data) => getUserDocuments(data);
export const getDocData = (id) => getUserDocData(id);

export const getReminder = (data) => getUserReminder(data);
export const getReminders = (data) => getUserReminders(data);
export const addReminder = (data) => addUserReminder(data);
export const updateReminder = (data) => updateUserReminder(data);
export const deleteReminder = (data) => deleteUserReminder(data);

// export const setReminder = (id, state, date) =>
//   setUserReminder(id, state, date);

  export const getProviders = (data) => (dispatch) =>
  getUserProviders(data).then((resp) =>
    dispatch(getProvidersSuccess(resp ? resp.payload : {}))
  );
export const searchProviders = (data) => (dispatch) => {
  return getSearchProviders(data).then((resp) =>
    dispatch(getProvidersSuccess(resp ? resp.payload : {}))
  );
};
export const getMyProvider = (data, signup) => (dispatch) => {
  if (!data.accessToken) data.accessToken = store.getState().user.userToken;
  return getMyProviders(data).then((resp) =>
    dispatch(getMyProvidersSuccess(resp ? resp.payload : {}), signup)
  );
};
export const clearProviders = () => (dispatch) =>
  dispatch(clearUserProviders());
export const linkProvider = (data) => linkProviders(data);
export const checkLinkProvider = (data) => checkLinkProviders(data);
export const linkEpic = (data) => checkLinkEpic(data);
export const linkGeneric = (data) => checkLinkGeneric(data);
// export const checkProviderSync = (data) => checkProvidersSync(data);
export const providerLinked = (id) => (dispatch) =>
  dispatch(updateLinkedProfile(id));

export const getProvidersStarted = () => ({
  type: GET_PROVIDERS_STARTED,
});
const clearUserProviders = () => ({
  type: CLEAR_PROVIDERS,
});
const getProvidersSuccess = (payload) => ({
  type: GET_PROVIDERS,
  payload,
});

export const setReminderNavigated = (payload) => (dispatch({
  type: SET_REMINDER_NAVIGATED,
  payload,
}));

const getMyProvidersSuccess = (payload, signup) => {
  const myProviders =
    payload && payload.payload && Array.isArray(payload.payload)
      ? payload.payload
      : null;
  if (myProviders && myProviders.length === 0 && !signup) {
    SplashScreen.hide();
    if (!store.getState().user.isSignout)
      store.dispatch(
        showAlert({
          msg: `Please tap the providers tab to start linking your health data`,
          type: "info",
          present: false,
          iconName: "warning",
        })
      );
  }

  return {
    type: GET_MY_PROVIDERS,
    payload: myProviders,
  };
};
const updateLinkedProfile = (id) => ({
  type: UPDATE_PROVIDERS,
  id,
});

export const filterSystDiastData = (systData, diastData) => {
  let syst = [];
  let diast = [];
  if (
    systData &&
    Array.isArray(systData) &&
    systData.length > 0 &&
    diastData &&
    Array.isArray(diastData) &&
    diastData.length > 0
  ) {
    let exclItems = [];
    syst = systData;
    diast = diastData;
    syst.forEach((item, i) => {
      if (parseInt(item.value) && parseInt(diast[i].value)) {
        if (
          +item.value > 250 ||
          +item.value < 40 ||
          +diast[i].value > 250 ||
          +diast[i].value < 40
        ) {
          exclItems.push(i);
        }
      } else exclItems.push(i);
    });
    syst = syst.filter((o, i) => exclItems.findIndex((e) => e === i) === -1);
    diast = diast.filter((o, i) => exclItems.findIndex((e) => e === i) === -1);
  }
  return { syst, diast };
};
