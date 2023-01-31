import {useState, useEffect, useContext} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {Card, Tooltip} from "@mui/material";
import {useCookies} from "react-cookie";
import InputMask from "react-input-mask";
import _ from "lodash";
import {
  requiredValid,
  emailValid,
  dateValid,
} from "../../../../common/validation/Validators";
import UserContext from "../../../../common/context/UserContext.js";
import {decodeJWT} from "../../../../../../services/httpUsers.js";
import {patchUser} from "../../../../../../services/httpUsers.js";
import {successFailure} from "../../../../member/announces/form/AnnounceForm.jsx";
import {errorHandlingToast} from "../../../../../../services/utilsFunctions.js";

function PersonalInfo({
  type,
  dataIn,
  locks,
  cbSame,
  onHandleDataOut,
  onHandleCbSame,
  onHandleTabsCheck,
}) {
  //type=0 > personal, type=1 > billing
  const {locale, formatMessage} = useIntl();
  const userContext = useContext(UserContext);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const {_id} = decodeJWT(cookies.user);
  const fields = Object.keys(dataIn);
  const [start, setStart] = useState(getInitialStart());
  const [value, setValue] = useState({});
  const [formValid, setFormValid] = useState(false);
  function getInitialStart() {
    const obj = {};
    fields.map((field) => {
      obj[field] = 1;
    });
    return obj;
  }
  useEffect(() => {
    setValue(dataIn);
  }, []);
  useEffect(() => {
    setFormValid(validateForm());
  }, [value]);
  function handleChange(e) {
    setStart((data) => ({
      ...data,
      [e.target.id]: 0,
    }));
    setValue((data) => ({
      ...data,
      [e.target.id]: e.target.value,
    }));
    onHandleDataOut(type, e.target.id, e.target.value);
    if (type === 1 && cbSame === true) onHandleCbSame(false); //set cbSame to false as soon as there is a change in any input
  }
  function prepareBody() {
    const body = {}; //compares saved profile data (dataIn) vs value state (includes changes made by user)
    Object.keys(start).map((field) => {
      if (start[field] === 0) {
        //0 >>> means user changed value
        switch (field) {
          case "address":
          case "city":
          case "postcode":
          case "country":
            body.address = {
              address: value.address,
              city: value.city,
              postcode: value.postcode,
              country: value.country,
            };
            break;
          case "telephone":
            body.phone = value.telephone;
            break;
          case "birthdate":
          case "birthplace":
            break;
          default:
            body[field] = value[field];
        }
      }
    });
    console.log("body", body);
    return body;
  }
  async function handleProfileUpdate() {
    const body = prepareBody(),
      keys = Object.keys(body),
      abortController = new AbortController();
    if (keys.length > 0) {
      const res = await patchUser(
        _id,
        body,
        cookies.user,
        abortController.signal
      );
      const bl = !(await errorHandlingToast(res, locale, false));
      successFailure("PATCH", [bl], formatMessage, "UpdateProfile");
      if (bl) {
        const user = userContext.user;
        keys.map((key) => {
          user[key] = body[key]; //update user context
        });
        userContext.onHandleUser(user);
        setStart(getInitialStart());
      }
    }
  }
  const validate = (field) => {
    switch (field) {
      case "email":
        return emailValid(value[field]);
      case "birthdate":
        return dateValid(value[field]);
      default:
        return requiredValid(value[field]);
    }
  };
  function validateForm() {
    const bl = [];
    fields.map((field) => {
      switch (field) {
        case "birthdate":
        case "birthplace":
        case "email":
        case "telephone":
          if (type === 1) break;
        default:
          bl.push(validate(field)[0]);
      }
    });
    const result = bl.indexOf(false) === -1;
    onHandleTabsCheck(type + 2, result);
    return result;
  }
  const alert = (field) => {
    let cs = 0,
      valid = null;
    if (field === "form") cs = 1;
    else {
      valid = validate(field);
      if (!valid[0]) cs = 2;
    }
    if (cs === 0) return <div></div>;
    return (
      <div
        className="alert alert-danger m-0 p-2 text-center"
        style={{fontSize: "1.3rem"}}
      >
        {cs === 2 ? (
          valid[1]
        ) : (
          //cs=1 >>> form message
          <strong>
            <FormattedMessage id="src.components.bookingPage.StepOneForm.form" />
          </strong>
        )}
      </div>
    );
  };
  return (
    Object.keys(start).length > 0 &&
    Object.keys(value).length > 0 && (
      <Card
        variant="outlined"
        style={{
          marginTop: type === 0 ? "20px" : "0",
          paddingBottom: "5px",
          width: "95%",
          borderWidth: type === 0 ? "1px" : "0",
        }}
      >
        <div className="container">
          <div className="row align-items-start mt-3">
            <div className="col-3">
              <label>
                <h6 style={{margin: 0}}>
                  <FormattedMessage id="src.components.bookingPage.StepOneForm.lastName" />
                  {" *"}
                </h6>
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                disabled={locks}
                onChange={handleChange}
                value={value.lastName}
              ></input>
              {start.lastName === 0 && alert("lastName")}
            </div>
            <div className="col-2">
              <label>
                <h6 style={{margin: 0}}>
                  <FormattedMessage id="src.components.bookingPage.StepOneForm.firstName" />
                  {" *"}
                </h6>
              </label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                disabled={locks}
                onChange={handleChange}
                value={value.firstName}
              ></input>
              {start.firstName === 0 && alert("firstName")}
            </div>
            {type === 0 ? (
              <div className="col-2">
                <label>
                  <h6 style={{margin: 0}}>
                    <FormattedMessage id="src.components.bookingPage.StepTwoContent.birthdate" />
                    {" *"}
                  </h6>
                </label>
                <InputMask
                  type="text"
                  className="form-control"
                  id="birthdate"
                  disabled={locks}
                  onChange={handleChange}
                  placeholder={formatMessage({
                    id: "src.components.bookingPage.StepTwoContent.dateformat",
                  })}
                  mask="99.99.9999"
                  maskChar="_"
                  value={value.birthdate}
                ></InputMask>
                {start.birthdate === 0 && alert("birthdate")}
              </div>
            ) : null}
            {type === 0 ? (
              <div className="col-3">
                <label>
                  <h6 style={{margin: 0}}>
                    <FormattedMessage id="src.components.bookingPage.StepTwoContent.birthplace" />
                    {" *"}
                  </h6>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="birthplace"
                  disabled={locks}
                  onChange={handleChange}
                  value={value.birthplace}
                ></input>
                {start.birthplace === 0 && alert("birthplace")}
              </div>
            ) : null}
          </div>
          <div className="row align-items-start mt-3">
            <div className="col-3">
              <label>
                <h6 style={{margin: 0}}>
                  <FormattedMessage id="src.components.bookingPage.StepOneForm.address" />
                  {" *"}
                </h6>
              </label>
              <textarea
                type="text"
                className="form-control"
                id="address"
                disabled={locks}
                onChange={handleChange}
                value={value.address}
                rows="4"
              ></textarea>
              {start.address === 0 && alert("address")}
            </div>
            <div className="col-3">
              <label>
                <h6 style={{margin: 0}}>
                  <FormattedMessage id="src.components.bookingPage.StepOneForm.city" />
                  {" *"}
                </h6>
              </label>
              <input
                type="text"
                className="form-control"
                id="city"
                disabled={locks}
                onChange={handleChange}
                value={value.city}
              ></input>
              {start.city === 0 && alert("city")}
              <div>
                <label className="mt-2 pt-1">
                  <h6 style={{margin: 0}}>
                    <FormattedMessage id="src.components.bookingPage.StepOneForm.country" />
                    {" *"}
                  </h6>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="country"
                  disabled={locks}
                  onChange={handleChange}
                  value={value.country}
                ></input>
                {start.country === 0 && alert("country")}
              </div>
            </div>
            <div className="col-2">
              <label>
                <h6 style={{margin: 0}}>
                  <FormattedMessage id="src.components.bookingPage.StepOneForm.postcode" />
                  {" *"}
                </h6>
              </label>
              <input
                type="text"
                className="form-control"
                id="postcode"
                disabled={locks}
                onChange={handleChange}
                value={value.postcode}
              ></input>
              {start.postcode === 0 && alert("postcode")}
            </div>
            <div className="row align-items-start mt-3"></div>
          </div>
          {type === 0 ? (
            <div className="row align-items-start mt-3">
              <div className="col-3">
                <label>
                  <h6 style={{margin: 0}}>
                    <FormattedMessage id="src.components.bookingPage.StepOneForm.email" />
                    {" *"}
                  </h6>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  disabled={locks}
                  onChange={handleChange}
                  value={value.email}
                ></input>
                {start.email === 0 && alert("email")}
              </div>
              <div className="col-2">
                <label>
                  <h6 style={{margin: 0}}>
                    <FormattedMessage id="src.components.bookingPage.StepOneForm.telephone" />
                    {" *"}
                  </h6>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="telephone"
                  disabled={locks}
                  onChange={handleChange}
                  value={value.telephone}
                ></input>
                {start.telephone === 0 && alert("telephone")}
              </div>
              <div className="col-1">
                <Tooltip
                  title={formatMessage({
                    id: `src.components.bookingPage.StepOneForm.updateProfileTT`,
                  })}
                  arrow
                >
                  <i
                    className="fa fa-user fa-3x mt-4 pt-2"
                    style={{
                      color: "#7AA095",
                      border: "0",
                      cursor: "pointer",
                    }}
                    onClick={handleProfileUpdate}
                  ></i>
                </Tooltip>
              </div>
            </div>
          ) : null}
          {!formValid ? (
            <div className="col-2 mt-4 pt-2 ">{alert("form")}</div>
          ) : null}
        </div>
      </Card>
    )
  );
}

export default PersonalInfo;
