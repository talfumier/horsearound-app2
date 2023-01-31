import {useState, useEffect} from "react";
import {useResizeDetector} from "react-resize-detector";
import {FormattedMessage, useIntl} from "react-intl";
import {Row, Col} from "react-bootstrap";
import Translate from "./Translate.jsx";
import {translate} from "../../../../../services/httpGoogleServices.js";
import {alert} from "../../validation.js";
import {isEven} from "../../../utils/utilityFunctions.js";

function LanguageBlock({
  type,
  nested = false,
  reset,
  dataIn,
  required,
  valid,
  onHandleGlobals,
}) {
  const {width, height, ref} = useResizeDetector();
  const {locale, formatMessage} = useIntl();
  const langs = ["en", "fr"];
  const order = langs.indexOf(locale);
  const name = dataIn.name;
  const [start, setStart] = useState({en: 1, fr: 1});
  const [value, setValue] = useState(null);
  const [warning, setWarning] = useState({en: null, fr: null});
  useEffect(() => {
    let data = null;
    if (typeof reset !== "undefined")
      data = isEven(reset) ? dataIn.data.default : dataIn.data.saved;
    else data = dataIn.data;
    //setValue(data);
    Object.keys(data).map((lang) => {
      try {
        handleChange(lang, data[lang], 1); //set value state, update validation & warning upon reset change
        setWarning({en: false, fr: false});
      } catch (error) {} //missing .en or .fr property in data
    });
  }, [reset]);
  function handleChange(lang, val, cs = 0) {
    setStart((data) => ({
      ...data,
      [lang]: 0,
    }));
    setValue((data) => ({
      ...data,
      [lang]: val,
    }));
    const result = alert(name, lang, val, required);
    if (cs === 0)
      setWarning({
        ...warning,
        [lang]: result,
      });
    onHandleGlobals("valid", result.props.obj);
    if (cs === 0) onHandleGlobals("value", [name, lang, val]);
  }
  function handleClear(cs) {
    let lang = null;
    if (cs === "lh") lang = langs[order];
    else lang = langs[order === 0 ? 1 : 0];
    handleChange(lang, "");
  }
  async function handleTranslate(cs) {
    let lang = null,
      text = null;
    if (cs === "lh") {
      lang = langs[order];
      text = value[langs[order === 0 ? 1 : 0]];
    } else {
      lang = langs[order === 0 ? 1 : 0];
      text = value[langs[order]];
    }
    await translate({text, lang}).then((translated) => {
      handleChange(lang, translated);
    });
  }
  return (
    value && (
      <Row className="justify-content-md-center">
        <Col md="1.7">
          <label className="mx-0 mt-4 px-0 pt-4">
            <h5
              style={{
                whiteSpace: "pre-wrap",
                minWidth: "120px",
                color:
                  (valid[langs[order]] && valid[langs[order === 0 ? 1 : 0]]) ||
                  !required
                    ? "green"
                    : "red",
              }}
            >
              <FormattedMessage
                id={`src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.${name}`}
              />
              {required ? " *" : null}
            </h5>
          </label>
        </Col>
        <Col md={`${!nested ? "5" : "4"}`}>
          <center>
            <h5>{`${langs[order]}${required ? " *" : ""}`}</h5>
          </center>
          {type === "text" ? (
            <>
              <input
                type="text"
                id={langs[order]}
                ref={ref}
                className="form-control mt-2"
                onChange={(e) => {
                  handleChange(e.target.id, e.target.value);
                }}
                value={value[langs[order]]}
                placeholder={
                  !nested
                    ? formatMessage({
                        id: `src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.${name}PH`,
                      })
                    : null
                }
                style={{
                  borderColor:
                    valid[langs[order]] || !required ? "green" : "red",
                  borderRadius: "5px",
                }}
              ></input>
              <i
                className="fa fa-trash fa-lg "
                style={{
                  position: "absolute",
                  cursor: " pointer",
                  color: "#7aa095",
                  left: (typeof width !== "undefined" ? width : 50) + 15,
                  top: "45px",
                  borderRadius: "5px",
                }}
                onClick={() => {
                  handleClear("lh");
                }}
              ></i>
            </>
          ) : (
            <>
              <textarea
                type="text"
                id={langs[order]}
                ref={ref}
                rows={!nested ? 8 : 3}
                className="form-control mt-2"
                onChange={(e) => {
                  handleChange(e.target.id, e.target.value);
                }}
                value={value[langs[order]]}
                placeholder={
                  !nested
                    ? formatMessage({
                        id: `src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.${name}PH`,
                      })
                    : null
                }
                style={{
                  borderColor:
                    valid[langs[order]] || !required ? "green" : "red",
                  borderRadius: "5px",
                }}
              ></textarea>
              <i
                className="fa fa-trash fa-lg "
                style={{
                  position: "absolute",
                  cursor: " pointer",
                  color: "#7aa095",
                  left: (typeof width !== "undefined" ? width : 50) + 15,
                  top: "45px",
                }}
                onClick={() => {
                  handleClear("lh");
                }}
              ></i>
            </>
          )}
          {start[langs[order]] === 0 && required && warning[langs[order]]}
        </Col>
        <Col md="auto" className="pb-0 pt-3 mt-4">
          <Translate onHandleTranslate={handleTranslate}></Translate>
        </Col>
        <Col md={`${!nested ? "5" : "4"}`}>
          <center>
            <h5>{`${langs[order === 0 ? 1 : 0]}${required ? " *" : ""}`}</h5>
          </center>
          {type === "text" ? (
            <>
              <input
                type="text"
                id={langs[order === 0 ? 1 : 0]}
                className="form-control mt-2"
                onChange={(e) => {
                  handleChange(e.target.id, e.target.value);
                }}
                value={value[langs[order === 0 ? 1 : 0]]}
                style={{
                  borderColor:
                    valid[langs[order === 0 ? 1 : 0]] || !required
                      ? "green"
                      : "red",
                }}
              ></input>
              <i
                className="fa fa-trash fa-lg "
                style={{
                  position: "absolute",
                  cursor: " pointer",
                  color: "#7aa095",
                  left: (typeof width !== "undefined" ? width : 50) + 15,
                  top: "45px",
                }}
                onClick={() => {
                  handleClear("rh");
                }}
              ></i>
            </>
          ) : (
            <>
              <textarea
                type="text"
                rows={!nested ? 8 : 3}
                id={langs[order === 0 ? 1 : 0]}
                className="form-control mt-2"
                onChange={(e) => {
                  handleChange(e.target.id, e.target.value);
                }}
                value={value[langs[order === 0 ? 1 : 0]]}
                style={{
                  borderColor:
                    valid[langs[order === 0 ? 1 : 0]] || !required
                      ? "green"
                      : "red",
                }}
              ></textarea>
              <i
                className="fa fa-trash fa-lg "
                style={{
                  position: "absolute",
                  cursor: " pointer",
                  color: "#7aa095",
                  left: (typeof width !== "undefined" ? width : 50) + 15,
                  top: "45px",
                }}
                onClick={() => {
                  handleClear("rh");
                }}
              ></i>
            </>
          )}
          {start[langs[order === 0 ? 1 : 0]] === 0 &&
            required &&
            warning[langs[order === 0 ? 1 : 0]]}
        </Col>
      </Row>
    )
  );
}
export default LanguageBlock;
