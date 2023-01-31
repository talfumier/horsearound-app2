import axios from "axios";
import logger from "./logService";
import {toastError} from "../components/pages/common/toastSwal/ToastMessages.js";
import {FormattedMessage} from "react-intl";

axios.interceptors.response.use(null, (error) => {
  //catching unexpected errors globally
  const expectedErr =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (!expectedErr && error.message !== "canceled") {
    //canceled error coming from aborted data loading operations in order to avoid memory leak, no need to send alert message to the user
    //logger.log(error);
    try {
      toastError(
        <div style={{textAlign: "left"}}>
          <FormattedMessage id="user_msg.standard.errors.unexpected" />
          <br></br>
          <p style={{color: "red"}}>
            <FormattedMessage
              id="missing"
              defaultMessage={`${error.message}`}
            />
          </p>
        </div>
      );
    } catch (err) {
      //err raised by 2nd FormattedMessage > deliberately missing translation
    }
  }
  return Promise.reject(error);
});
function setJwt(jwt) {
  //axios.defaults.headers.post["x-auth-token"] =jwt;
  axios.defaults.headers.common["x-auth-token"] = jwt;
  axios.defaults.headers.post["Content-Type"] = "application/json";
  axios.defaults.headers.patch["Content-Type"] = "application/json";
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete,
  setJwt,
};
