import { HTTP } from "../util";
import EndPoints from './endPoints';

export const logAction = (data) => HTTP.post(`${EndPoints.LOG}/log-action`, data).then(response => (response && response.data) ? response.data : response);
