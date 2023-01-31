import {FormattedMessage} from "react-intl";
import {
  requiredValid,
  positiveValid,
  emailValid,
  positionValid,
} from "../common/validation/Validators.js";

export const validate = (field, val) => {
  switch (field) {
    case "email":
      return emailValid(val);
    case "nbDays":
    case "participantMin":
    case "participantMax":
    case "ageMinParticipant":
    case "ageMaxParticipant":
    case "childUnderOf":
      return positiveValid(val, true, true, "int"); //int > 0
    case "nbNights":
    case "priceAdulte":
    case "priceChild":
    case "priceAccompagnateur":
      return positiveValid(val, false, true, "int"); //int >= 0
    case "lat":
      return positionValid("lat", val);
    case "lng":
      return positionValid("lng", val);
    default:
      return requiredValid(val);
  }
};
export const alert = (field, lang, val, required = false) => {
  let cs = 0,
    valid = null,
    obj = [];
  if (field === "form") cs = 1;
  else {
    valid = validate(field, val);
    if (!valid[0]) {
      cs = 2;
      obj =
        lang === null
          ? [field, required ? false : true]
          : [field, lang, required ? false : true]; //used for updating globals
    } else obj = lang === null ? [field, true] : [field, lang, true]; //cs=1 in this case
  }
  if (cs === 0) return <div obj={obj}></div>;
  return (
    <div
      className="d-flex alert alert-danger text-center"
      style={{
        fontSize: "1.4rem",
        border: "1px solid",
        borderColor: "red",
      }}
      obj={obj}
    >
      {cs === 2 ? (
        valid[1]
      ) : (
        <strong>
          <FormattedMessage id="src.components.bookingPage.StepOneForm.form" />
        </strong>
      )}
    </div>
  );
};
