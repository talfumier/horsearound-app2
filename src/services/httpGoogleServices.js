import http from "./httpService";
import {getApiUrl} from "./utilsFunctions.js";

const api = getApiUrl();

export function getMarkers(data, signal) {
  try {
    return http.post(`${api}/googleServices/geocode`, data, {signal});
  } catch (error) {
    return [];
  }
}
export async function translate(data) {
  const res = await http.post(`${api}/googleServices/translate`, data);
  return res.status === 200 ? res.data : data; //return non translated message in case of status not OK
}
