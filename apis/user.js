import { HTTP } from "./../util";
import EndPoints from './endPoints';

//health  && records patient data
export const getResultsTypesReq = (data) => HTTP.post(`${EndPoints.PATIENT}/get-result-categories`, data).then(response => (response && response.data) ? response.data : response);
export const getUserDocumentsNames = (data) => HTTP.post(`${EndPoints.PATIENT}/get-document-names`, data).then(response => (response && response.data) ? response.data : response);
export const getUserDocumentsIds = (data) => HTTP.post(`${EndPoints.PATIENT}/get-document-ids`, data).then(response => (response && response.data) ? response.data : response);
//filter by visit
export const getUserDocuments = (data) => HTTP.post(`${EndPoints.PATIENT}/get-visit-documents`, data).then(response => (response && response.data) ? response.data : response);

export const getUserDocData = (id) => HTTP.post(`${EndPoints.PATIENT}/get-document/${id}`).then(response => (response && response.data) ? response.data : response);
export const getAllergies = (data) => HTTP.post(`${EndPoints.PATIENT}/get-allergies`, data).then(response => (response && response.data) ? response.data : response);
export const getMedications = (data) => HTTP.post(`${EndPoints.PATIENT}/get-medications`, data).then(response => (response && response.data) ? response.data : response);
export const getImmunizations = (data) => HTTP.post(`${EndPoints.PATIENT}/get-immunizations`, data).then(response => (response && response.data) ? response.data : response);
export const getConditions = (data) => HTTP.post(`${EndPoints.PATIENT}/get-problems`, data).then(response => (response && response.data) ? response.data : response);
export const getResultsCategories = (data) => HTTP.post(`${EndPoints.PATIENT}/get-result-categories`, data).then(response => (response && response.data) ? response.data : response);
export const getResults = (data) => HTTP.post(`${EndPoints.PATIENT}/get-results`, data).then(response => (response && response.data) ? response.data : response);
export const getNotes = (data) => HTTP.post(`${EndPoints.PATIENT}/get-notes`, data).then(response => (response && response.data) ? response.data : response);
export const getVisits = (data) => HTTP.post(`${EndPoints.PATIENT}/get-visits`, data).then(response => (response && response.data) ? response.data : response);
export const getVitalsData = data => HTTP.post(`${EndPoints.PATIENT}/get-vitals`, data).then(response => (response && response.data) ? response.data : response);

//providers
export const linkProviders = data => HTTP.post(`${EndPoints.PROVIDERS}/link`, (data)).then(response => (response && response.data) ? response.data : response);
export const checkLinkProviders = data => HTTP.post(`${EndPoints.PROVIDERS}/syncOneUp`, (data)).then(response => (response && response.data) ? response.data : response);
export const checkLinkEpic = data => HTTP.post(`${EndPoints.PROVIDERS}/syncEpic`, (data)).then(response => (response && response.data) ? response.data : response);
export const checkLinkGeneric = data => HTTP.post(`${EndPoints.PROVIDERS}/syncGeneric`, (data)).then(response => (response && response.data) ? response.data : response);
export const checkProvidersSync = data => HTTP.post(`${EndPoints.PROVIDERS}/getProvidersSyncStatus`, (data)).then(response => (response && response.data) ? response.data : response);
export const getSearchProviders = (data) => HTTP.post(`${EndPoints.PROVIDERS}/search`, data).then(response => (response && response.data) ? response.data : response);
export const getUserProviders = (data) => HTTP.post(`${EndPoints.PROVIDERS}/getAll`, data).then(response => (response && response.data) ? response.data : response);

//user
export const getMyProviders = (data) => HTTP.post(`${EndPoints.USER}/get-linked-providers`, (data), { headers: { Authorization: `Bearer ${data.accessToken}` } }).then(response => (response && response.data) ? response.data : response);

//old apis
export const getUserDocs = (data) => HTTP.post(`${EndPoints.USERS}/get-document-names`, (data)).then(response => (response && response.data) ? response.data : response);
export const setUserReminder = (id, state, date) => HTTP.post(`${EndPoints.USERS}/set-reminder`, { id, state, date }).then(response => (response && response.data) ? response.data : response);
// export const getUserReminders = () => HTTP.get(`${EndPoints.USERS}/get-reminders`).then(response => (response && response.data) ? response.data : response);

//reminders
export const addUserReminder = (data) => HTTP.post(`${EndPoints.USER}/add-reminder`, data).then(response => (response && response.data) ? response.data : response);
export const getUserReminder = (data) => HTTP.post(`${EndPoints.USER}/get-reminder`, data).then(response => (response && response.data) ? response.data : response);
export const getUserReminders = (data) => HTTP.post(`${EndPoints.USER}/get-user-reminders`, data).then(response => (response && response.data) ? response.data : response);
export const updateUserReminder = (data) => HTTP.post(`${EndPoints.USER}/update-reminder`, data).then(response => (response && response.data) ? response.data : response);
export const deleteUserReminder = (data) => HTTP.post(`${EndPoints.USER}/delete-reminder`, data).then(response => (response && response.data) ? response.data : response);
