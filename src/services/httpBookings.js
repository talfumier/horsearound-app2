import http from "./httpService";
import {getApiUrl} from "./utilsFunctions.js";

const api = getApiUrl();

export function getUserBookings(id_usr, token, signal) {
  const endpoint = `${api}/bookings/user/${id_usr}`;
  return http.get(endpoint, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function getProBookings(proId, token, signal) {
  const endpoint = `${api}/bookings/pro/${proId}`;
  return http.get(endpoint, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function getAnnounceBookings(id_ann, signal) {
  const endpoint = `${api}/bookings/announce/${id_ann}`;
  return http.get(endpoint, {
    signal,
  });
}
export function getLastBookingRef(proId, token, signal) {
  const endpoint = `${api}/bookings/last/${proId}`; //last booking ref for a given pro >>> booking ref starts with last 6 digits of pro user id
  return http.get(endpoint, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function postBooking(data, token, signal) {
  return http.post(`${api}/bookings`, data, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function patchBooking(id, data, token, signal) {
  return http.patch(`${api}/bookings/${id}`, data, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function patchAnnounceDates(id, data, token, signal) {
  const endpoint = `/announces/bookings/${id}`;
  return http.patch(`${api}${endpoint}`, data, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function deleteBooking(id, token, signal) {
  return http.delete(`${api}/bookings/${id}`, {
    headers: {"x-auth-token": token},
    signal,
  });
}
