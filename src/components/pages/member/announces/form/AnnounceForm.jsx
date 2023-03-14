import {useState, useEffect, useContext} from "react";
import {useLocation, Link, useNavigate} from "react-router-dom";
import {Card, Tooltip} from "@mui/material";
import {Container, Row} from "react-bootstrap";
import ContainerToast from "../../../common/toastSwal/ContainerToast.jsx";
import {FormattedMessage, useIntl} from "react-intl";
import _ from "lodash";
import {parseISO} from "date-fns";
import {useCookies} from "react-cookie";
import FontAwesome from "react-fontawesome";
import annKeys from "./announceKeys.json";
import empty from "./default.json";
import defaultValid from "./defaultValid.json";
import {validate, alert} from "../../validation.js";
import LanguageBlock from "./LanguageBlock.jsx";
import DropDownBlock from "./DropDownBlock";
import SimpleText from "./SimpleText";
import PopperInfo from "./PopperInfo.jsx";
import ImagesContext from "./../../../common/context/ImagesContext";
import DatesBlock from "./DatesBlock.jsx";
import GuideAdultChildRider from "./GuideAdultChildRider.jsx";
import Participants from "./Participants.jsx";
import Price from "./Price.jsx";
import LevelRating from "./LevelRating";
import {range} from "../../../utils/utilityFunctions.js";
import LanguageRating from "./LanguageRating";
import france from "../../../../intl/flags/france.png";
import uk from "../../../../intl/flags/uk.png";
import germany from "../../../../intl/flags/germany.png";
import spain from "../../../../intl/flags/spain.png";
import DailyProgram from "./DailyProgram.jsx";
import Options from "./Options.jsx";
import Images from "./Images.jsx";
import {
  postAnnounce,
  patchAnnounce,
  deleteAnnounce,
  deleteAnnounceImages,
} from "../../../../../services/httpAnnounces.js";
import {
  getAnnounceImages,
  patchAnnounceImages,
  postAnnounceImages,
} from "../../../../../services/httpImages.js";
import {errorHandlingToast} from "../../../../../services/utilsFunctions.js";
import {
  toastSuccess,
  toastError,
  toastWarning,
  toastInfo,
} from "../../../common/toastSwal/ToastMessages";
import {decodeJWT} from "../../../../../services/httpUsers.js";
import {isEven} from "../../../utils/utilityFunctions.js";
import {SwalOkCancel} from "../../../common/toastSwal/SwalOkCancel.jsx";
import Position from "./Position.jsx";
import {getMarkers} from "../../../../../services/httpGoogleServices.js";
import {checkAnnounceDelete} from "../../../../../services/httpAnnounces.js";
import {getFormattedDate} from "../../../utils/utilityFunctions.js";
import {getRefreshTime} from "../../../../../services/utilsFunctions.js";

function getEmptyImage(image) {
  return {
    image,
    name: "",
    main: false,
    type: "",
    size: 0,
    lastModified: 0,
    data: "",
  };
}
function prepareImagesSet(imgs) {
  let len = imgs.length;
  for (let i = 1; i <= 5; i++) {
    if (i <= len) {
      imgs[i - 1] = {
        image: i,
        name: imgs[i - 1].name,
        main: imgs[i - 1].main,
        type: imgs[i - 1].type,
        size: imgs[i - 1].size,
        lastModified: imgs[i - 1].lastModified,
        data: imgs[i - 1].data,
      };
    } else imgs.push(getEmptyImage(i));
  }
  return imgs;
}
function checkDateInFuture(date) {
  let start = date.period.dateStart,
    end = date.period.dateEnd;
  if (_.isString(start)) start = parseISO(start);
  if (_.isString(end)) end = parseISO(end);
  if (
    start.setHours(0, 0, 0, 0) >= Date.now() ||
    end.setHours(0, 0, 0, 0) >= Date.now()
  )
    return true;
  return false;
}
async function deleteConditionsSatisfiedRR(id, token, formatMessage) {
  //RR >>> Related Records
  let bl = null;
  const abortController = new AbortController(),
    signal = abortController.signal,
    models = ["comments", "bookings"],
    n = models.length;
  for (let i = 0; i < n; i++) {
    bl = await checkAnnounceDelete(id, models[i], token, signal);
    if (!bl.data) {
      const msg = `${formatMessage({
        id: `src.components.memberPage.tabs.annonces.details.AddAnnounceForm.warning3`,
      })}'${models[i]}' !`;
      return [bl.data, msg];
    } else if (i === n - 1) return [true];
  }
}
export async function deleteConditionsSatisfied(
  id,
  local,
  data,
  token,
  formatMessage
) {
  let result = ["satisfied", true];
  const status = local ? data.status.data.saved : data.status,
    dates = local ? data.dates.data.saved : data.dates;
  if (status === "publique" && dates.length > 0) {
    let date = null;
    for (date of dates) {
      if (date?.bookingsByDay?.length > 0) {
        result = ["bookingsByDay", false]; //related records in bookinsByDay
        break;
      }
      if (checkDateInFuture(date)) {
        result = ["datesInFuture", false];
        break;
      }
    }
  }
  if (!result[1]) {
    const msg = formatMessage({
      id: `src.components.memberPage.tabs.annonces.details.AddAnnounceForm.${result[0]}Failure`,
    });
    return [result[1], msg];
  }
  return await deleteConditionsSatisfiedRR(id, token, formatMessage);
}
export async function handleDelete(
  id,
  lang,
  token,
  onHandleSaveDelete,
  formatMessage,
  local,
  navigate
) {
  const result = await SwalOkCancel(
    formatMessage,
    "src.components.memberPage.tabs.annonces.MyAnnonces.delete"
  );
  if (result === "cancel") return;

  let bl = [null, null];
  const abortController = new AbortController();
  let res = await deleteAnnounceImages(id, token, abortController.signal);
  bl[0] = !(await errorHandlingToast(res, lang, false));
  if (bl[0])
    onHandleSaveDelete(
      "images", //update images data state in App.js with saved data
      "delete",
      id
    );

  res = await deleteAnnounce(id, token, abortController.signal);
  bl[1] = !(await errorHandlingToast(res, lang, false));
  if (bl[1]) {
    onHandleSaveDelete(
      "delete", //delete announces data properties in App.js (from useQuery)
      id
    );
    if (local)
      setTimeout(() => {
        navigate(-1);
      }, 3500);
  }
  successFailure("DELETE", bl, formatMessage);
}
export function successFailure(
  cs,
  bl,
  formatMessage,
  source = "AddAnnounceForm"
) {
  let i = 1, //PATCH case
    j = 1; //PATCH, POST
  switch (cs) {
    case "POST":
      i = 2;
      break;
    case "DELETE":
      i = 3;
      j = 2;
  }
  if (bl.indexOf(false) === -1)
    toastSuccess(
      formatMessage({
        id: `src.components.memberPage.tabs.annonces.details.${source}.success${i}`,
      })
    );
  else
    toastError(
      formatMessage({
        id: `src.components.memberPage.tabs.annonces.details.AddAnnounceForm.failure${j}`,
      })
    );
}
let globals = {},
  dataIn = {},
  id_ann = 0,
  imagesInDb = -1,
  dirty = false,
  selected = null,
  userId = null;
function AnnounceForm({onHandleSaveDelete, onHandleDirty}) {
  const navigate = useNavigate();
  function getURL() {
    let url = `/member?MyAnnounces&${userId}`;
    Object.keys(selected).map((id) => {
      if (selected[id] === 1) url = `${url}&${id}`;
    });
    return url;
  }
  async function resetData(e) {
    if (dirty === false && location.state === null) navigate(getURL()); //new announce created, saved and action on back button
    if (dirty) {
      const result = await SwalOkCancel(formatMessage, "global.dirty");
      if (result === "cancel") {
        navigate(null);
        return;
      } else {
        dirty = false;
        navigate(getURL());
        onHandleDirty(false);
      }
    }
    if (e.target.location.pathname.split("/").indexOf(id_ann) !== -1) return; //coming back to AnnounceForm after viewing the announce in AnnouncePage display format
    id_ann = 0;
    dataIn = {};
    imagesInDb = -1;
  }
  window.addEventListener("popstate", resetData); //resets id_ann and dataIn on browser back button action
  const contextImages = useContext(ImagesContext);
  const {locale, formatMessage} = useIntl();
  const location = useLocation();
  const [cookies, setCookie] = useCookies(["user"]);
  const currentUser = cookies.user ? decodeJWT(cookies.user) : null;
  let cond = false;
  if (id_ann === 0) cond = true;
  if (!cond && location.state) cond = location.state.announce._id !== -1;
  if (cond) {
    try {
      dataIn = location.state.announce; //announce edit (announce is provided, may contain missing fields) and announce creation case ({_id:-1} is provided)
      selected = location.state.selected;
      userId = location.state.userId;
      id_ann = dataIn._id;
    } catch (error) {
      navigate("/member"); //location.state=null
    }
  }
  dataIn.dates?.map((date, idx) => {
    dataIn.dates[idx].period.dateStart = _.isString(date.period.dateStart)
      ? parseISO(date.period.dateStart)
      : date.period.dateStart;
    dataIn.dates[idx].period.dateEnd = _.isString(date.period.dateEnd)
      ? parseISO(date.period.dateEnd)
      : date.period.dateEnd;
  });
  const [reset, setReset] = useState(id_ann === -1 ? 0 : 1); //0 >>> default data (new announce), 1 >>> saved data (edit case)
  function initGlobals(cs = "all") {
    const keys = Object.keys(empty);
    switch (cs) {
      case "data":
        keys.map((key) => {
          if (key !== "images") globals[key] = {init: null};
        });
        break;
      case "images":
        globals.images = {};
        break;
      default: //full initialisation
        keys.map((key) => {
          globals[key] = {init: null};
        });
    }
  }
  const [spin1, setSpinner1] = useState(false);
  const [spin2, setSpinner2] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [values, setValues] = useState({});
  const [valid, setValid] = useState({
    current: {},
    default: {},
    saved: {},
  });
  const [trashConditions, setTrashConditions] = useState({
    cond: [false, ""],
    color: "#ccc",
  });
  async function setDeleteConditions(data) {
    const rslt = await deleteConditionsSatisfied(
      id_ann,
      true, //local=true
      data,
      cookies.user,
      formatMessage
    );
    setTrashConditions({cond: rslt, color: rslt[0] ? "#7AA095" : "#ccc"});
  }
  useEffect(() => {
    setSpinner1(true);
    initGlobals("data");
    const valide = _.cloneDeep(defaultValid);
    let result = null;
    function prepareData() {
      result = _.cloneDeep(empty);
      delete result.images;
      result.log = {
        name: "log",
        data: {
          default: {
            status: [["brouillon", null]],
            archived: [[false, null]],
          },
          saved: {status: [], archived: []},
        },
      };
      Object.keys(annKeys).map((key) => {
        switch (key) {
          case "_id":
            result[key].data.saved = id_ann; //id_ann=-1 for new announce creation
            break;
          case "id_user":
            result[key].data.saved =
              id_ann === -1 ? currentUser._id : dataIn[key]._id;
            break;
          default:
            result[key].data.saved =
              id_ann === -1
                ? empty[key].data.default
                : typeof dataIn[key] !== "undefined"
                ? dataIn[key]
                : {};
            switch (annKeys[key]) {
              case true: //en, fr
                result[key].data.saved.fr =
                  id_ann === -1
                    ? empty[key].data.default.fr
                    : dataIn[key] && dataIn[key].fr
                    ? dataIn[key].fr
                    : "";
                valide[key].fr = !valide[key].fr
                  ? validate(key, result[key].data.saved.fr)[0]
                  : true;
                result[key].data.saved.en =
                  id_ann === -1
                    ? empty[key].data.default.en
                    : dataIn[key] && dataIn[key].en
                    ? dataIn[key].en
                    : "";
                valide[key].en = !valide[key].en
                  ? validate(key, result[key].data.saved.en)[0]
                  : true;
                break;
              case false:
                valide[key] = !valide[key]
                  ? validate(key, result[key].data.saved)[0]
                  : true;
                if (key === "position")
                  valide[key] = {
                    lat: validate("lat", result[key].data.saved.lat)[0],
                    lng: validate("lng", result[key].data.saved.lng)[0],
                  };
                if (
                  (key === "nbDays" || key === "nbNights") &&
                  dataIn.datesType === "Flex_Flex"
                )
                  valide[key] = true; //nbdays='n'
            }
        }
      });
      setValid({
        current: _.cloneDeep(valide),
        default: _.cloneDeep(defaultValid),
        saved: _.cloneDeep(valide),
      });
      setValues(result);
      setSpinner1(false);
    }
    prepareData();
    if (id_ann !== -1) setDeleteConditions(result); //clean-up code in deleteConditionsSatisfiedRR()
  }, [dataIn]);
  const [images, setImages] = useState({});
  useEffect(() => {
    setSpinner1(true);
    initGlobals("images");
    async function loadImages(signal) {
      const result = _.cloneDeep(empty.images);
      let cs = id_ann === -1 ? 0 : -1;
      if (cs === -1) {
        //edit case
        try {
          let data = {};
          if (!contextImages[id_ann]) {
            const res = await getAnnounceImages(id_ann, signal);
            if (!(await errorHandlingToast(res, locale, false))) {
              imagesInDb = res.data.len;
              data = res.data.images.images;
            } else cs = 0;
          } else {
            data = _.cloneDeep(contextImages[id_ann]);
            imagesInDb = data.length;
          }
          switch (imagesInDb) {
            case 0: //edit case without images
              cs = 0;
              break;
            default: //edit case with existing images
              const imgs = prepareImagesSet(data);
              let total = 0;
              const original = [];
              imgs.map((img, idx) => {
                original.push(img);
                total += img.size;
              });
              result.data.saved = {data: original, total};
          }
        } catch (error) {}
      }
      if (cs === 0)
        //new announce creation
        result.data.saved = _.cloneDeep(empty.images.data.default);
      setImages(result);
      setSpinner1(false);
    }
    const abortController = new AbortController();
    loadImages(abortController.signal);
    return () => {
      abortController.abort(); //clean-up code after component has unmounted
      window.removeEventListener("popstate", resetData);
    };
  }, []);
  function handleClearAllUndo(cs) {
    initGlobals(); //resets globals (contains all user's modified data) to empty properties
    let rst = _.clone(reset);
    if (cs === 0) {
      rst += isEven(rst) ? 2 : 1; //even number, clear all >>> default values
      // update globals >>> delta between default and saved values
      Object.keys(values).map((key) => {
        if (!_.isEqual(values[key].data.saved, values[key].data.default))
          globals[key] = values[key].data.default;
      });
    } else rst += isEven(rst) ? 1 : 2; //odd number, undo >>> saved values

    const valide = {...valid}; //resets valid after clear or restore all
    valide.current = _.cloneDeep(isEven(rst) ? valide.default : valide.saved);
    setValid(valide);
    setReset(rst);
    setDirty();
  }
  function setDirty() {
    dirty = announceUnsavedChanges(false);
    if (!dirty) {
      dirty = imagesUnsavedChanges(false);
    }
    if (dirty) navigate(null);
    onHandleDirty(dirty);
  }
  function handleGlobals(cs, val) {
    const len = val.length;
    if (cs === "value") {
      delete globals[val[0]].init;
      switch (len) {
        case 2:
          globals[val[0]] = val[1];
          break;
        case 3:
          globals[val[0]][val[1]] = val[2]; // en-fr
      }
      setDirty();
      console.log("globals", globals);
    }
    if (cs === "valid") {
      const valide = {...valid};
      switch (len) {
        case 2:
          valide.current[val[0]] = val[1];
          break;
        case 3:
          valide.current[val[0]][val[1]] = val[2]; // en-fr
      }
      setValid(valide);
      setFormValid(JSON.stringify(valide.current).indexOf(false) === -1);
    }
  }
  function prepareAnnounceBody(cs, modified) {
    const keys = Object.keys(annKeys);
    keys.splice(0, cs === "POST" ? 1 : 2); //removes _id, id_user (PATCH only)
    let body = {},
      flg = null,
      cond = null;
    switch (cs) {
      case "POST": //body = empty + globals (user modified inputs)
        const data = _.cloneDeep(empty);
        delete data._id;
        delete data.images;
        keys.map((key) => {
          switch (key) {
            case "id_user":
              body[key] = currentUser._id;
              break;
            default:
              flg = Object.keys(modified[key]);
              if (flg.length === 1 && flg.indexOf("init") === 0) {
                body[key] = data[key].data.default;
                break;
              }
              flg = [];
              switch (annKeys[key]) {
                case true: //en, fr
                  body[key] = {};
                  if (typeof modified[key].en !== "undefined")
                    body[key].en = modified[key].en;
                  else flg.push("en"); //nochange en
                  if (typeof modified[key].fr !== "undefined")
                    body[key].fr = modified[key].fr;
                  else flg.push("fr"); //nochange fr
                  if (flg.length === 1)
                    body[key][flg[0]] = data[key].data.default[flg[0]];
                  break;
                case false:
                  if (modified[key]) body[key] = modified[key];
              }
          }
        });
        break;
      case "PATCH": //compares saved data (dataIn) vs modified (changes made by user)
        body = {};
        keys.map((key) => {
          flg = Object.keys(modified[key]);
          cond = flg.length === 1 && flg.indexOf("init") === 0;
          switch (key) {
            case "options":
            case "days":
              if (cond) break;
              if (!_.isEqual(modified[key], dataIn[key]))
                body[key] = modified[key];
              else if (body[key]) delete body[key]; //no change but modified[key] may have been created before (changes and come back to saved values)
              break;
            default:
              if (cond) break;
              flg = [];
              switch (annKeys[key]) {
                case true: //en, fr
                  body[key] = {};
                  if (
                    typeof modified[key].en !== "undefined" &&
                    modified[key].en !== dataIn[key].en
                  )
                    body[key].en = modified[key].en;
                  else flg.push("en"); //nochange en
                  if (
                    typeof modified[key].fr !== "undefined" &&
                    modified[key].fr !== dataIn[key].fr
                  )
                    body[key].fr = modified[key].fr;
                  else flg.push("fr"); //nochange fr
                  if (flg.length === 1) body[key][flg[0]] = dataIn[key][flg[0]];
                  if (flg.length === 2 && body[key]) delete body[key]; //no change in both en fr, but modified[key] may have been created before (changes and come back to saved values)
                  break;
                case false:
                  if (modified[key] != dataIn[key]) body[key] = modified[key];
                  else if (body[key]) delete body[key]; //no change but modified[key] may have been created before (changes and come back to saved values)
              }
          }
        });
    }
    console.log("body announce", body);
    return body;
  }
  function checkForImagesChange(imagesSet) {
    const original = _.cloneDeep(images.data.saved), //original pictures before save
      bl = [],
      keys = Object.keys(getEmptyImage(0));
    if (Object.keys(imagesSet).length === 0) return false; //no change in announce pictures
    if (original.total === 0)
      return true; //actual change in announce pictures, no original pictures
    else {
      //actual change in announce pictures, existing original pictures
      for (let i = 0; i <= 4; i++) {
        keys.map((key, j) => {
          if (key === "data")
            bl[j] =
              imagesSet.data[i][key].length === original.data[i][key].length;
          else bl[j] = imagesSet.data[i][key] === original.data[i][key];
          /* console.log(
            key,
            imagesSet.data[i][key],
            original.data[i][key],
            imagesSet.data[i][key] === original.data[i][key]
          ); */
        });
        if (bl.indexOf(false) !== -1) return true;
      }
    }
    return false;
  }
  function prepareImagesBodyData(val) {
    const imgs = [];
    val.data.map((im) => {
      delete im.image;
      imgs.push(im);
    });
    const body = {
      id_announce: id_ann,
      images: _.filter(imgs, (img) => {
        return img.lastModified !== 0;
      }),
    };
    console.log("body images", body);
    return body;
  }
  async function handleSave() {
    setSpinner2(true);
    const bl = [null, null],
      abortController = new AbortController();
    //######## announce processing
    let modified = _.cloneDeep(globals), //current user's modified values
      res = null,
      actualChange = -1;
    delete modified._id;
    delete modified.id_user;
    delete modified.images;
    let cs = id_ann === -1 ? "POST" : "PATCH";
    const body = prepareAnnounceBody(cs, modified);
    if (Object.keys(body).length > 0) {
      actualChange += 1;
      switch (cs) {
        case "POST":
          res = await postAnnounce(body, cookies.user, abortController.signal);
          id_ann = res.data.data._id; //newly created announce _id
          body.log = res.data.data.log; //update body with log data from the database
          dataIn = {..._.cloneDeep(body), _id: id_ann}; //multiple save operations on a newly created announce
          break;
        case "PATCH":
          res = await patchAnnounce(
            id_ann,
            body,
            cookies.user,
            abortController.signal
          );
          if (res.data.log) body.log = res.data.log; //update body with log data from the database in case of status or archived change
          if (res.data.flag === 2) body.status = "brouillon"; //update body with unrequested status change (announce restoration with 'publique' status >>> 'brouillon')
      }
      bl[0] = !(await errorHandlingToast(res, locale, false));
      if (bl[0]) {
        const data = _.cloneDeep(values); //update values state properties with saved data
        if (cs === "POST") {
          data._id.data.saved = id_ann;
          selected[id_ann] = 1;
        }
        Object.keys(body).map((key) => {
          data[key].data.saved = _.clone(body[key]);
        });
        setValues(data);
        onHandleSaveDelete(
          "save", //update/create announces data properties in App.js (from useQuery) with saved data
          id_ann,
          cs === "POST"
            ? {
                ...body,
                id_user: {
                  _id: body.id_user,
                  email: currentUser.email,
                  registration_date: currentUser.registration_date,
                },
              }
            : body
        );
        setDeleteConditions(data); //update delete conditions following save operation
        initGlobals("data");
      }
    }
    //###### images processing
    const imagesSet = _.cloneDeep(globals.images); //initialised with saved images and then updated upon changes  >>> current images displayed
    let flg = Object.keys(imagesSet);
    flg = flg.length === 1 && flg.indexOf("init") === 0 ? false : true;
    if (imagesSet && flg && checkForImagesChange(imagesSet)) {
      actualChange += 1;
      let csi = null;
      const body = prepareImagesBodyData(imagesSet);
      if (body.images.length === 0) {
        csi = "delete";
        res = await deleteAnnounceImages(
          id_ann,
          cookies.user,
          abortController.signal
        );
      } else {
        csi = "save";
        res =
          imagesInDb > 0
            ? await patchAnnounceImages(
                id_ann,
                body,
                cookies.user,
                abortController.signal
              )
            : await postAnnounceImages(
                id_ann,
                body,
                cookies.user,
                abortController.signal
              );
      }
      bl[1] = !(await errorHandlingToast(res, locale, false));
      if (bl[1]) {
        const imgs = _.cloneDeep(images); //update images state properties with saved data
        if (Object.keys(globals.images).length > 0) {
          const data = _.cloneDeep(globals.images);
          let total = 0;
          data.data.map((img) => {
            total += img.size;
          });
          imgs.data.saved = csi === "save" ? {...data, total} : getEmptyImage();
        }
        setImages(imgs);
        onHandleSaveDelete(
          "images", //update/create images data properties in App.js with saved data
          csi,
          body
        );
        initGlobals("images");
      }
    }
    if (actualChange >= 0) {
      successFailure(cs, bl, formatMessage);
      handleClearAllUndo(1); //set reset to odd number to display saved data
    }
    dirty = false;
    onHandleDirty(false);
    setSpinner2(false);
    return bl.indexOf(false) === -1 ? true : false;
  }
  function imagesUnsavedChanges(msg = true) {
    let flg = Object.keys(globals.images);
    flg = flg.length === 1 && flg.indexOf("init") === 0 ? false : true;
    const result =
      globals.images && flg && checkForImagesChange(globals.images);
    if (result && msg)
      toastWarning(
        formatMessage({
          id: "src.components.memberPage.tabs.annonces.MyAnnonces.toast7",
        })
      );
    return result;
  }
  function announceUnsavedChanges(msg = true) {
    let cs = -1;
    if (id_ann === -1) cs += 1; //newly created announce that has never been saved
    if (cs === -1) {
      let modified = _.cloneDeep(globals); //current user's modified values
      let body = prepareAnnounceBody("PATCH", modified);
      if (Object.keys(body).length > 0) cs += 1; //unsaved pending changes
    }
    if (cs >= 0 && msg) {
      toastWarning(
        formatMessage({
          id: "src.components.memberPage.tabs.annonces.MyAnnonces.toast7",
        })
      ); //save announce before any further action such as publishing or reverting to draft, archiving or restoring ...
    }
    return cs >= 0;
  }
  async function handleStatusArchived(type) {
    //status change : type=-1 >>> 'publique' to 'brouillon', type=1 >>> 'brouillon' to 'publique'
    //archived change : type=-2 >>> 'archived=true' to 'archived=false', type=2 >>> 'archived=false' to 'archived=true'
    if (type === 1 && !formValid) {
      toastWarning(
        formatMessage({
          id: "src.components.memberPage.tabs.annonces.MyAnnonces.toast8",
        })
      ); //mandatory fields missing
      return;
    }
    if (type === 1 && currentUser.status !== "ACTIVE") {
      toastWarning(
        formatMessage({
          id: "src.components.memberPage.tabs.annonces.MyAnnonces.toast6",
        })
      ); //user profile must be approved before publishing
      return;
    }
    if (announceUnsavedChanges()) return; //save announce before publishing or reverting to draft, archiving or restoring
    if (imagesUnsavedChanges()) return;
    if (
      type === 1 &&
      values.priceAdulte.data.saved +
        values.priceChild.data.saved +
        values.priceAccompagnateur.data.saved <=
        0
    ) {
      toastWarning(
        formatMessage({
          id: "src.components.memberPage.tabs.annonces.MyAnnonces.toast9",
        })
      ); //user profile must be approved before publishing
      return;
    }

    if (type == -1 || type === 2) {
      //status change 'publique' to 'brouillon', archived change false to true only possible if no dates in future
      for (let date of values.dates.data.saved) {
        if (checkDateInFuture(date)) {
          toastWarning(
            formatMessage({
              id: `src.components.memberPage.tabs.annonces.MyAnnonces.${
                type === -1 ? "status" : "archived"
              }Change${type > 0 ? "+" : ""}${type}Failure`,
            })
          );
          return;
        }
      }
    }
    //at this stage, all rejection conditions passed, ask user's confirmation
    if (
      (await SwalOkCancel(
        formatMessage,
        `src.components.memberPage.tabs.annonces.MyAnnonces.${
          Math.abs(type) === 1 ? "status" : "archived"
        }Change${type > 0 ? "+" : ""}${type}`
      )) === "cancel"
    )
      return;

    function getStatusArchived() {
      switch (type) {
        case -1:
        case 1:
          return type === 1 ? "publique" : "brouillon";
        case -2:
        case 2:
          return type === 2 ? true : false;
      }
    }
    globals[Math.abs(type) === 1 ? "status" : "archived"] = getStatusArchived(); //update globals since it is not changed by user's input
    const result = await handleSave(); //update status or archived change in database
    if (result && type === 1)
      toastInfo(
        `${formatMessage({
          id: "src.components.memberPage.tabs.annonces.MyAnnonces.toast10",
        })} ${getRefreshTime("App.js").staleTime / 60000} mns`
      );
    /* const vals = _.cloneDeep(values);
    vals[Math.abs(type) === 1 ? "status" : "archived"].data.saved =
      getStatusArchived(); //update saved values state properties
    setValues(vals); */
  }
  async function handlePositionUpdate() {
    const str_markers = {dummy: []};
    str_markers.locations = [
      encodeURIComponent(
        `${document.getElementById("AnnounceFormdestination").value} ${
          document.getElementById("AnnounceFormcity").value
        } ${document.getElementById("AnnounceFormpostalCode").value}`
      ),
    ];
    const markers = (await getMarkers(str_markers)).data;
    const lat = markers[0].position.lat,
      lng = markers[0].position.lng;
    document.getElementById("AnnounceFormlat").value = lat;
    document.getElementById("AnnounceFormlng").value = lng;
    globals.position = {lat, lng};
  }
  function prepareData(data) {
    const obj = [];
    Object.keys(data).map((key) => {
      data[key].map((item) => {
        obj.push([
          `${key} > ${item[0]} - ${getFormattedDate(item[1])}`,
          new Date(item[1]).getTime(),
        ]);
      });
    });
    obj.sort(function (a, b) {
      return b[1] - a[1]; //sort by date desc
    });
    return obj;
  }
  return (
    Object.keys(values).length > 0 &&
    Object.keys(valid.current).length > 0 && (
      <>
        <ContainerToast></ContainerToast>
        <div
          className="d-flex justify-content-between mx-0 w-100"
          style={{
            position: "fixed",
            zIndex: 2,
            marginTop: "77px",
            backgroundColor: "#F3F3F3",
            border: "1px solid",
            borderColor: "green",
            borderRadius: "10px",
            height: "80px",
          }}
        >
          <div className="d-flex mt-3 mx-4 p-3">
            <label className="ml-2 mr-1">
              <h5
                style={{
                  minWidth: "70px",
                  fontWeight: "bold",
                  color: "blue",
                }}
              >
                <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.status" />
              </h5>
            </label>
            <input
              key={reset}
              type="text"
              className="form-control mt-1"
              readOnly={true}
              value={values.status.data[isEven(reset) ? "default" : "saved"]}
              style={{
                minWidth: "100px",
              }}
            ></input>
            <label className="ml-5 pl-2 mr-0">
              <h5
                style={{
                  minWidth: "80px",
                  fontWeight: "bold",
                  color: "blue",
                }}
              >
                <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.archived" />
              </h5>
            </label>
            <input
              key={reset + 1}
              type="checkbox"
              className="mb-4 mt-2"
              style={{minWidth: "20px"}}
              readOnly={true}
              checked={
                values.archived.data[isEven(reset) ? "default" : "saved"]
              }
            ></input>
            <PopperInfo
              data={prepareData(
                values.log.data[isEven(reset) ? "default" : "saved"]
              )}
              idTT="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.history"
              icon="fa fa-history fa-2x"
            ></PopperInfo>
          </div>
          <div className="mt-0 mb-3" style={{paddingLeft: "7%"}}>
            <div className="my-3 mx-0 p-0">
              {!formValid ? alert("form") : null}
            </div>
          </div>
          <div className="d-flex mt-0 mx-5 mt-3 p-3">
            <span>
              <h3 className="d-inline media-heading mr-4 ">
                {!spin1 && !spin2 ? null : (
                  <FontAwesome
                    className="fa fa-spinner fa-lg"
                    style={{
                      color: "#7AA095",
                    }}
                    name="spinner"
                    pulse
                  />
                )}
              </h3>
              <Tooltip
                title={formatMessage({
                  id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.save",
                })}
                arrow
              >
                <i
                  className="fa fa-save fa-2x mr-4"
                  style={{
                    color: !values.archived.data.saved ? "#7AA095" : "#ccc",
                    border: "0",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (values.archived.data.saved) return; //no fields change in archived announce, therefore no need to save
                    if (values.status.data.saved === "publique" && !formValid) {
                      toastError(
                        formatMessage({
                          id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.warning4",
                        })
                      );
                      return;
                    }
                    handleSave();
                  }}
                ></i>
              </Tooltip>
              <Tooltip
                title={formatMessage({
                  id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.view",
                })}
                arrow
              >
                <Link
                  className="fa fa-eye fa-2x ml-1 mr-2"
                  to={`/announce/details?id=${id_ann}`}
                  style={{
                    color: "#7AA095",
                    border: "0",
                    cursor: "pointer",
                  }}
                  state={{
                    images:
                      images &&
                      images.data &&
                      images.data.saved &&
                      _.filter(images.data.saved.data, (img) => {
                        return img.size !== 0;
                      }),
                  }}
                  onClick={(e) => {
                    if (announceUnsavedChanges()) {
                      e.preventDefault();
                      return;
                    }
                    if (imagesUnsavedChanges()) e.preventDefault();
                  }}
                ></Link>
              </Tooltip>
              <Tooltip
                title={formatMessage({
                  id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.clearAll",
                })}
                arrow
              >
                <i
                  className="fa fa-eraser fa-2x ml-3 mr-3"
                  style={{
                    color: !values.archived.data.saved ? "#7AA095" : "#ccc",
                    border: "0",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (values.archived.data.saved) return; //no fields change in archived announce
                    handleClearAllUndo(0);
                  }}
                ></i>
              </Tooltip>
              <Tooltip
                title={formatMessage({
                  id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.restoreAll",
                })}
                arrow
              >
                <i
                  className="fa fa-undo fa-2x ml-2 mr-3"
                  style={{
                    color:
                      !values.archived.data.saved && id_ann !== -1
                        ? "#7AA095"
                        : "#ccc",
                    border: "0",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (values.archived.data.saved || id_ann === -1) return; //no restore fields capbility in archived or newly created announce
                    handleClearAllUndo(1);
                  }}
                ></i>
              </Tooltip>
              <Tooltip
                title={formatMessage({
                  id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.archive",
                })}
                arrow
              >
                <i
                  className="fa fa-archive fa-2x ml-5 mr-3"
                  style={{
                    color: !values.archived.data[
                      isEven(reset) ? "default" : "saved"
                    ]
                      ? "#7AA095"
                      : "#ccc",
                    border: "0",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (
                      values.archived.data[isEven(reset) ? "default" : "saved"]
                    )
                      return;
                    handleStatusArchived(2);
                  }}
                ></i>
              </Tooltip>
              <Tooltip
                title={formatMessage({
                  id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.restore",
                })}
                arrow
              >
                <i
                  className="fa fa-folder-open fa-2x mx-3"
                  style={{
                    color: values.archived.data[
                      isEven(reset) ? "default" : "saved"
                    ]
                      ? "#7AA095"
                      : "#ccc",
                    border: "0",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (
                      !values.archived.data[isEven(reset) ? "default" : "saved"]
                    )
                      return;
                    handleStatusArchived(-2);
                  }}
                ></i>
              </Tooltip>
              <Tooltip
                title={formatMessage({
                  id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.delete",
                })}
                arrow
              >
                <i
                  className="fa fa-trash fa-2x mx-3 "
                  style={{
                    color: trashConditions.color,
                    border: "0",
                    cursor: "pointer",
                  }}
                  onClick={async () => {
                    if (id_ann === -1) return; //no delete on unsaved announce
                    if (!trashConditions.cond[0]) {
                      toastError(trashConditions.cond[1]);
                      return;
                    }
                    setSpinner2(true);
                    await handleDelete(
                      id_ann,
                      locale,
                      cookies.user,
                      onHandleSaveDelete,
                      formatMessage,
                      true,
                      navigate
                    );
                    setSpinner2(false);
                  }}
                ></i>
              </Tooltip>
              <Tooltip
                title={formatMessage({
                  id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.draft",
                })}
                arrow
              >
                <i
                  className="fa fa-download fa-2x pt-1 ml-5 mr-4"
                  style={{
                    color:
                      values.status.data[
                        isEven(reset) ? "default" : "saved"
                      ] !== "brouillon"
                        ? "#7AA095"
                        : "#ccc",
                    border: "0",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (
                      values.status.data[
                        isEven(reset) ? "default" : "saved"
                      ] === "brouillon"
                    )
                      return;
                    handleStatusArchived(-1);
                  }}
                ></i>
              </Tooltip>
              <Tooltip
                title={formatMessage({
                  id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.publish",
                })}
                arrow
              >
                <i
                  className="fa fa-upload fa-2x pt-1 mx-3 mb-2"
                  style={{
                    color:
                      values.status.data[
                        isEven(reset) ? "default" : "saved"
                      ] !== "publique" && currentUser.status !== "PENDING"
                        ? "#7AA095"
                        : "#ccc",
                    border: "0",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (currentUser.status === "PENDING") return;
                    if (
                      values.status.data[
                        isEven(reset) ? "default" : "saved"
                      ] === "publique"
                    )
                      return;
                    handleStatusArchived(1);
                  }}
                ></i>
              </Tooltip>
            </span>
          </div>
        </div>
        <Card
          variant="outlined"
          style={{
            marginTop: "120px",
            paddingTop: "50px",
            paddingBottom: "25px",
            width: "100%",
            borderWidth: "1px",
          }}
        >
          <Container style={{minWidth: "100%"}}>
            <LanguageBlock
              type="text"
              reset={reset}
              dataIn={values.title}
              required={true}
              valid={valid.current.title}
              onHandleGlobals={handleGlobals}
            ></LanguageBlock>
            <LanguageBlock
              type="textarea"
              reset={reset}
              dataIn={values.description}
              required={true}
              valid={valid.current.description}
              onHandleGlobals={handleGlobals}
            ></LanguageBlock>
            <Row className="justify-content-md-left mx-3 pl-1 my-4 pt-2">
              <DropDownBlock
                cs="destination"
                reset={reset}
                dataIn={values.destination}
                valid={valid.current.destination}
                onHandleGlobals={handleGlobals}
              ></DropDownBlock>
              <SimpleText
                id={true}
                reset={reset}
                dataIn={values.city}
                required={true}
                valid={valid.current.city}
                onHandleGlobals={handleGlobals}
              ></SimpleText>
              <SimpleText
                id={true}
                reset={reset}
                dataIn={values.postalCode}
                required={true}
                valid={valid.current.postalCode}
                w="70%"
                onHandleGlobals={handleGlobals}
              ></SimpleText>
              <Tooltip
                title={formatMessage({
                  id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.positionUpdateTT",
                })}
                arrow
              >
                <button
                  className="dropdown singleDrop btn btn-success h-100 mt-2"
                  onClick={handlePositionUpdate}
                >
                  <FormattedMessage
                    id={
                      "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.positionUpdate"
                    }
                  />
                </button>
              </Tooltip>
              <Position
                reset={reset}
                dataIn={values.position}
                valid={valid.current.position}
                onHandleGlobals={handleGlobals}
              ></Position>
            </Row>
            <LanguageBlock
              type="textarea"
              reset={reset}
              dataIn={values.howToGoTo}
              required={false}
              valid={valid.current.howToGoTo}
              onHandleGlobals={handleGlobals}
            ></LanguageBlock>
            <Row className="justify-content-md-left mx-2 pl-2 my-4 pt-2">
              <DropDownBlock
                cs="category"
                reset={reset}
                dataIn={values.category}
                valid={valid.current.category}
                onHandleGlobals={handleGlobals}
              ></DropDownBlock>
              <GuideAdultChildRider
                reset={reset}
                dataIn={{
                  haveGuide: values.haveGuide,
                  openToAdults: values.openToAdults,
                  openToChildren: values.openToChildren,
                  openToNonRiders: values.openToNonRiders,
                }}
                onHandleGlobals={handleGlobals}
              ></GuideAdultChildRider>
            </Row>
            <Row className="justify-content-md-left mx-2 pl-2 my-4 pt-2">
              <label className="ml-0 mr-5 pr-5 mt-2 ">
                <h5
                  style={{
                    minWidth: "140px",
                    color: "green",
                  }}
                >
                  <FormattedMessage
                    id={`src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.expectedLevel`}
                  />
                  {" *"}
                </h5>
              </label>
              <LevelRating
                reset={reset}
                dataIn={values.equestrianLevel}
                required={false}
                l0={2}
                l1={range(6, 10)}
                onHandleGlobals={handleGlobals}
              ></LevelRating>
              <LevelRating
                reset={reset}
                dataIn={values.physicalLevel}
                required={false}
                l0={3}
                l1={range(11, 15)}
                onHandleGlobals={handleGlobals}
              ></LevelRating>
            </Row>
            <Row className="justify-content-md-left mx-2 pl-2 my-4 pt-2">
              <Participants
                reset={reset}
                dataIn={{
                  participantMin: values.participantMin,
                  participantMax: values.participantMax,
                  ageMinParticipant: values.ageMinParticipant,
                  ageMaxParticipant: values.ageMaxParticipant,
                  childUnderOf: values.childUnderOf,
                }}
                valid={{
                  participantMin: valid.current.participantMin,
                  participantMax: valid.current.participantMax,
                  ageMinParticipant: valid.current.ageMinParticipant,
                  ageMaxParticipant: valid.current.ageMaxParticipant,
                  childUnderOf: valid.current.childUnderOf,
                }}
                onHandleGlobals={handleGlobals}
              ></Participants>
            </Row>
            <Row className="justify-content-md-left mx-2 pl-2 my-4 pt-2">
              <Price
                suffix={null}
                type={dataIn.datesType}
                reset={reset}
                dataIn={{
                  devise: values.devise,
                  priceAdulte: values.priceAdulte,
                  priceChild: values.priceChild,
                  priceAccompagnateur: values.priceAccompagnateur,
                }}
                valid={{
                  devise: valid.current.devise,
                  priceAdulte: valid.current.priceAdulte,
                  priceChild: valid.current.priceChild,
                  priceAccompagnateur: valid.current.priceAccompagnateur,
                }}
                onHandleGlobals={handleGlobals}
              ></Price>
            </Row>
            <DatesBlock
              key={reset} //component refresh each time reset is changed in handleClearAllUndo function
              reset={reset}
              dataIn={{
                datesType: values.datesType,
                daysNights: {
                  nbDays: values.nbDays.data,
                  nbNights: values.nbNights.data,
                },
                dates: values.dates,
              }}
              onHandleGlobals={handleGlobals}
            ></DatesBlock>
            <LanguageBlock
              type="textarea"
              reset={reset}
              dataIn={values.typicalDay}
              required={false}
              valid={valid.current.typicalDay}
              onHandleGlobals={handleGlobals}
            ></LanguageBlock>
            <DailyProgram
              reset={reset}
              dataIn={values.days}
              onHandleGlobals={handleGlobals}
            ></DailyProgram>
            <LanguageBlock
              type="textarea"
              reset={reset}
              dataIn={values.horseDescription}
              required={false}
              valid={valid.current.horseDescription}
              onHandleGlobals={handleGlobals}
            ></LanguageBlock>
            <LanguageBlock
              type="textarea"
              reset={reset}
              dataIn={values.saddleryDescription}
              required={false}
              valid={valid.current.saddleryDescription}
              onHandleGlobals={handleGlobals}
            ></LanguageBlock>
            <LanguageBlock
              type="textarea"
              reset={reset}
              dataIn={values.supervisingDescription}
              required={false}
              valid={valid.current.supervisingDescription}
              onHandleGlobals={handleGlobals}
            ></LanguageBlock>
            <Row className="justify-content-md-left mx-2 pl-2 my-4 pt-2">
              <LevelRating
                reset={reset}
                dataIn={values.comfortLevel}
                required={false}
                l0={1}
                l1={range(1, 5)}
                onHandleGlobals={handleGlobals}
              ></LevelRating>
            </Row>
            <LanguageBlock
              type="textarea"
              reset={reset}
              dataIn={values.accommodationDescription}
              required={false}
              valid={valid.current.accommodationDescription}
              onHandleGlobals={handleGlobals}
            ></LanguageBlock>
            <LanguageBlock
              type="textarea"
              reset={reset}
              dataIn={values.mealDescription}
              required={false}
              valid={valid.current.mealDescription}
              onHandleGlobals={handleGlobals}
            ></LanguageBlock>
            <LanguageBlock
              type="textarea"
              reset={reset}
              dataIn={values.included}
              required={false}
              valid={valid.current.included}
              onHandleGlobals={handleGlobals}
            ></LanguageBlock>
            <LanguageBlock
              type="textarea"
              reset={reset}
              dataIn={values.notIncluded}
              required={false}
              valid={valid.current.notIncluded}
              onHandleGlobals={handleGlobals}
            ></LanguageBlock>
            <Options
              reset={reset}
              dataIn={values.options}
              onHandleGlobals={handleGlobals}
            ></Options>
            <LanguageBlock
              type="textarea"
              reset={reset}
              dataIn={values.establishment}
              required={false}
              valid={valid.current.establishment}
              onHandleGlobals={handleGlobals}
            ></LanguageBlock>
            <Row className="justify-content-md-left mx-2 pl-2 my-4 pt-2">
              <label className="ml-0 mr-5 pr-5 mt-2 ">
                <h5
                  style={{
                    minWidth: "140px",
                    color: "green",
                  }}
                >
                  <FormattedMessage
                    id={`src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.spokenLanguages`}
                  />
                  {" *"}
                </h5>
              </label>
              <LanguageRating
                img={france}
                reset={reset}
                dataIn={values.frenchLevel}
                required={false}
                l0={5}
                l1={range(19, 24)}
                onHandleGlobals={handleGlobals}
              ></LanguageRating>
              <LanguageRating
                img={uk}
                reset={reset}
                dataIn={values.englishLevel}
                required={false}
                l0={5}
                l1={range(19, 24)}
                onHandleGlobals={handleGlobals}
              ></LanguageRating>
              <LanguageRating
                img={germany}
                reset={reset}
                dataIn={values.germanLevel}
                required={false}
                l0={5}
                l1={range(19, 24)}
                onHandleGlobals={handleGlobals}
              ></LanguageRating>
              <LanguageRating
                img={spain}
                reset={reset}
                dataIn={values.spanishLevel}
                l0={5}
                l1={range(19, 24)}
                onHandleGlobals={handleGlobals}
              ></LanguageRating>
            </Row>
            <LanguageBlock
              type="textarea"
              reset={reset}
              dataIn={values.infosAdditional}
              required={false}
              valid={valid.current.infosAdditional}
              onHandleGlobals={handleGlobals}
            ></LanguageBlock>
            {typeof images !== "undefined" && Object.keys(images).length > 0 ? (
              <Images
                reset={reset}
                dataIn={images}
                onHandleGlobals={handleGlobals}
              ></Images>
            ) : null}
          </Container>
        </Card>
      </>
    )
  );
}
export default AnnounceForm;
