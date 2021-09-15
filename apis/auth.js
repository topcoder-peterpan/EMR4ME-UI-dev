import { HTTP } from "./../util";
import EndPoints from './endPoints';
import Axios from 'axios';

export const signUserIn = data => HTTP.post(`${EndPoints.USER}/login`, (data)).then(response => (response && response.data) ? response.data : response);
export const signUserUp = data => HTTP.post(`${EndPoints.USER}/signup`, (data)).then(response => (response && response.data) ? response.data : response);
export const checkSignUp = data => HTTP.post(`${EndPoints.USER}/check-signup`, (data)).then(response => (response && response.data) ? response.data : response);
export const requestRefreshUserToken = data => Axios.post(`${EndPoints.USER}/refresh`, JSON.stringify(data), {
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${data.token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
    }
}).then(response => (response && response.data) ? response.data : response);
export const requestRelogin = data => Axios.post(`${EndPoints.USER}/login`, (data)).then(response => (response && response.data) ? response.data : response);

//old apis
export const resetPass = data => HTTP.post(`${EndPoints.USER}/reset-password`, (data)).then(response => (response && response.data) ? response.data : response);
export const codeConfirm = data => HTTP.post(`${EndPoints.USER}/reset-password-confirmation-1`, (data)).then(response => (response && response.data) ? response.data : response);
export const changePass = data => HTTP.post(`${EndPoints.USER}/reset-password-confirmation-2`, (data)).then(response => (response && response.data) ? response.data : response);