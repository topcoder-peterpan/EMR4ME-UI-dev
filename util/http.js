import qs from 'qs';
import store from './../store/configStore'
import { startLoading, endLoading, logout } from './../store/actions/creators'
import { relogin, refreshToken } from './../store/actions/creators/auth'
import Axios from 'axios';
import { requestTimeOut, requestRetryTimeOut } from '../config';
import { i18n } from '.';
import { hideConfirmDialogue, hideHelpPopup, showAlert } from '../store/actions/creators/UI';

const logUserOut = () => {
  store.dispatch(hideHelpPopup());
  store.dispatch(hideConfirmDialogue());
  store.dispatch(
    showAlert({
      msg: i18n.t('error.sessionExpired'),
      type: "error",
      present: false,
      iconName: "warning",
    })
  )
  store.dispatch(logout());
}

const getData = async (configurations) => {
  store.dispatch(startLoading());
  const res = await Axios(configurations)
    .then((response) => {
      return Promise.resolve(response);
    })
    .catch(async (err) => {
      console.log("API RESPONSE ERROR", err ? err : '');
      if (err && err.code === "ECONNABORTED") {
        store.dispatch(
          showAlert({
            title: '',
            msg: i18n.t("common.serverError"),
            type: "error",
            present: false,
            iconName: "warning",
          })
        );
        return Promise.resolve(err.response ? err.response : err);
      }
      if(err && err.message && err.message ==="Network Error"){
        store.dispatch(
          showAlert({
            title: '',
            msg: i18n.t("error.networkConnection"),
            type: "error",
            present: false,
            iconName: "warning",
          })
        );
        return Promise.resolve(err.message);
      }
      if (err.response && err.response.status === 401) {
        // if (err.response.data.errorCode === -6 || err.response.data.statusCode === -6) {//session expired and we must login again
        //   store.dispatch(startLoading());
        //   const reloginData = await relogin(configurations);
        //   if (reloginData)
        //     return Promise.resolve({ ...reloginData, again: true });;
        // } else
        if (err.response.data.errorCode === -16 || err.response.data.statusCode === -16) {//token expired
          store.dispatch(startLoading());
          const refreshData = await refreshToken(configurations);
          if (refreshData)
            return Promise.resolve({ ...refreshData, again: true });
          else
            logUserOut();
        }
        else
          logUserOut();
      }
      else if (err.response && err.response.status === 504 && configurations) {
        return Promise.resolve({ ...configurations, retryOcc: configurations.retryOcc === undefined ? 2 : configurations.retryOcc });
      }
      // if (!err || err.response && err.response.status >= 500) {
      //   store.dispatch(showAlert({ msg: i18n.t('common.serverError'), type: 'error', present: false, iconName: 'warning' }))
      // }
      return Promise.resolve(err.response ? err.response : (err || {}));
    });

  if (res && res.again) {
    return getData({ ...res });
  }
  if (res && res.retryOcc && !isNaN(res.retryOcc) && res.retryOcc > 0) {
    return getData({ ...res, retryOcc: res.retryOcc - 1, timeout: requestRetryTimeOut });
  }
  store.dispatch(endLoading());
  console.log("API RESPONSE ", res);
  return Promise.resolve(res);
};

const customFetch = async (url, additionalOptions) => {
  let token = store.getState().user.userToken || "";
  store.dispatch(startLoading());

  const configurations = {
    url,
    //method: 'get',
    //baseURL: API_URL,
    timeout: requestTimeOut,
    ...additionalOptions,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(additionalOptions && additionalOptions.headers),
      'Cache-Control': 'no-cache'
    },
  };
  return getData(configurations);
};

export default {
  get: async (url, query = {}) => {
    const queryString =
      Object.keys(query).length === 0 && query.constructor === Object
        ? ""
        : `?${qs.stringify(query)}`;
    return await customFetch(`${url}${queryString}`);
  },
  post: async (url, body = {}, headers = {}) => {
    let sessionKey = "";
    if (store.getState().user.userData)
      if (store.getState().user.userData.sessionKey)
        sessionKey = store.getState().user.userData.sessionKey;
    if (sessionKey) body.sessionKey = sessionKey;
    return await customFetch(`${url}`, {
      method: "POST",
      data: body,
      ...headers,
    });
  },
};
