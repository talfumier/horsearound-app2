const Joi = require("joi").extend(require("@joi/date"));

export function stringSchema(intl) {
  return Joi.string()
    .required()
    .error((errors) => {
      errors.map((err) => {
        switch (err.code) {
          case "string.pattern.base":
          case "string.base":
          case "string.empty":
            err.message = intl.formatMessage({
              id: "src.components.bookingPage.StepOneForm.checkStringFail",
            });
            break;
        }
        return err;
      });
      return errors;
    });
}
export function emailSchema(intl, min, max, pattern) {
  return Joi.string()
    .email({
      tlds: {allow: false},
    })
    .required()
    .error((errors) => {
      errors.map((err) => {
        switch (err.code) {
          case "string.base":
          case "string.empty":
          case "string.email":
            err.message = intl.formatMessage({
              id: "src.components.reglog.LogForm.validEmail",
            });
            break;
        }
        return err;
      });
      return errors;
    });
}
export function passwordSchema(intl, min, max, pattern) {
  return Joi.string()
    .min(min)
    .max(max)
    .required()
    .error((errors) => {
      errors.map((err) => {
        switch (err.code) {
          case "string.base":
          case "string.empty":
            err.message = intl.formatMessage({
              id: "src.components.reglog.LogForm.emptyPassword",
            });
            break;
          case "string.min":
            err.message = `${intl.formatMessage({
              id: "src.components.reglog.LogForm.minPassword",
            })} ${err.local.limit} ${intl.formatMessage({
              id: "src.components.reglog.LogForm.char",
            })}`;
            break;
          case "string.max":
            err.message = `${intl.formatMessage({
              id: "src.components.reglog.LogForm.maxPassword",
            })} ${err.local.limit} ${intl.formatMessage({
              id: "src.components.reglog.LogForm.char",
            })}`;
            break;
          default:
        }
        return err;
      });
      return errors;
    });
}
export function dateSchema(intl) {
  return Joi.date()
    .format("DD.MM.YYYY")
    .required()
    .error((errors) => {
      errors.map((err) => {
        switch (err.code) {
          case "any.required":
          case "date.base":
          case "date.format":
            err.message = intl.formatMessage({
              id: "src.components.bookingPage.StepOneForm.checkDateFail",
            });
            break;
        }
        return err;
      });
      return errors;
    });
}
