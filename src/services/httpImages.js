import http from "./httpService";
import {getApiUrl} from "./utilsFunctions.js";

const api = getApiUrl();

export function getImagesIndexes(signal) {
  return http.get(`${api}/images/indexes`, {signal});
}

export function getImagesById(id, signal) {
  return http.get(`${api}/images/indexes/${id}`, {signal});
}
export function getAllImages(signal) {
  return http.get(`${api}/images/all`, {signal});
}
export function getAnnounceImages(id, signal) {
  return http.get(`${api}/images/announce/${id}`, {signal});
}
export function patchAnnounceImages(id_ann, data, token, signal) {
  return http.patch(`${api}/images/announce/${id_ann}`, data, {
    headers: {"x-auth-token": token},
    signal,
    maxBodyLength: 25000000,
    maxContentLength: 25000000,
  });
}
export function postAnnounceImages(id_ann, data, token, signal) {
  return http.post(`${api}/images/announce/${id_ann}`, data, {
    headers: {"x-auth-token": token},
    signal,
    maxBodyLength: 25000000,
    maxContentLength: 25000000,
  });
}
