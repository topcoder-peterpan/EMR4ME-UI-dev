import { HTTP } from "../util";
import EndPoints from './endPoints';

export const insertLink = (data) => HTTP.post(`${EndPoints.SHARE}/add-link`, data).then(response => (response && response.data) ? response.data : response);
export const modifyLink = (data) => HTTP.post(`${EndPoints.SHARE}/update-link`, data).then(response => (response && response.data) ? response.data : response);
export const getLink = (data) => HTTP.post(`${EndPoints.SHARE}/get-link`, data).then(response => (response && response.data) ? response.data : response);
export const getLinks = (data) => HTTP.post(`${EndPoints.SHARE}/get-all-links`, data).then(response => (response && response.data) ? response.data : response);
export const revokeLink = (data) => HTTP.post(`${EndPoints.SHARE}/revoke-link`, data).then(response => (response && response.data) ? response.data : response);
export const updateExpiryDate = (data) => HTTP.post(`${EndPoints.SHARE}/update-expiry`, data).then(response => (response && response.data) ? response.data : response);

//Organizations
export const getUserOrganizations = (data) => HTTP.post(`${EndPoints.SHARE}/get-user-organizations`, data).then(response => (response && response.data) ? response.data : response);
export const addUserOrganizations = (data) => HTTP.post(`${EndPoints.SHARE}/add-user-organiztions`, data).then(response => (response && response.data) ? response.data : response);
export const deleteUserOrganization = (data) => HTTP.post(`${EndPoints.SHARE}/delete-user-organizations`, data).then(response => (response && response.data) ? response.data : response);
