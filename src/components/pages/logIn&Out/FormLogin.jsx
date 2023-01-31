import {useState, useEffect, useContext} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {useNavigate} from "react-router-dom";
import Joi from "joi";
import {useValidator} from "react-joi";
import {useCookies} from "react-cookie";
import {deleteCookies} from "./deleteCookies.js";
import {translate} from "../../../services/httpGoogleServices.js";
import {emailSchema, passwordSchema} from "../common/validation/JoiSchemas";
import {
  login,
  register,
  postCompany,
  forgotPassword,
  decodeJWT,
} from "../../../services/httpUsers.js";
import {
  SwalOkCancelWithTimer,
  formatTimer,
} from "../common/toastSwal/SwalOkCancel.jsx";
import UserContext from "../common/context/UserContext.js";
import {getUser} from "../../../services/httpUsers.js";
import {errorHandlingToast} from "../../../services/utilsFunctions.js";

export async function processPwdReset(userId, locale) {
  let msg = null;
  const res = await forgotPassword(userId);
  if (res.data.statusCode >= 400 && res.data.statusCode <= 500) {
    msg = (
      <div className="alert alert-danger">
        <div className="text-center w-100">
          {locale === "en"
            ? res.data.description
            : await translate({text: res.data.description, locale})}
          {/*message sent back from API*/}
        </div>
      </div>
    );
    if (res.data.statusCode >= 500) return;
  } else if (res.status === 200)
    msg = (
      <div className="alert alert-success text-center w-100">
        {locale === "en" ? res.data : await translate({text: res.data, locale})}
        {/*message sent back from API*/}
      </div>
    );
  return msg;
}
let timer = null;
export function handleLogOut(removeCookie, navigate, userContext) {
  if (navigate) {
    if (window.location.href.indexOf("/member") !== -1)
      navigate("/"); //case where log out is performed on MemberPage
    else
      try {
        document.getElementById("formBookingCloseButton").click(); //case where log out is performed on opened FormBooking modal
        navigate("/announces");
      } catch (error) {}
  }
  clearInterval(timer);
  try {
    document.getElementById("horseAround_navbar_timer").innerHTML = "";
  } catch (error) {}
  deleteCookies(removeCookie, ["user"]);
  userContext.onHandleUser({}); //clear data in UserContext
}
export async function loadUserdata(userContext, id, token, locale) {
  const abortController = new AbortController();
  const res = await getUser(id, token, abortController.signal);
  if (!(await errorHandlingToast(res, locale, false))) {
    userContext.onHandleUser(res.data[0]); //update UserContext at login time
    return res.data[0];
  } else abortController.abort();
}
export function setLoginTimeOut(
  formatMessage,
  setCookie,
  removeCookie,
  navigate,
  exp,
  userContext,
  id,
  token,
  locale
) {
  function runTimer(closeInSeconds) {
    const elt = document.getElementById("horseAround_navbar_timer");
    timer = setInterval(() => {
      closeInSeconds--;
      if (closeInSeconds < 0) clearInterval(timer);
      elt.innerHTML = `${formatTimer(
        closeInSeconds >= 0 ? closeInSeconds : 0
      )}`;
    }, 1000);
  }
  loadUserdata(userContext, id, token, locale); //update UserContext at login time
  setTimeout(() => {
    SwalOkCancelWithTimer(
      formatMessage,
      "src.components.reglog.LogForm.tokenExpired1",
      "src.components.reglog.LogForm.tokenExpired2",
      300 //300 >>> 5 mns
    ).then((resolve, reject) => {
      switch (resolve[0]) {
        case "cancel":
          setTimeout(() => {
            handleLogOut(removeCookie, navigate, userContext);
          }, resolve[1] * 1000); //time remaining before token actually expires
          runTimer(resolve[1]);
          break;
        case "ok": //use the spare token stored in local storage that has a 30mn longer expiry time
          const spare = window.localStorage.getItem("spareToken");
          const spare_exp = decodeJWT(spare).exp; //seconds since EPOCH
          setCookie("user", spare, {
            path: "/",
            expires: new Date((spare_exp + resolve[1]) * 1000),
          });
          console.log(
            "remains",
            resolve[1],
            "spare cookie expires",
            new Date((spare_exp + resolve[1]) * 1000),
            "timeout",
            (spare_exp + resolve[1]) * 1000 - Date.now()
          );
          window.localStorage.removeItem("spareToken");
          const timeout = (spare_exp + resolve[1]) * 1000 - Date.now();
          setTimeout(() => {
            handleLogOut(removeCookie, navigate, userContext);
          }, timeout);
          runTimer(Math.trunc(timeout / 1000));
      }
    });
  }, exp * 1000 - Date.now() - 300 * 1000); //300 >>> 5 mns
}
function FormLogin({onClose}) {
  const intl = useIntl();
  const {locale, formatMessage} = useIntl();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const currentUser = cookies.user ? decodeJWT(cookies.user) : null;
  const schema = Joi.object({
    creation: Joi.boolean().required().valid(true, false), //false for standard login, true for account creation
    forgotPwd: Joi.boolean().required().valid(true, false), //false for standard login, true for password reset
    userID: emailSchema(intl),
    type: Joi.alternatives().conditional(".creation", {
      is: true,
      then: Joi.string(),
      otherwise: Joi.any().optional(),
    }),
    password: Joi.alternatives().conditional(".forgotPwd", {
      is: true,
      then: passwordSchema(intl, 3, 10),
      otherwise: Joi.any().optional(),
    }),
    checkPassword: Joi.alternatives().conditional(".creation", {
      is: true,
      then: passwordSchema(intl, 3, 10),
      otherwise: Joi.any().optional(),
    }),
    checkTerms: Joi.alternatives().conditional(".creation", {
      is: true,
      then: Joi.boolean(),
      otherwise: Joi.any().optional(),
    }),
  });
  const {state, setData, validate} = useValidator({
    initialData: {
      creation: false,
      forgotPwd: false,
      userID: cookies.user ? currentUser.email : null,
      type: "particulier",
      password: "",
      checkPassword: "",
      checkTerms: false,
    },
    schema: schema,
    explicitCheck: {
      creation: false,
      forgotPwd: false,
      userID: true,
      type: true,
      password: true,
      checkPassword: true,
      checkTerms: true,
    },
    validationOptions: {
      abortEarly: true,
    },
  });
  const [close, setClose] = useState(false);
  const [alert, setAlert] = useState(null);
  const [disabled, setDisabled] = useState(null);
  useEffect(() => {
    if (cookies.user) {
      //sign-out
      setDisabled(false);
      return;
    }
    if (disabled === null) {
      //initial render
      setDisabled(true);
      return;
    }
    setDisabled(!validateForm());
  }, [state.$data]);
  useEffect(() => {
    function click(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        document.getElementById("login_submit").click();
      }
    }
    window.addEventListener("keydown", click);
    return () => {
      window.removeEventListener("keydown", click);
    };
  }, []);
  function handleChange(e) {
    setData((data) => ({
      ...data,
      [e.target.id]:
        e.target.id === "checkTerms" ? !state.$data.checkTerms : e.target.value,
    }));
  }
  function validateForm() {
    if (state.$all_source_errors.length > 0) return false;
    if (
      state.$data.creation &&
      state.$data.password !== state.$data.checkPassword
    ) {
      setAlert(
        <div className="alert alert-danger">
          <div className="text-center w-100">
            <FormattedMessage id="src.components.reglog.LogForm.checkPasswordFail" />
          </div>
        </div>
      );
      return false;
    }
    if (state.$data.creation && state.$data.checkTerms === false) {
      setAlert(
        <div className="alert alert-danger">
          <div className="text-center w-100">
            <FormattedMessage id="src.components.reglog.LogForm.checkTermsFail" />
          </div>
        </div>
      );
      return false;
    }
    setAlert(null);
    return true;
  }
  async function handleSubmit() {
    if (!cookies.user) {
      //login case
      const res = !state.$data.creation
        ? await login(state.$data.userID, state.$data.password)
        : await register(
            state.$data.userID,
            state.$data.type,
            state.$data.password
          );
      if (res.data.statusCode >= 400 && res.data.statusCode <= 500) {
        setAlert(
          <div className="alert alert-danger">
            <div className="text-center w-100">
              {/* <FormattedMessage id="src.components.reglog.LogForm.unknownUserID1" /> */}
              {locale === "en"
                ? res.data.description
                : await translate({text: res.data.description, locale})}
              {/*message sent back from API*/}
            </div>
          </div>
        );
        if (res.data.statusCode >= 500) return;
      } else {
        let bl = true;
        if (state.$data.type === "pro") {
          console.log(res);
          await postCompany(
            {
              id_user: res.data.data[0]._id,
              code_parrainage: res.data.data[0]._id.slice(-10),
            },
            res.headers["x-auth-token"],
            null
          );
          bl = !(await errorHandlingToast(res, locale, false));
        }
        const {exp, _id} = decodeJWT(res.headers["x-auth-token"]); //exp is expressed in seconds since EPOCH
        setCookie("user", res.headers["x-auth-token"], {
          path: "/",
          expires: new Date(exp * 1000),
        });
        window.localStorage.setItem(
          "spareToken",
          res.headers["x-auth-sparetoken"]
        );
        setLoginTimeOut(
          formatMessage,
          setCookie,
          removeCookie,
          navigate,
          exp,
          userContext,
          _id,
          res.headers["x-auth-token"],
          locale
        );
        bl &&
          setAlert(
            <div className="alert alert-success text-center w-100">
              {locale === "en"
                ? res.data.message
                : await translate({text: res.data.message, locale})}
              {/*message sent back from API*/}
            </div>
          );
        handleClose();
      }
    }
    //sign-out case
    else {
      setAlert(
        <div className="alert alert-success text-center w-100">
          <FormattedMessage id="src.components.reglog.LogForm.userDisConnected" />
        </div>
      );
      handleLogOut(removeCookie, navigate, userContext);
      handleClose();
    }
  }
  function handleClose() {
    setClose(true);
    onClose();
  }
  async function handleForgotPassword() {
    setDisabled(null);
    setData((data) => ({
      ...data,
      forgotPwd: true,
    }));
    setAlert(await processPwdReset(state.$data.userID, locale));
  }
  function handleCreateAccount() {
    setDisabled(null);
    setData((data) => ({
      ...data,
      creation: true,
    }));
    setAlert(null);
  }
  return (
    <div className="col-auto mt-5 mr-3 " style={{width: "400px"}}>
      <div className="form-group">
        <label htmlFor="userID">
          <FormattedMessage id="src.components.reglog.LogForm.userID" />
        </label>
        <input
          id="userID"
          type="text"
          className="form-control"
          onChange={handleChange}
          defaultValue={cookies.user ? currentUser.email : null}
        />
        {state.$errors.userID.length > 0 ? (
          <div className="alert alert-danger">
            {state.$errors.userID.map((data) => data.$message).join(",")}
          </div>
        ) : null}
      </div>
      {!close && state.$data.creation && (
        <div className="form-group">
          <label htmlFor="type">
            <FormattedMessage id="src.components.reglog.LogForm.type" />
          </label>
          <select
            id="type"
            type="text"
            className="form-control"
            defaultValue="particulier"
            onChange={handleChange}
          >
            <option value="particulier">
              {intl.formatMessage({
                id: "src.components.reglog.LogForm.particulier",
              })}
            </option>
            <option value="pro">
              {intl.formatMessage({
                id: "src.components.reglog.LogForm.pro",
              })}
            </option>
          </select>
          {state.$errors.type.length > 0 ? (
            <div className="alert alert-danger">
              {state.$errors.type.map((data) => data.$message).join(",")}
            </div>
          ) : null}
        </div>
      )}
      {!close && !cookies.user && (
        <div className="form-group">
          <label htmlFor="password">
            <FormattedMessage id="src.components.reglog.LogForm.password" />
          </label>
          <input
            id="password"
            type="password"
            className="form-control"
            onChange={handleChange}
          />
          {state.$errors.password.length > 0 ? (
            <div className="alert alert-danger">
              {state.$errors.password.map((data) => data.$message).join(",")}
            </div>
          ) : null}
        </div>
      )}
      {!close && state.$data.creation && (
        <>
          <div className="form-group">
            <label htmlFor="checkPassword">
              <FormattedMessage id="src.components.reglog.LogForm.checkPassword" />
            </label>
            <input
              id="checkPassword"
              type="password"
              className="form-control"
              onChange={handleChange}
            />
            {state.$errors.checkPassword.length > 0 ? (
              <div className="alert alert-danger">
                {state.$errors.checkPassword
                  .map((data) => data.$message)
                  .join(",")}
              </div>
            ) : null}
          </div>
          <div className="checkbox c-checkbox mt-0">
            <label>
              <input id="checkTerms" type="checkbox" onChange={handleChange} />
              <a href="/CGU-CGV" target="_blank">
                <FormattedMessage id="src.components.reglog.LogForm.termsLink" />
              </a>
            </label>
          </div>
        </>
      )}
      {!close && (
        <div className="form-group">
          <button
            id="login_submit"
            disabled={disabled}
            className="btn btn-success btn-default w-100"
            onClick={handleSubmit}
          >
            {!cookies.user ? (
              state.$data.creation ? (
                <FormattedMessage id="src.components.reglog.LogForm.register" />
              ) : (
                <FormattedMessage id="src.components.reglog.LogForm.signIn" />
              )
            ) : (
              <FormattedMessage id="src.components.reglog.LogForm.signOut" />
            )}
          </button>
        </div>
      )}
      {!close && !state.$data.creation && !cookies.user && (
        <div className="form-group">
          <p className="pt-4 text-center">
            <a onClick={handleForgotPassword}>
              <strong>
                <FormattedMessage id="src.components.reglog.LogForm.forgotPassword" />
              </strong>
            </a>
          </p>
          <p className="text-center">
            <a onClick={handleCreateAccount}>
              <strong>
                <FormattedMessage id="src.components.reglog.LogForm.noAccount" />
              </strong>
            </a>
          </p>
        </div>
      )}
      {alert ? alert : null}
    </div>
  );
}

export default FormLogin;
