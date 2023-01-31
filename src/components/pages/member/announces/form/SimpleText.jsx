import {useState, useEffect} from "react";
import {useResizeDetector} from "react-resize-detector";
import {FormattedMessage, useIntl} from "react-intl";
import {Col} from "react-bootstrap";
import {alert} from "../../validation.js";
import {isEven} from "../../../utils/utilityFunctions.js";

function SimpleText({
  reset,
  dataIn,
  required,
  disabled = false,
  type = "text",
  label = true,
  valid = null,
  col = 2,
  trash = true,
  id = false,
  w = null,
  mleft = null,
  wl = null,
  lt = false,
  ph = null,
  rows = "3",
  onHandleGlobals,
}) {
  const {width, height, ref} = useResizeDetector();
  const name = dataIn.name;
  const [color, setColor] = useState(
    disabled ? "green" : valid[name] ? "green" : "red"
  );
  const [lineThrough, setLineThrough] = useState(false);
  const [start, setStart] = useState(1);
  const [value, setValue] = useState("");
  const [warning, setWarning] = useState(false);
  useEffect(() => {
    let data = null;
    if (typeof reset === "undefined") data = dataIn.data;
    else {
      data = isEven(reset) ? dataIn.data.default : dataIn.data.saved;
      if (data instanceof Object) data = dataIn.data.default;
    }
    if (disabled) setValue(data);
    else handleChange(data, 1); //set value state, update validation upon reset change
    setWarning(false);
  }, [dataIn, reset]);
  useEffect(() => {
    function changeEvent() {
      setLineThrough(document.getElementById(lt).value == 1 ? false : true);
    }
    if (lt) {
      changeEvent(); //initial lineThrough setting
      document.getElementById(lt).addEventListener("change", changeEvent);
    }
    return () => {
      try {
        document.getElementById(lt).removeEventListener("change", changeEvent);
      } catch (error) {}
    };
  });
  function handleChange(val, cs = 0) {
    setStart(0);
    setValue(val);
    const result = alert(name, null, val, true);
    if (cs === 0) setWarning(result);
    if (required) {
      onHandleGlobals("valid", result.props.obj);
      setColor(result.props.obj[1] ? "green" : "red");
    }
    if (cs === 0) onHandleGlobals("value", [name, val]);
  }
  return (
    <>
      {label && (
        <Col md="1.7" style={{marginLeft: mleft ? mleft : 0}}>
          <label className="ml-4 mr-0 p-0">
            <h5
              style={{
                whiteSpace: "pre-wrap",
                minWidth: wl,
                color: !required ? "green" : color,
              }}
            >
              <FormattedMessage
                id={`src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.${name}`}
              />
              {required ? " *" : null}
            </h5>
          </label>
        </Col>
      )}
      <Col md={col}>
        <div className="m-0">
          {type === "text" ? (
            <input
              id={id ? `AnnounceForm${name}` : null}
              type="text"
              ref={ref}
              className="form-control mt-2"
              onChange={(e) => {
                handleChange(e.target.value);
              }}
              value={value}
              disabled={lineThrough || disabled}
              placeholder={ph}
              style={{
                border: "solid 1px",
                borderColor: !required ? "green" : color,
                height: trash ? "35px" : "25px",
                width: w,
                textAlign: trash ? "left" : "center",
                textDecorationLine: lineThrough ? "line-through" : null,
                borderRadius: "5px",
              }}
            ></input>
          ) : (
            <textarea
              id={id ? `AnnounceForm${name}` : null}
              type="text"
              ref={ref}
              className="form-control mt-2"
              onChange={(e) => {
                handleChange(e.target.value);
              }}
              value={value}
              disabled={lineThrough || disabled}
              style={{
                border: "solid 1px",
                borderColor: !required ? "green" : color,
                height: "70px",
                width: w,
                textAlign: trash ? "left" : "center",
                textDecorationLine: lineThrough ? "line-through" : null,
                borderRadius: "5px",
              }}
              rows={rows}
            ></textarea>
          )}
          {trash && (
            <i
              className="fa fa-trash fa-lg "
              style={{
                position: "absolute",
                cursor: " pointer",
                color: "#7aa095",
                left: (typeof width !== "undefined" ? width : 50) + 17,
                top: "15px",
              }}
              onClick={() => {
                setValue("");
                handleChange("");
              }}
            ></i>
          )}
          <div style={{whiteSpace: "nowrap", width: "200px"}}>
            {start === 0 && required && warning}
          </div>
        </div>
      </Col>
    </>
  );
}

export default SimpleText;
