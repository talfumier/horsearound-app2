import http from "./httpService";
import {getApiUrl} from "./utilsFunctions.js";

const api = getApiUrl();

export function getInvoicesByUser(userId, token, signal) {
  return http.get(`${api}/invoices/user/${userId}`, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function patchInvoice(id, data, token, signal) {
  return http.patch(`${api}/invoices/${id}`, data, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function deleteInvoice(id, token, signal) {
  return http.delete(`${api}/invoices/${id}`, {
    headers: {"x-auth-token": token},
    signal,
  });
}
