import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {FormattedMessage, useIntl} from "react-intl";
import {translate} from "../../../services/httpGoogleServices.js";
import {Helmet} from "react-helmet";
import Joi from "joi";
import {useValidator} from "react-joi";
import {passwordSchema} from "../common/validation/JoiSchemas.js";
import {resetPassword} from "../../../services/httpUsers.js";

function FormRecover() {
  const {id, token} = useParams();
  const intl = useIntl();
  const lang = intl.locale;
  const schema = Joi.object({
    password: passwordSchema(intl, 3, 10),
    checkPassword: passwordSchema(intl, 3, 10),
  });
  const {state, setData, validate} = useValidator({
    initialData: {
      password: "",
      checkPassword: "",
    },
    schema: schema,
    explicitCheck: {
      password: true,
      checkPassword: true,
    },
    validationOptions: {
      abortEarly: true,
    },
  });
  const [alert, setAlert] = useState(null);
  const [disabled, setDisabled] = useState(null);
  useEffect(() => {
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
        document.getElementById("pwd_recover_submit").click();
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
      [e.target.id]: e.target.value,
    }));
  }
  function validateForm() {
    if (state.$all_source_errors.length > 0) return false;
    if (state.$data.password !== state.$data.checkPassword) {
      setAlert(
        <div className="alert alert-danger">
          <div className="text-center w-100">
            <FormattedMessage id="src.components.reglog.LogForm.checkPasswordFail" />
          </div>
        </div>
      );
      return false;
    }
    setAlert(null);
    return true;
  }
  async function handleSubmit() {
    const res = await resetPassword(id, token, state.$data.password);
    if (res.data.statusCode >= 400 && res.data.statusCode <= 500) {
      setAlert(
        <div className="alert alert-danger">
          <div className="text-center w-100">
            {lang === "en"
              ? res.data.description
              : await translate({text: res.data.description, lang})}
            {/*message sent back from API*/}
          </div>
        </div>
      );
      if (res.data.statusCode >= 500) return;
    } else {
      setAlert(
        <div className="alert alert-success text-center w-100">
          {lang === "en" ? res.data : await translate({text: res.data, lang})}
          {/*message sent back from API*/}
        </div>
      );
      setTimeout(() => {
        window.close();
      }, 2000);
    }
  }
  return (
    <div
      className="container"
      style={{marginTop: "50px", marginBottom: "400px"}}
    >
      <FormattedMessage id="metaData.recoverPassword.title">
        {(text) => (
          <Helmet>
            <title>{text}</title>
          </Helmet>
        )}
      </FormattedMessage>
      <FormattedMessage id="metaData.recoverPassword.description">
        {(text) => (
          <Helmet>
            <meta name="description" content={text} />
          </Helmet>
        )}
      </FormattedMessage>
      <div className="row mt-5">
        <div className="col-4">
          <p className="text-center">
            <FormattedMessage id="src.components.reglog.LogForm.pleaseEnterPassword" />
          </p>
          <label className="text-muted" htmlFor="signupInputEmail1">
            <FormattedMessage id="src.components.reglog.LogForm.password" />
          </label>
          <div className="input-group with-focus">
            <input
              id="password"
              className="form-control "
              type="password"
              autoComplete="current-password"
              onChange={handleChange}
            />
          </div>
          {state.$errors.password.length > 0 ? (
            <div className="alert alert-danger">
              {state.$errors.password.map((data) => data.$message).join(",")}
            </div>
          ) : null}
          <label className="text-muted mt-3" htmlFor="signupInputEmail1">
            <FormattedMessage id="src.components.reglog.LogForm.checkPassword" />
          </label>
          <div className="input-group with-focus">
            <input
              id="checkPassword"
              className="form-control"
              type="password"
              autoComplete="current-password"
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
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <div
            id="pwd_recover_submit"
            className="btn btn-block btn-success btn-default mt-3 "
            disabled={disabled}
            onClick={handleSubmit}
          >
            <FormattedMessage id="src.components.reglog.LogForm.reinitialize" />
          </div>
          {alert ? alert : null}
        </div>
      </div>
    </div>
  );
}

export default FormRecover;
