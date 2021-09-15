import { HTTP } from "./../util";
import EndPoints from './endPoints';

export const requestListDoctors = data => HTTP.post(`${EndPoints.USER}/get-user-doctors`, (data)).then(response => (response && response.data) ? response.data : response);
export const requestAddDoctor = data => HTTP.post(`${EndPoints.USER}/add-doctor`, (data)).then(response => (response && response.data) ? response.data : response);
export const requestEditDoctor = data => HTTP.post(`${EndPoints.USER}/update-user-doctor`, (data)).then(response => (response && response.data) ? response.data : response);
export const requestDeleteDoctor = data => HTTP.post(`${EndPoints.USER}/delete-doctor`, (data)).then(response => (response && response.data) ? response.data : response);
