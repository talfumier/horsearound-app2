import {useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {Tooltip} from "@mui/material";
import {Container, Row} from "react-bootstrap";
import {parse} from "date-fns";
import ContainerToast from "../../common/toastSwal/ContainerToast.jsx";
import {FormattedMessage, useIntl} from "react-intl";
import _ from "lodash";
import {useCookies} from "react-cookie";
import FontAwesome from "react-fontawesome";
import {
  getUser,
  patchUser,
  checkUserDelete,
  deleteUser,
  postNewsLetter,
  patchNewsLetter,
  deleteNewsLetter,
} from "../../../../services/httpUsers.js";
import {errorHandlingToast} from "../../../../services/utilsFunctions.js";
import {successFailure} from "../announces/form/AnnounceForm.jsx";
import {toastError} from "../../common/toastSwal/ToastMessages";
import {SwalOkCancel} from "../../common/toastSwal/SwalOkCancel.jsx";
import {isEven} from "../../utils/utilityFunctions.js";
import SimpleText from "../announces/form/SimpleText.jsx";
import Address from "./Address.jsx";
import empty from "./default.json";
import defaultValid from "./defaultValid.json";
import {validate, alert} from "../validation.js";
import {processPwdReset} from "../../logIn&Out/FormLogin.jsx";
import {getFormattedDate} from "../../utils/utilityFunctions.js";
import {handleLogOut} from "../../logIn&Out/FormLogin.jsx";
import SponsoredBy from "../corporate/SponsoredBy.jsx";
import UserContext from "../../common/context/UserContext.js";
import ParticipantsInfo from "./participants/ParticipantsInfo.jsx";

export async function deleteConditionsSatisfied(
  userType,
  userId,
  cookies,
  formatMessage,
  signal,
  cs = "profile"
) {
  let bl = null;

  let models = [
      ...(cs === "profile" && userType === "pro"
        ? ["announces", "companies"]
        : []),
      ...(cs === "profile" ? ["comments"] : []),
      "bookings",
      ...(cs === "profile" ? ["conversations"] : []),
      // "newsletters",  user deletion authorised if the only user related record is the newsletter subscription
    ],
    n = models.length;
  for (let i = 0; i < n; i++) {
    bl = await checkUserDelete(userId, models[i], cookies.user, signal);
    if (!bl.data) {
      const msg = `${formatMessage({
        id: `src.components.memberPage.tabs.annonces.details.AddAnnounceForm.warning3`,
      })}'${models[i]}' !`;
      return [bl.data, msg];
    } else if (i === n - 1) return [true];
  }
}
let globals = {},
  dataIn = {};
function MyProfile({user, onHandleDirty}) {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const {_id: userId, type: userType, email: userEmail} = user;
  const {locale, formatMessage} = useIntl();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [spin1, setSpinner1] = useState(false);
  const [spin2, setSpinner2] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [values, setValues] = useState({});
  const [valid, setValid] = useState({
    current: {},
    default: {},
    saved: {},
  });
  const [reset, setReset] = useState(1); //1 >>> saved data (edit case)
  const [pwdAlert, setPwdAlert] = useState(null);
  const [aboNL, setAboNL] = useState(false);
  const keys = Object.keys(empty);
  function initGlobals() {
    keys.map((key) => {
      globals[key] = {init: null};
    });
  }
  const [trashConditions, setTrashConditions] = useState({
    cond: [false, ""],
    color: "#ccc",
  });
  async function setDeleteConditions(signal) {
    const result = await deleteConditionsSatisfied(
      userType,
      userId,
      cookies,
      formatMessage,
      signal
    );
    setTrashConditions({cond: result, color: result[0] ? "#7AA095" : "#ccc"});
  }
  useEffect(() => {
    setSpinner1(true);
    initGlobals();
    const valide = _.cloneDeep(defaultValid);
    async function loadData(signal) {
      dataIn = _.cloneDeep(empty);
      let res = null,
        bl = null,
        date = null;
      if (Object.keys(userContext.user).length > 0) {
        res = {data: userContext.user};
        bl = true;
      } else {
        res = await getUser(userId, cookies.user, signal);
        bl = !(await errorHandlingToast(res, locale, false));
      }
      if (bl) {
        keys.map((key) => {
          dataIn[key].data.saved =
            typeof res.data[key] !== "undefined" ? res.data[key] : {};
          switch (key) {
            case "address":
              ["address", "postcode", "city", "country"].map((item) => {
                valide[key][item] = validate(
                  key,
                  dataIn[key].data.saved[item]
                )[0];
              });
              break;
            case "participantsInfo":
              if (user.type !== "pro" && user.role !== "ADMIN") {
                if (res.data[key].length === 0) dataIn[key].data.saved = [];
                //participantsInfo default value >>> [null]
                else {
                  res.data[key].map((info, idx) => {
                    dataIn[key].data.saved[idx] = {
                      ...info,
                      birthdate: getFormattedDate(info.birthdate, "dd.MM.yyyy"),
                    };
                  });
                }
              }
              valide[key] = true;
              break;
            case "birthdate":
              if (user.type === "pro" || user.role === "ADMIN") {
                valide[key] = true;
                break;
              }
              date = getFormattedDate(dataIn[key].data.saved, "dd.MM.yyyy");
              dataIn[key].data.saved =
                typeof date !== "undefined" ? date : dataIn[key].data.default; //'undefined' returned from getFormattedDate() when birthdate missing

            default:
              valide[key] = !valide[key]
                ? validate(key, dataIn[key].data.saved)[0]
                : true;
          }
        });
      }
      setValid({
        current: _.cloneDeep(valide),
        default: _.cloneDeep(defaultValid),
        saved: _.cloneDeep(valide),
      });
      setValues(dataIn);
      setAboNL(dataIn.aboNewsletter.data[isEven(reset) ? "default" : "saved"]);
      setSpinner1(false);
    }
    const abortController = new AbortController(),
      signal = abortController.signal;
    loadData(signal);
    setDeleteConditions(signal);
    return () => {
      abortController.abort(); //clean-up code after component has unmounted
    };
  }, [userId]);
  function handleClearAllUndo(cs) {
    initGlobals(); //resets globals (contains all user's modified data) to empty properties
    let rst = _.clone(reset);
    if (cs === 0) {
      rst += isEven(rst) ? 2 : 1; //even number, clear all >>> default values
      Object.keys(values).map((key) => {
        if (!_.isEqual(values[key].data.saved, values[key].data.default))
          globals[key] = values[key].data.default;
      });
    } else {
      rst += isEven(rst) ? 1 : 2; //odd number, undo >>> saved values
      setValues(dataIn);
      onHandleDirty(false);
    }

    const valide = {...valid}; //resets valid after clear or restore all
    valide.current = _.cloneDeep(isEven(rst) ? valide.default : valide.saved);
    setValid(valide);
    setReset(rst);
  }
  function handleGlobals(cs, val) {
    if (cs === "value") {
      delete globals[val[0]].init;
      globals[val[0]] = val[1];
      onHandleDirty(
        Object.keys(prepareBody(globals, false)).length > 0 ? true : false
      );
      // console.log("globals", globals);
    }
    if (cs === "valid") {
      const valide = {...valid};
      valide.current[val[0]] = val[1];
      setValid(valide);
      setFormValid(JSON.stringify(valide.current).indexOf(false) === -1);
    }
  }
  function prepareBody(modified, prt) {
    let body = {}, //compares saved data (dataIn.data.saved) vs modified (changes made by user)
      flg = null,
      date = null;
    keys.map((key) => {
      flg = Object.keys(modified[key]);
      if (flg.length === 1 && flg.indexOf("init") === 0) {
        //do nothing
      } else {
        switch (key) {
          case "participantsInfo":
            modified[key].map((part, idx) => {
              date = parse(part.birthdate, "dd.MM.yyyy", new Date());
              if (!isNaN(date.getTime())) modified[key][idx].birthdate = date;
            });
            if (!_.isEqual(modified[key], dataIn[key].data.saved))
              body[key] = modified[key];
            break;
          default:
            if (modified[key] != dataIn[key].data.saved) {
              if (key !== "birthdate") body[key] = modified[key];
              else {
                date = parse(modified[key], "dd.MM.yyyy", new Date());
                if (!isNaN(date.getTime())) body[key] = date;
              }
            }
        }
      }
    });
    if (prt) console.log("body", body);
    return body;
  }
  async function handleSave() {
    setSpinner2(true);
    let bl = [false, false];
    const abortController = new AbortController();
    let modified = _.cloneDeep(globals), //current user's modified values
      res = null,
      actualChange = -1;
    const body = prepareBody(modified, true),
      keys = Object.keys(body);
    if (keys.length > 0) {
      actualChange += 1;
      res = await patchUser(userId, body, cookies.user, abortController.signal);
      bl[0] = !(await errorHandlingToast(res, locale, false));
      if (bl[0]) {
        let cs = -1;
        switch (body.aboNewsletter) {
          case true: //changed from false to true >>> create newsletter
            res = await postNewsLetter(
              keys.indexOf("email") !== -1
                ? body.email
                : values.email.data.saved,
              abortController.signal
            );
            cs += 1;
            break;
          case false: //changed from true to false >>> delete newsletter
            res = await deleteNewsLetter(
              values.email.data.saved, //email currently in the newsletter document (database)
              cookies.user,
              abortController.signal
            );
            cs += 1;
            break;
          default: //no change (undefined) >>> update newsletter in case of email change when 'aboNewsletter'=true
            if (
              values.aboNewsletter.data.saved &&
              keys.indexOf("email") !== -1
            ) {
              res = await patchNewsLetter(
                values.email.data.saved, //old email currently in the newsletter
                {email: body.email}, //updated email
                cookies.user,
                abortController.signal
              );
              cs += 1;
            }
        }
        if (cs >= 0) bl[1] = !(await errorHandlingToast(res, locale, false));
        else bl[1] = true;
        const user = userContext.user;
        if (Object.keys(user).length > 0) {
          keys.map((key) => {
            user[key] = body[key]; //update user context
          });
          userContext.onHandleUser(user);
        }
      }
    } else bl[1] = true;
    if (bl.indexOf(false) === -1) {
      const data = _.cloneDeep(values); //update values state properties with saved data
      const keys = Object.keys(body);
      if (keys.indexOf("birthdate") !== -1)
        body.birthdate = getFormattedDate(body.birthdate, "dd.MM.yyyy");
      if (keys.indexOf("participantsInfo") !== -1) {
        body.participantsInfo.map((part, idx) => {
          body.participantsInfo[idx].birthdate = getFormattedDate(
            part.birthdate,
            "dd.MM.yyyy"
          );
        });
      }
      Object.keys(body).map((key) => {
        data[key].data.saved = _.clone(body[key]);
        dataIn[key].data.saved = data[key].data.saved; //update dataIn properties with saved data
      });
      setValues(data);
      setDeleteConditions(); //update delete conditions following save operation
      onHandleDirty(false);
      initGlobals();
    }
    if (actualChange >= 0) {
      successFailure("PATCH", bl, formatMessage, "UpdateProfile");
      if (bl.indexOf(false) === -1) handleClearAllUndo(1); //set reset to odd number to display saved data
    }
    setSpinner2(false);
    abortController.abort();
  }
  async function handleDelete(id, email) {
    const result = await SwalOkCancel(
      formatMessage,
      "src.components.memberPage.tabs.annonces.MyAnnonces.delete"
    );
    if (result === "cancel") return;

    const abortController = new AbortController(),
      signal = abortController.signal;
    deleteNewsLetter(email, cookies.user, signal); //cancel newsletter subscription, if any
    const res = await deleteUser(id, cookies.user, signal);
    const bl = !(await errorHandlingToast(res, locale, false));
    successFailure("DELETE", [bl], formatMessage, "UpdateProfile");
    if (bl) {
      onHandleDirty(false);
      setTimeout(() => {
        handleLogOut(removeCookie, navigate, userContext);
      }, 3000);
    }
    abortController.abort();
  }
  function handleChange() {
    const bl = _.clone(aboNL);
    setAboNL(!bl);
    handleGlobals("value", ["aboNewsletter", !bl]);
  }
  return (
    <div
      className="d-flex justify-content-center "
      style={{
        paddingTop: "5%",
        marginLeft: "15%",
      }}
    >
      <ContainerToast></ContainerToast>
      <div
        className="d-flex justify-content-between "
        style={{
          position: "fixed",
          left: 0,
          top: "17.2%",
          minWidth: "100%",
          zIndex: 2,
          backgroundColor: "#F3F3F3",
          border: "1px solid",
          borderColor: "green",
          borderRadius: "10px",
          height: "80px",
        }}
      >
        {Object.keys(values).length > 0 &&
          Object.keys(valid.current).length > 0 && (
            <div>
              <div className="d-flex ml-4 pt-1">
                <SimpleText
                  dataIn={{
                    name: "type",
                    data: values.type.data.saved,
                  }}
                  required={false}
                  disabled={true}
                  trash={false}
                  valid={valid.current.type}
                  wl="50px"
                  col="3"
                ></SimpleText>
                <SimpleText
                  dataIn={{
                    name: "role",
                    data: values.role.data.saved,
                  }}
                  required={false}
                  disabled={true}
                  trash={false}
                  valid={valid.current.role}
                  wl="80px"
                  col="3"
                ></SimpleText>
                <div
                  className="mt-2 pt-4"
                  style={{
                    maxHeight: 80,
                    position: "fixed",
                    left: "28%",
                  }}
                >
                  <button
                    className="btn btn-success btn-default"
                    onClick={async () => {
                      setPwdAlert(
                        await processPwdReset(
                          window.location.origin,
                          values.email.data.saved,
                          locale
                        )
                      );
                      setTimeout(() => {
                        setPwdAlert(null);
                      }, 3000);
                    }}
                  >
                    <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.passwordChange" />
                  </button>
                  <div className={{maxHeight: 20, overflow: "visible"}}>
                    {pwdAlert ? pwdAlert : null}
                  </div>
                </div>
              </div>
              <div className="d-flex ml-4">
                <SimpleText
                  dataIn={{
                    name: "status",
                    data: values.status.data.saved,
                  }}
                  required={false}
                  disabled={true}
                  trash={false}
                  valid={valid.current.status}
                  wl="50px"
                  col="3"
                ></SimpleText>
                <SimpleText
                  dataIn={{
                    name: "registration_date",
                    data: getFormattedDate(
                      values.registration_date.data.saved,
                      "dd.MM.yyyy"
                    ),
                  }}
                  required={false}
                  disabled={true}
                  trash={false}
                  valid={valid.current.registration_date}
                  wl="80px"
                  col="3"
                ></SimpleText>
              </div>
            </div>
          )}
        <div className="mt-0 mb-3" style={{marginRight: "15%"}}>
          <div className="my-3 mx-0 p-0">
            {!formValid ? alert("form") : null}
          </div>
        </div>
        <div className="mt-0  mt-3 p-3">
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
                  color: "#7AA095",
                  border: "0",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleSave();
                }}
              ></i>
            </Tooltip>
            <Tooltip
              title={formatMessage({
                id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.clearAll",
              })}
              arrow
            >
              <i
                className="fa fa-eraser fa-2x ml-2 mr-4"
                style={{
                  color: "#7AA095",
                  border: "0",
                  cursor: "pointer",
                }}
                onClick={() => {
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
                className="fa fa-undo fa-2x ml-2 mr-4"
                style={{
                  color: "#7AA095",
                  border: "0",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleClearAllUndo(1);
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
                  if (!trashConditions.cond[0]) {
                    toastError(trashConditions.cond[1]);
                    return;
                  }
                  setSpinner2(true);
                  await handleDelete(
                    values._id.data.saved,
                    values.email.data.saved
                  );
                  setSpinner2(false);
                }}
              ></i>
            </Tooltip>
          </span>
        </div>
      </div>
      {Object.keys(values).length > 0 &&
        Object.keys(valid.current).length > 0 && (
          <Container style={{minWidth: "200%"}}>
            <Row
              className={`justify-content-md-left pl-1 ${
                user.type !== "pro" && user.role !== "ADMIN" ? "mt-2" : "mt-4"
              } pt-2`}
            >
              <SimpleText
                reset={reset}
                dataIn={values.lastName}
                required={true}
                valid={valid.current.lastName}
                onHandleGlobals={handleGlobals}
                wl="90px"
              ></SimpleText>
              <SimpleText
                reset={reset}
                dataIn={values.firstName}
                required={true}
                valid={valid.current.firstName}
                onHandleGlobals={handleGlobals}
                w="70%"
                wl="100px"
              ></SimpleText>
              <SimpleText
                reset={reset}
                dataIn={values.email}
                required={true}
                valid={valid.current.email}
                onHandleGlobals={handleGlobals}
                w="100%"
                wl="50px"
              ></SimpleText>
              <SimpleText
                reset={reset}
                dataIn={values.phone}
                required={true}
                valid={valid.current.phone}
                onHandleGlobals={handleGlobals}
                w="75%"
                wl="90px"
              ></SimpleText>
            </Row>
            <Row
              className={`justify-content-md-left pl-1 ${
                user.type !== "pro" && user.role !== "ADMIN" ? "mt-2" : "mt-4"
              } pt-2`}
            >
              <Address
                reset={reset}
                dataIn={values.address}
                valid={valid.current.address}
                onHandleGlobals={handleGlobals}
                wl={{
                  address: "90px",
                  city: "50px",
                  postcode: "100px",
                  country: "90px",
                }}
              ></Address>
            </Row>
            {user.type !== "pro" && user.role !== "ADMIN" && (
              <>
                <Row className="justify-content-md-left pl-1 mt-2 pt-2">
                  <SimpleText
                    reset={reset}
                    type="inputMask"
                    mask={{mask: "99.99.9999", maskChar: "_"}}
                    ph={formatMessage({
                      id: "src.components.bookingPage.StepTwoContent.dateformat",
                    })}
                    trash={false}
                    dataIn={values.birthdate}
                    required={true}
                    valid={valid.current.birthdate}
                    onHandleGlobals={handleGlobals}
                    col="1"
                    w="95%"
                    wl="90px"
                    wl_max="60px"
                  ></SimpleText>
                  <SimpleText
                    reset={reset}
                    dataIn={values.birthplace}
                    required={false}
                    valid={valid.current.birthplace}
                    onHandleGlobals={handleGlobals}
                    w="90%"
                    wl="40px"
                  ></SimpleText>
                  <SimpleText
                    reset={reset}
                    dataIn={values.occupation}
                    required={false}
                    valid={valid.current.occupation}
                    onHandleGlobals={handleGlobals}
                    w="90%"
                  ></SimpleText>
                </Row>
                <Row className="justify-content-md-left pl-1 mt-2 pt-2">
                  <SimpleText
                    type="select"
                    options={[
                      [
                        "M",
                        formatMessage({
                          id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.male",
                        }),
                      ],
                      [
                        "F",
                        formatMessage({
                          id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.female",
                        }),
                      ],
                      ["", ""],
                    ]}
                    reset={reset}
                    trash={false}
                    dataIn={values.sex}
                    required={false}
                    valid={valid.current.sex}
                    onHandleGlobals={handleGlobals}
                    col="1"
                    w="95%"
                    wl="90px"
                  ></SimpleText>
                  <SimpleText
                    reset={reset}
                    dataIn={values.height}
                    required={false}
                    valid={valid.current.height}
                    onHandleGlobals={handleGlobals}
                    col="1"
                    w="60%"
                    wl="75px"
                  ></SimpleText>
                  <label className="mt-2 ml-0 pl-0 mr-0">
                    <h5
                      style={{
                        color: "black",
                        fontWeight: 500,
                        marginLeft: -50,
                      }}
                    >
                      {"cm"}
                    </h5>
                  </label>
                  <SimpleText
                    reset={reset}
                    dataIn={values.weight}
                    required={false}
                    valid={valid.current.weight}
                    onHandleGlobals={handleGlobals}
                    col="1"
                    w="60%"
                    wl="75px"
                  ></SimpleText>
                  <label className="mt-2 ml-0 pl-0 mr-0">
                    <h5
                      style={{
                        color: "black",
                        fontWeight: 500,
                        marginLeft: -50,
                      }}
                    >
                      {"Kg"}
                    </h5>
                  </label>{" "}
                  <SimpleText
                    type="textarea"
                    reset={reset}
                    dataIn={values.diet}
                    required={false}
                    w="120%"
                    wl_max="80px"
                    valid={valid.current.diet}
                    ph={formatMessage({
                      id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.dietPH",
                    })}
                    onHandleGlobals={handleGlobals}
                  ></SimpleText>
                  <SimpleText
                    type="textarea"
                    reset={reset}
                    dataIn={values.treatment}
                    required={false}
                    mleft="3.5%"
                    w="120%"
                    wl_max="80px"
                    valid={valid.current.treatment}
                    ph={formatMessage({
                      id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.treatmentPH",
                    })}
                    onHandleGlobals={handleGlobals}
                  ></SimpleText>
                </Row>
                <hr
                  style={{
                    position: "relative",
                    top: "-5px",
                    width: "90.5%",
                    align: "center",
                    height: "1px",
                    backgroundColor: "black",
                    marginBottom: 4,
                  }}
                ></hr>
                <Row
                  className="justify-content-md-left pl-1 mt-0 pt-0 "
                  style={{height: 30}}
                >
                  {userType === "particulier" ? (
                    <div className="d-flex justify-content-md-left pl-1 mt-1">
                      <SponsoredBy
                        reset={reset}
                        dataIn={values.code_parrainage_used}
                        valid={valid.current.code_parrainage_used}
                        onHandleGlobals={handleGlobals}
                      ></SponsoredBy>
                    </div>
                  ) : null}
                  <div
                    className="justify-content-md-left"
                    style={{marginLeft: 150}}
                  >
                    <label className="mt-1 mr-3 pr-1">
                      <h5
                        style={{
                          color: "green",
                          minWidth: "10%",
                        }}
                      >
                        <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.aboNewsletter" />
                      </h5>
                    </label>
                    <input
                      type="checkbox"
                      className="ml-0 pl-0 mr-4 mb-3 pt-4"
                      style={{
                        width: 15,
                        height: 15,
                        marginTop: 15,
                        cursor: "pointer",
                      }}
                      checked={aboNL}
                      onChange={handleChange}
                    ></input>
                  </div>
                </Row>
                <hr
                  style={{
                    position: "relative",
                    top: "5px",
                    width: "90.5%",
                    align: "center",
                    height: "1px",
                    backgroundColor: "black",
                  }}
                ></hr>
                <ParticipantsInfo
                  reset={reset}
                  dataIn={values.participantsInfo}
                  onHandleGlobals={handleGlobals}
                ></ParticipantsInfo>
              </>
            )}
          </Container>
        )}
    </div>
  );
}

export default MyProfile;
