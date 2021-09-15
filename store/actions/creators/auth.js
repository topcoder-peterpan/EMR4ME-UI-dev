import AsyncStorage from "@react-native-community/async-storage";
import {
  CLEAR_SIGN_UP,
  RESTORE_TOKEN,
  SIGN_IN,
  SIGN_OUT,
  UPDATEUSERDATA,
} from "./actions";
import {
  signUserIn,
  signUserUp,
  checkSignUp,
  resetPass,
  codeConfirm,
  changePass,
  generateAccessCode,
  generateAccessToken,
  requestRelogin,
  requestRefreshUserToken,
} from "./../../../apis/auth";
import store from "./../../configStore";

import { i18n } from "../../../util";
import { showAlert, startLoading, endLoading } from "./UI";
import { getMyProvider } from "./user";
import { clearAllRecords } from "../creators/records";
import { logAction } from "../../../apis/log";
import { createTables } from "../../../screens/app/reminders/DataAccessLayer";
import { scheduleReminders } from "../../../screens/app/reminders/RemindersSchedule";

const signIn = (payload, signup) => ({
  type: SIGN_IN,
  payload,
  signup,
});

export const clearSignUp = () => ({
  type: CLEAR_SIGN_UP,
});
const signOut = () => ({
  type: SIGN_OUT,
  token: false,
});

const updateUser = (payload) => ({
  type: UPDATEUSERDATA,
  payload,
});

const storeLoginData = async (resp, dispatch) => {
  try {
    await AsyncStorage.setItem("@LoginData", JSON.stringify(resp));
    if (resp && dispatch) dispatch(updateUser(resp.payload));
  } catch (error) {
    console.log(error);
  }
};

export const storePassword = async (pass) => {
  if (pass) await AsyncStorage.setItem("@pass", pass);
};

export const getPassword = async () => await AsyncStorage.getItem("@pass");

export const getLoginData = async (dispatch) => {
  try {
    const user = await AsyncStorage.getItem("@LoginData");
    store.dispatch(endLoading());
    if (user && dispatch) {
      dispatch(signIn(JSON.parse(user)));
    }
    if (!user) dispatch(signOut());
    return user;
  } catch (error) {
    console.log(error);
  }
  return null;
};
setTimeout(() => {
  getLoginData(store.dispatch);
}, 0);
store.dispatch(startLoading());
const clearLoginData = async (dispatch) => {
  try {
    await AsyncStorage.removeItem("@LoginData");
    await AsyncStorage.removeItem("@pass");
    if (dispatch) {
      dispatch(updateUser({}));
      dispatch(clearAllRecords());
    }
  } catch (error) {}
};

export const login = (data, signup) => (dispatch) =>
  signUserIn(data).then((resp) => {
    if (resp && resp.statusMessage && resp.statusMessage == "Success") {
      if (data.password) storePassword(data.password);
      storeLoginData(resp, dispatch).then(() => dispatch(signIn(resp, signup)));
      if (resp.payload && resp.payload.accessToken && !signup) {
        dispatch(getMyProvider(resp.payload, signup));
        createTables();
        scheduleReminders();
      }
    } else if (resp && resp.errorMsg) {
      dispatch(
        showAlert({
          msg: "Invalid username or password",
          type: "error",
          present: false,
          iconName: "warning",
        })
      );
    }
  });

const addAuthorizationData = (configurations, refreshData) => {
  if (refreshData && refreshData.payload && configurations) {
    let token = refreshData.payload.accessToken;
    if (configurations.data)
      configurations.data.sessionKey = refreshData.payload.sessionKey;
    else configurations.data = { sessionKey: refreshData.payload.sessionKey };
    if (token && configurations.headers && configurations.headers.Authorization)
      configurations.headers.Authorization = `Bearer ${token}`;
  }
};

export const relogin = async (configurations) => {
  const user = store.getState().user.userData || undefined;
  const password = await getPassword();
  if (user && user.userModel && password && user.userModel.username) {
    const reqData = { username: user.userModel.username, password };
    const resp = await requestRelogin(reqData);
    console.log("API RESPONSE RELOGIN", resp);
    if (resp && resp.statusMessage && resp.statusMessage == "Success") {
      storeLoginData(resp, store.dispatch).then(() =>
        store.dispatch(signIn(resp))
      );
      addAuthorizationData(configurations, resp);
      return Promise.resolve(configurations);
    }
  }
  return Promise.resolve(null);
};

export const refreshToken = async (configurations) => {
  const user = store.getState().user.userData || undefined;
  if (user) {
    const reqData = {
      token: user.accessToken,
      sessionKey: user.sessionKey,
      refreshToken: user.refreshToken,
    };
    const refreshData = await requestRefreshUserToken(reqData);
    console.log("API RESPONSE REFRESH", refreshData);
    if (
      refreshData.statusCode === 0 &&
      refreshData.statusMessage === "Success" &&
      refreshData.payload
    ) {
      storeLoginData(refreshData, store.dispatch).then(() =>
        store.dispatch(signIn(refreshData))
      );
      addAuthorizationData(configurations, refreshData);
      return Promise.resolve(configurations);
    }
  }
  return Promise.resolve(null);
};

export const signUp = (data) => (dispatch) =>
  signUserUp(data).then((resp) => {
    if (resp && resp.statusCode == "0") {
      dispatch(login(data, true));
    } else if (resp && resp.message) {
      dispatch(
        showAlert({
          msg: resp.message,
          type: "error",
          present: false,
          iconName: "warning",
        })
      );
    }
  });

export const checkSignUpUser = (data) => checkSignUp(data);

export const changePassword = (data, props) =>
  changePass(data).then(async (resp) => {
    if (resp.statusCode && resp.statusCode === -21) {
      store.dispatch(
        showAlert({
          msg: i18n.t("user.passwordReset"),
          type: "success",
          present: false,
          iconName: "check",
        })
      );
      props.navigation.navigate("Login");
    } else if (resp.error) {
      store.dispatch(
        showAlert({
          msg: resp.error.errorMsg,
          type: "error",
          present: false,
          iconName: "warning",
        })
      );
    }
  });

export const confirmCode = (data, props) =>
  codeConfirm(data).then(async (resp) => {
    if (resp.statusCode && resp.statusCode === -21) {
      props.navigation.navigate("ResetPW", data);
    } else if (resp.error) {
      store.dispatch(
        showAlert({
          msg: resp.error.errorMsg,
          type: "error",
          present: false,
          iconName: "warning",
        })
      );
    }
  });

export const resetPassword = (data, props) =>
  resetPass(data).then(async (resp) => {
    if (resp.statusCode && resp.statusCode === -21) {
      props.navigation.navigate("CodeConfirm", data);
    } else if (resp.error) {
      store.dispatch(
        showAlert({
          msg: resp.error.errorMsg,
          type: "error",
          present: false,
          iconName: "warning",
        })
      );
    }
  });

export const actionLogger = (isWebView, screenName, url) => {
  const user = store.getState().user.userData || undefined;
  const userID = user ? user.userModel.user_id : null;
  logAction({
    user_id: userID,
    api: "",
    inputs: "",
    is_api: false,
    is_web_view: isWebView,
    screen_name: screenName,
    url: url,
  });
};

export const logout = () => (dispatch) => {
  clearLoginData(dispatch).then((o) => {
    dispatch(signOut());
  });
};
