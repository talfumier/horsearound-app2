import http from "./httpService";
import {formatEndpoint, getApiUrl} from "./utilsFunctions.js";

const api = getApiUrl();
export function getAnnouncesBoxes(fields, lang) {
  let endpoint = "/announces/boxes?status=publique&archived=false";
  if (fields) {
    fields.forEach((field, idx) => {
      if (idx === 0) {
        endpoint += "&fields=";
      }
      endpoint += `${field},`;
    });
    endpoint = endpoint.substring(0, endpoint.length - 1);
  }
  if (lang) {
    endpoint += `&language=${lang}`;
  }
  return http.get(`${api}${endpoint}`);
}
export function getAnnounces(
  status,
  archived,
  fields,
  limit,
  lang,
  sortBy,
  signal
) {
  let endpoint = status !== null ? `/announces?status=${status}` : "/announces";
  endpoint = `${endpoint}${archived !== null ? `?archived=${archived}` : ``}`;
  if (fields) {
    fields.forEach((field, idx) => {
      if (idx === 0) {
        endpoint += "?fields=";
      }
      endpoint += `${field},`;
    });
    endpoint = endpoint.substring(0, endpoint.length - 1);
  }
  if (limit) {
    endpoint += `?limit=${limit}`;
  }
  if (lang) {
    endpoint += `?filter={"$and" : [{ "title.${lang}": {"$exists": true}}, { "description.${lang}": {"$exists": true}}]}`;
  }
  if (sortBy) {
    endpoint += `?sort=${sortBy}`;
  }
  return http.get(`${api}${formatEndpoint(endpoint)}`, {signal});
}
export function getAnnouncesByPro(id, token, signal) {
  const endpoint = `/announces/user/${id}`;
  return http.get(`${api}${endpoint}`, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function postAnnounce(data, token, signal) {
  const endpoint = `/announces`;
  return http.post(`${api}${endpoint}`, data, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function patchAnnounce(id, data, token, signal) {
  const endpoint = `/announces/${id}`;
  return http.patch(`${api}${endpoint}`, data, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function deleteAnnounce(id, token) {
  return http.delete(`${api}/announces/${id}`, {
    headers: {"x-auth-token": token},
  });
}
export function deleteAnnounceImages(id, token) {
  return http.delete(`${api}/images/announce/${id}`, {
    headers: {"x-auth-token": token},
  });
}
export function getComments(id, signal) {
  return http.get(
    `${api}/comments?archived=false&id_announce=${id}&sort=-creationDate`,
    {signal}
  );
}
export function postComment(data, token) {
  return http.post(`${api}/comments`, data, {headers: {"x-auth-token": token}});
}
export function patchComment(id, data, token) {
  return http.patch(`${api}/comments/${id}`, data, {
    headers: {"x-auth-token": token},
  });
}
export function deleteComment(id, token) {
  return http.delete(`${api}/comments/${id}`, {
    headers: {"x-auth-token": token},
  });
}
export function getConversation(id_sender, id_receiver, token, signal) {
  return http.get(`${api}/conversations/users/${id_sender}/${id_receiver}`, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function getConversations(id, token, signal) {
  return http.get(`${api}/conversations/user/${id}`, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function postConversation(data, token, signal) {
  return http.post(`${api}/conversations`, data, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function patchConversation(id, data, token, signal) {
  return http.patch(`${api}/conversations/${id}`, data, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function postMessage(data, token, signal) {
  return http.post(`${api}/messages`, data, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function patchMessage(id, data, token, signal) {
  return http.patch(`${api}/messages/${id}`, data, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function getMessages(id_sender, id_receiver, token, signal) {
  return http.get(`${api}/messages/user/${id_sender}`, {
    headers: {"x-auth-token": token},
    signal,
  });
}
export function checkAnnounceDelete(id, model, token, signal) {
  //id=email for model 'newsletters'
  return http.get(`${api}/${model}/announce_checkDel/${id}`, {
    headers: {"x-auth-token": token},
    signal,
  });
}
