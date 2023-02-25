import {translate} from "./httpGoogleServices.js";
import _ from "lodash";
import config from "../config.json";
import {
  toastSuccess,
  toastError,
} from "../components/pages/common/toastSwal/ToastMessages.js";
import {getAnnounceImages} from "./httpImages.js";

export async function errorHandlingToast(res, lang, msg = true) {
  if (res.data.statusCode >= 400 && res.data.statusCode <= 500) {
    toastError(
      lang === "en"
        ? res.data.description
        : await translate({text: res.data.description, lang}) //message sent back from API customErrors.js such as BadRequest, NotFound ...
    );
    return true;
  }
  if (msg) {
    toastSuccess(
      lang === "en"
        ? res.data.message
        : await translate({text: res.data.message, lang}) //message sent back from API routes such as announces.js, users.js ...
    );
  }
  if (res.status === 200) return false;
  if (typeof res.data.statusCode === "undefined") return true;
  return false;
}
export async function simpleAlert(msg, lang) {
  alert(lang === "en" ? msg : await translate({text: msg, lang}));
}
export async function simpleToast(msg, lang) {
  toastError(lang === "en" ? msg : await translate({text: msg, lang}));
}
export function getRefreshTime(source) {
  switch (process.env.REACT_APP_NODE_ENV) {
    case "production":
      return {
        staleTime: config[`${source}_staleTime`].prod * 60 * 1000, //time set in config.json file is in minutes
        cacheTime: config[`${source}_cacheTime`].prod * 60 * 1000,
      };
    case "test":
      return {
        staleTime: config[`${source}_staleTime`].test * 60 * 1000, //time set in config.json file is in minutes
        cacheTime: config[`${source}_cacheTime`].test * 60 * 1000,
      };
    default:
      return {
        staleTime: config[`${source}_staleTime`].dev * 60 * 1000,
        cacheTime: config[`${source}_cacheTime`].dev * 60 * 1000,
      };
  }
}
export function getApiUrl() {
  switch (process.env.REACT_APP_NODE_ENV) {
    case "development":
      return config.api_url_dev;
    case "test":
      return config.api_url_test;
    case "production":
      return config.api_url_prod;
  }
}
export function formatEndpoint(endpoint) {
  endpoint = _.split(endpoint, "?");
  if (endpoint.length === 1) return endpoint;
  let result = null;
  endpoint.map((item, idx) => {
    switch (idx) {
      case 0:
        result = `${item}`;
        break;
      case 1:
        result = `${result}?${item}`;
        break;
      default:
        result = `${result}&${item}`;
    }
  });
  return result;
}
export async function getImages(anns, contextImages, lang, signal) {
  if (!anns) return {};
  let images = {},
    tobeLoaded = [];
  switch (Object.keys(contextImages).length) {
    case 0:
      images = await loadImages(anns, lang, signal);
      break;
    default:
      anns.map((ann) => {
        if (contextImages[ann._id]) images[ann._id] = contextImages[ann._id];
        else tobeLoaded.push({_id: ann._id});
      });
      if (tobeLoaded.length > 0) {
        const res = await loadImages(tobeLoaded, lang, signal);
        images = {...images, ...res};
      }
  }
  return images;
}
export async function loadImages(anns, lang, signal) {
  //to be used when context images are not yet available
  let result = null,
    images = {};
  let res = null;
  await Promise.all(
    anns.map(async (ann) => {
      res = await getAnnounceImages(ann._id, signal);
      if (!(await errorHandlingToast(res, lang, false))) {
        images[ann._id] = res.data.images.images;
      }
    })
  )
    .then(() => {
      result = images;
    })
    .catch((error) => {
      const txt = "error in async function loadImages at Promise.all";
      result = {
        error: {
          msg: txt,
          details: error,
        },
      };
    });
  return result;
}
