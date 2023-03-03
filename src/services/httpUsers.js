import jwt_decode from "jwt-decode";
import http from "./httpService";
import {getApiUrl} from "./utilsFunctions.js";

const api = getApiUrl();

export function getNewsLetter(signal) {
  return http.get(`${api}/newsletters`, {signal});
}
export function postNewsLetter(email, signal) {
  return http.post(`${api}/newsletters`, {email}, {signal});
}
export function patchNewsLetter(email, data, token, signal) {
  return http.patch(`${api}/newsletters/email/${email}`, data, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function deleteNewsLetter(email, token, signal) {
  return http.delete(`${api}/newsletters/email/${email}`, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function login(email, password) {
  return http.post(`${api}/login`, {email, password});
}
export function register(email, type, password) {
  return http.post(`${api}/users`, {email, type, password});
}
export function forgotPassword(url, email) {
  return http.post(`${api}/users/forgotPassword`, {url, email});
}
export function resetPassword(id, resetToken, password) {
  return http.patch(`${api}/users/forgotPassword/${id}/${resetToken}`, {
    password,
  });
}
export function patchUser(id, data, token, signal) {
  return http.patch(`${api}/users/${id}`, data, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function deleteUser(id, token, signal) {
  return http.delete(`${api}/users/${id}`, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function decodeJWT(jwt) {
  try {
    return jwt_decode(jwt); //user
  } catch (error) {}
  return null;
}
export function getUser(id, token, signal) {
  return http.get(`${api}/users/${id}`, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function getUsers(type, token, signal) {
  return http.get(`${api}/users?type=${type}`, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function checkUserDelete(id, model, token, signal) {
  //id=email for model 'newsletters'
  return http.get(`${api}/${model}/user_checkDel/${id}`, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function checkParticipantDelete(userId, partId, token, signal) {
  //id=email for model 'newsletters'
  return http.get(`${api}/bookings/participant_checkDel/${userId}/${partId}`, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function getCompany(id, signal) {
  return http.get(`${api}/companies/user/${id}`, {
    signal,
  });
}
export function postCompany(data, token, signal) {
  return http.post(`${api}/companies`, data, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function patchCompany(id, data, token, signal) {
  return http.patch(`${api}/companies/user/${id}`, data, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function deleteCompany(userId, token, signal) {
  return http.delete(`${api}/companies/user/${userId}`, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function checkCodeParrainage(code, token, signal) {
  return http.get(`${api}/companies/code_parrainage/${code}`, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function getParrainageCounters(code, token, signal) {
  return http.get(`${api}/companies/code_parrainage_given/${code}`, {
    headers: {"x-auth-token": token},
    signal,
  });
}
