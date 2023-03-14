import {useState, useEffect, useContext} from "react";
import {Tooltip} from "@mui/material";
import {Container, Row, Col} from "react-bootstrap";
import ContainerToast from "../../common/toastSwal/ContainerToast.jsx";
import {FormattedMessage, useIntl} from "react-intl";
import _ from "lodash";
import {useCookies} from "react-cookie";
import FontAwesome from "react-fontawesome";
import {
  getCompany,
  patchCompany,
  deleteCompany,
  checkCodeParrainage,
  getParrainageCounters,
} from "../../../../services/httpUsers.js";
import {errorHandlingToast} from "../../../../services/utilsFunctions.js";
import {successFailure} from "../announces/form/AnnounceForm.jsx";
import {toastError} from "../../common/toastSwal/ToastMessages";
import {SwalOkCancel} from "../../common/toastSwal/SwalOkCancel.jsx";
import {isEven} from "../../utils/utilityFunctions.js";
import SimpleText from "../announces/form/SimpleText.jsx";
import Address from "../profile/Address.jsx";
import empty from "./default.json";
import defaultValid from "./defaultValid.json";
import {validate, alert} from "../validation.js";
import SponsoredBy from "./SponsoredBy.jsx";
import Rib from "./Rib.jsx";
import Check from "./Check.jsx";
import {deleteConditionsSatisfied} from "../profile/MyProfile.jsx";
import ProContext from "../../common/context/ProContext.js";

let globals = {},
  dataIn = {};
function CorporateData({user, onHandleDirty, onHandleActionRequired}) {
  const {_id: userId, type: userType, email: userEmail} = user;
  const {locale, formatMessage} = useIntl();
  const proContext = useContext(ProContext);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [spin1, setSpinner1] = useState(false);
  const [spin2, setSpinner2] = useState(false);
  const [formValid, setFormValid] = useState(false);
  useEffect(() => {
    onHandleActionRequired([["corporate", !formValid]]);
  }, [formValid]);
  const [values, setValues] = useState({});
  const [valid, setValid] = useState({
    current: {},
    default: {},
    saved: {},
  });
  const [reset, setReset] = useState(1); //1 >>> saved data (edit case)
  const [trashConditions, setTrashConditions] = useState({
    cond: [false, ""],
    color: "#ccc",
  });
  const keys = Object.keys(empty);
  function initGlobals() {
    keys.map((key) => {
      globals[key] = {init: null};
    });
  }
  useEffect(() => {
    setSpinner1(true);
    initGlobals();
    const valide = _.cloneDeep(defaultValid);
    async function loadData(signal) {
      dataIn = _.cloneDeep(empty);
      const res = await getCompany(userId, signal);
      if (!(await errorHandlingToast(res, locale, false))) {
        keys.map((key) => {
          dataIn[key].data.saved =
            typeof res.data[key] !== "undefined" ? res.data[key] : {};
          switch (key) {
            case "id_user":
              dataIn[key].data.saved = res.data[key]._id;
              break;
            case "address":
              ["address", "postcode", "city", "country"].map((item) => {
                valide[key][item] = validate(
                  key,
                  dataIn[key].data.saved[item]
                )[0];
              });
              break;
            default:
              valide[key] = !valide[key]
                ? validate(key, dataIn[key].data.saved)[0]
                : true;
          }
        });
      } else {
        setSpinner1(false);
        return;
      }
      setValid({
        current: _.cloneDeep(valide),
        default: _.cloneDeep(defaultValid),
        saved: _.cloneDeep(valide),
      });
      setDeleteConditions(signal);
      dataIn = await setParrainageCounters(dataIn, signal);
      setValues(dataIn);
      setSpinner1(false);
    }
    const abortController = new AbortController(),
      signal = abortController.signal;
    loadData(signal);
    return () => {
      abortController.abort(); //clean-up code after component has unmounted
    };
  }, [userId]);
  async function setDeleteConditions(signal) {
    deleteConditionsSatisfied(
      userType,
      userId,
      cookies,
      formatMessage,
      signal,
      "company"
    ).then((resolve, reject) => {
      if (resolve)
        setTrashConditions({
          cond: resolve,
          color: resolve[0] ? "#7AA095" : "#ccc",
        });
    });
  }
  async function setParrainageCounters(dataIn, signal) {
    let bl = false,
      res = null;
    if (typeof dataIn.code_parrainage.data.saved !== "object") {
      res = await getParrainageCounters(
        dataIn.code_parrainage.data.saved,
        cookies.user,
        signal
      );
      bl = !(await errorHandlingToast(res, locale, false));
    }
    dataIn.code_parrainage_given = {
      name: "code_parrainage_given",
      data: {default: 0, saved: bl ? res.data.total : "-----"},
    };
    dataIn.code_parrainage_given_to_pro = {
      name: "code_parrainage_given_to_pro",
      data: {default: 0, saved: bl ? res.data.pro : "-----"},
    };
    return dataIn;
  }
  function handleClearAllUndo(cs) {
    initGlobals(); //resets globals (contains all user's modified data) to empty properties
    let rst = _.clone(reset),
      flg = -1;
    if (cs === 0) {
      rst += isEven(rst) ? 2 : 1; //even number, clear all >>> default values
      Object.keys(values).map((key) => {
        if (!_.isEqual(values[key].data.saved, values[key].data.default)) {
          flg += 1;
          globals[key] = values[key].data.default;
        }
      });
      if (flg >= 0) onHandleDirty(true);
    } else {
      //odd number, undo >>> saved values
      onHandleDirty(false);
      rst += isEven(rst) ? 1 : 2;
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
        Object.keys(prepareBody(globals)).length >= 0 ? true : false
      );
    }
    if (cs === "valid") {
      const valide = {...valid};
      valide.current[val[0]] = val[1];
      setValid(valide);
      setFormValid(JSON.stringify(valide.current).indexOf(false) === -1);
    }
  }
  function prepareBody(modified) {
    let body = {}, //compares saved data (dataIn) vs modified (changes made by user)
      flg = null;
    keys.map((key) => {
      switch (key) {
        default:
          flg = Object.keys(modified[key]);
          if (flg.length === 1 && flg.indexOf("init") === 0) break;
          if (modified[key] != dataIn[key]) body[key] = modified[key];
          else if (body[key]) delete body[key]; //no change but modified[key] may have been created before (changes and come back to saved values)
      }
    });
    console.log("body", body);
    return body;
  }
  async function handleSave() {
    //save operation exclusively done by PATCH, since company is created by ADMIN when validating the pro user (status from 'PENDING' to 'ACTIVE')
    //and updates are carried-out by pro
    setSpinner2(true);
    let bl = false;
    const abortController = new AbortController(),
      signal = abortController.signal;
    let modified = _.cloneDeep(globals), //current user's modified values
      res = null,
      actualChange = -1;
    const body = prepareBody(modified),
      keys = Object.keys(body);
    if (
      keys.indexOf("code_parrainage_used") !== -1 &&
      body.code_parrainage_used.length > 0
    ) {
      if (body.code_parrainage_used === values.code_parrainage.data.saved) {
        toastError(
          formatMessage({
            id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.code_parrainageNotValid",
          })
        );
        setSpinner2(false);
        return;
      }
      res = await checkCodeParrainage(
        body.code_parrainage_used,
        cookies.user,
        signal
      );
      bl = !(await errorHandlingToast(res, locale, false));
      if (!bl) {
        setSpinner2(false);
        return;
      }
    }
    if (keys.length > 0) {
      actualChange += 1;
      res = await patchCompany(userId, body, cookies.user, signal);
      bl = !(await errorHandlingToast(res, locale, false));
      if (bl) {
        const data = _.cloneDeep(values); //update values state properties with saved data
        Object.keys(body).map((key) => {
          data[key].data.saved = _.clone(body[key]);
        });
        setValues(data);
        onHandleDirty(false);
        initGlobals();
        proContext.onHandlePro(userId, null); //Remove pro[userId] in proContext since it is no longr up to date
      }
      if (actualChange >= 0) {
        successFailure("PATCH", [bl], formatMessage, "UpdateCompany");
        handleClearAllUndo(1); //set reset to odd number to display saved data
      }
      setSpinner2(false);
    }
  }
  async function handleDelete() {
    const result = await SwalOkCancel(
      formatMessage,
      "src.components.memberPage.tabs.annonces.MyAnnonces.delete"
    );
    if (result === "cancel") return;

    const abortController = new AbortController(),
      signal = abortController.signal;
    const res = await deleteCompany(userId, cookies.user, signal);
    const bl = !(await errorHandlingToast(res, locale, false));
    if (bl) {
      handleClearAllUndo(0);
      onHandleDirty(false);
    }
    successFailure("DELETE", [bl], formatMessage, "UpdateCompany");
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
          // marginTop: 0,
          backgroundColor: "#F3F3F3",
          border: "1px solid",
          borderColor: "green",
          borderRadius: "10px",
          height: "80px",
        }}
      >
        <div className="mt-0 mb-3" style={{marginLeft: "45%"}}>
          <div className="my-3 mx-0 p-0">
            {!formValid ? alert("form") : null}
          </div>
        </div>
        <div className="mt-0  mt-3 p-3">
          <div
            className="d-flex align-items-center"
            style={{verticalAlign: "middle"}}
          >
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
                  await handleDelete();
                  setSpinner2(false);
                }}
              ></i>
            </Tooltip>
          </div>
        </div>
      </div>
      {Object.keys(values).length > 0 &&
        Object.keys(valid.current).length > 0 && (
          <Container
            style={{
              minWidth: "170%",
              overflowY: "auto",
              overflowX: "hidden",
              height: "530px",
            }}
          >
            <Row className="justify-content-md-left pl-1 mt-4 pt-0">
              <label className="ml-2 mr-2">
                <h5 style={{fontSize: "1.6rem", fontWeight: "bolder"}}>
                  <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.corpLabel" />
                </h5>
              </label>
            </Row>
            <Row className="justify-content-md-left pl-1 mt-4 pt-2">
              <SimpleText
                reset={reset}
                dataIn={values.corpName}
                required={true}
                valid={valid.current.corpName}
                onHandleGlobals={handleGlobals}
                wl="125px"
              ></SimpleText>
              <SimpleText
                reset={reset}
                dataIn={values.siren}
                required={true}
                valid={valid.current.siren}
                onHandleGlobals={handleGlobals}
                w="70%"
                wl="100px"
              ></SimpleText>
              <SimpleText
                reset={reset}
                dataIn={values.siret}
                required={true}
                valid={valid.current.siret}
                onHandleGlobals={handleGlobals}
                w="70%"
                wl="80px"
              ></SimpleText>
              <SimpleText
                reset={reset}
                dataIn={values.assuranceNumber}
                required={true}
                valid={valid.current.assuranceNumber}
                onHandleGlobals={handleGlobals}
                w="70%"
                wl="80px"
              ></SimpleText>
            </Row>
            <Row className="justify-content-md-left pl-1 mt-4 pt-4">
              <Address
                reset={reset}
                dataIn={values.address}
                valid={valid.current.address}
                onHandleGlobals={handleGlobals}
                wl={{
                  address: "125px",
                  city: "80px",
                  postcode: "100px",
                  country: "80px",
                }}
              ></Address>
            </Row>
            <Row className="justify-content-md-left pl-1 mt-4 pt-4">
              <SponsoredBy
                reset={reset}
                dataIn={values.code_parrainage_used}
                valid={valid.current.code_parrainage_used}
                onHandleGlobals={handleGlobals}
              ></SponsoredBy>
            </Row>
            <Row className="justify-content-md-left pl-1 ">
              <label className="ml-2 mr-2">
                <h5 style={{fontSize: "1.6rem", fontWeight: "bolder"}}>
                  <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.bankLabel" />
                </h5>
              </label>
            </Row>
            <Row
              className="d-flex justify-content-md-left ml-4 pl-3 mt-1"
              style={{fontWeight: "normal"}}
            >
              <div className="d-flex justify-content-left pl-1 mt-1">
                <label className="mt-4 pt-4 ml-4 mr-2">
                  <h5
                    className="mt-4 ml-4 mr-0 pr-0 "
                    style={{
                      color:
                        valid.current.bankCode &&
                        valid.current.guichetCode &&
                        valid.current.numberAccount &&
                        valid.current.keyAccount &&
                        valid.current.deviseAccount &&
                        valid.current.domiciliation
                          ? "green"
                          : "red",
                    }}
                  >
                    <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.rib" />
                    {" *"}
                  </h5>
                </label>
                <Rib
                  reset={reset}
                  dataIn={{
                    bankCode: values.bankCode,
                    guichetCode: values.guichetCode,
                    numberAccount: values.numberAccount,
                    keyAccount: values.keyAccount,
                    deviseAccount: values.deviseAccount,
                    domiciliation: values.domiciliation,
                  }}
                  valid={{
                    bankCode: valid.current.bankCode,
                    guichetCode: valid.current.guichetCode,
                    numberAccount: valid.current.numberAccount,
                    keyAccount: valid.current.keyAccount,
                    deviseAccount: valid.current.deviseAccount,
                    domiciliation: valid.current.domiciliation,
                  }}
                  onHandleGlobals={handleGlobals}
                ></Rib>
              </div>
            </Row>
            <Row
              className="d-flex justify-content-md-left ml-4 pl-3 mt-1"
              style={{fontWeight: "normal"}}
            >
              <div className="d-flex justify-content-left ml-4 mt-3 w-100">
                <SimpleText
                  reset={reset}
                  dataIn={values.iban}
                  required={true}
                  valid={valid.current.iban}
                  onHandleGlobals={handleGlobals}
                  w="300px"
                  wl="55px"
                ></SimpleText>
                <SimpleText
                  reset={reset}
                  dataIn={values.bic}
                  required={true}
                  valid={valid.current.bic}
                  onHandleGlobals={handleGlobals}
                  w="150px"
                  wl="30px"
                ></SimpleText>
              </div>
            </Row>
            <Row
              className="d-flex justify-content-md-left ml-4 pl-3 mt-1"
              style={{fontWeight: "normal"}}
            >
              <div className="d-flex justify-content-left pl-1 mt-1">
                <label className="mt-4 pt-4 ml-4 mr-0 pr-0">
                  <h5
                    className="mt-4 ml-4 "
                    style={{
                      color:
                        valid.current.checkOrder && valid.current.checkAdress
                          ? "green"
                          : "red",
                    }}
                  >
                    <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.check" />
                    {" *"}
                  </h5>
                </label>
                <Check
                  reset={reset}
                  dataIn={{
                    checkOrder: values.checkOrder,
                    checkAdress: values.checkAdress,
                    corpName: {
                      data: values.corpName.data.saved,
                      pending: globals.corpName,
                    },
                    address: {
                      data: values.address.data.saved,
                      pending: globals.address,
                    },
                  }}
                  valid={{
                    checkOrder: valid.current.checkOrder,
                    checkAdress: valid.current.checkAdress,
                  }}
                  onHandleGlobals={handleGlobals}
                ></Check>
              </div>
            </Row>
            <Row className="justify-content-md-left pl-1 mt-4 pt-4">
              <label className="ml-2 mr-2">
                <h5 style={{fontSize: "1.6rem", fontWeight: "bolder"}}>
                  <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.sponsorLabel" />
                </h5>
              </label>
              <input
                type="text"
                className="form-control px-0 ml-4 mt-2 w-50 "
                style={{
                  textAlign: "center",
                  borderRadius: "5px",
                }}
                readOnly={true}
                placeholder={formatMessage({
                  id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.code_parrainagePH",
                })}
              ></input>
            </Row>
            <Row
              className="d-flex justify-content-md-left ml-4 pl-3 mt-1"
              style={{fontWeight: "normal"}}
            >
              <div className="d-flex justify-content-left ml-4 mt-3 mb-4 pb-4 w-100">
                <SimpleText
                  reset={reset}
                  dataIn={values.code_parrainage}
                  required={false}
                  disabled={true}
                  trash={false}
                  onHandleGlobals={handleGlobals}
                  col="1"
                ></SimpleText>
                <SimpleText
                  reset={reset}
                  dataIn={values.code_parrainage_given}
                  required={false}
                  disabled={true}
                  trash={false}
                  onHandleGlobals={handleGlobals}
                  col="1"
                  w="50%"
                ></SimpleText>
                <SimpleText
                  reset={reset}
                  dataIn={values.code_parrainage_given_to_pro}
                  required={false}
                  disabled={true}
                  trash={false}
                  onHandleGlobals={handleGlobals}
                  col="1"
                  mleft="-70px"
                  w="50%"
                  wl="20px"
                ></SimpleText>
                <label className="mx-0 px-0">
                  <h5 style={{marginLeft: "-60px"}}>
                    <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.code_parrainage_to_pro1" />
                  </h5>
                </label>
              </div>
            </Row>
          </Container>
        )}
    </div>
  );
}

export default CorporateData;
