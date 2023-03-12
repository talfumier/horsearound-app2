import validator from "validator";
import {FormattedMessage} from "react-intl";

export function requiredValid(value) {
  if (typeof value === "undefined") value = "";
  if (!value.toString().trim().length) {
    return [
      false,
      <FormattedMessage id="src.components.bookingPage.StepOneForm.checkStringFail"></FormattedMessage>,
    ];
  }
  return [true, null];
}
export function positiveValid(value, nonZero, pos, type) {
  //type=int, float
  if (!value || typeof value === "undefined") value = "";
  if (!value.toString().trim().length) {
    return [
      false,
      <FormattedMessage id="src.components.bookingPage.StepOneForm.checkStringFail"></FormattedMessage>,
    ];
  }
  value = Number(value);
  if (isNaN(value))
    return [
      false,
      <FormattedMessage id="src.components.bookingPage.StepOneForm.checkNumberFail"></FormattedMessage>,
    ];
  if (nonZero && value === 0)
    return [
      false,
      <FormattedMessage id="src.components.bookingPage.StepOneForm.check0Fail"></FormattedMessage>,
    ];
  if (pos && value < 0)
    return [
      false,
      <FormattedMessage id="src.components.bookingPage.StepOneForm.check>0Fail"></FormattedMessage>,
    ];
  if (type === "int" && !Number.isInteger(value))
    return [
      false,
      <FormattedMessage id="src.components.bookingPage.StepOneForm.checkIntFail"></FormattedMessage>,
    ];
  return [true, null];
}
export function positionValid(type, value) {
  if (typeof value === "undefined") value = "";
  if (!value.toString().trim().length) {
    return [
      false,
      <FormattedMessage id="src.components.bookingPage.StepOneForm.checkStringFail"></FormattedMessage>,
    ];
  }
  value = Number(value);
  if (isNaN(value))
    return [
      false,
      <FormattedMessage id="src.components.bookingPage.StepOneForm.checkNumberFail"></FormattedMessage>,
    ];
  switch (type) {
    case "lat":
      if (Math.abs(value) > 90)
        return [
          false,
          <FormattedMessage id="src.components.bookingPage.StepOneForm.checkLatFail"></FormattedMessage>,
        ];
      break;
    case "lng":
      if (Math.abs(value) > 180)
        return [
          false,
          <FormattedMessage id="src.components.bookingPage.StepOneForm.checkLngFail"></FormattedMessage>,
        ];
  }
  return [true, null];
}
export function emailValid(value) {
  if (typeof value === "undefined") value = "";
  if (!validator.isEmail(value)) {
    return [
      false,
      <FormattedMessage id="src.components.reglog.LogForm.validEmail"></FormattedMessage>,
    ];
  }
  return [true, null];
}
export function dateValid(value) {
  if (typeof value === "undefined") value = "";
  if (
    !validator.isDate(value, {
      format: "dd.MM.yyyy",
      delimiters: ["/", "-", "."],
    })
  ) {
    return [
      false,
      <FormattedMessage id="src.components.bookingPage.StepOneForm.checkDateFail"></FormattedMessage>,
    ];
  }
  return [true, null];
}
