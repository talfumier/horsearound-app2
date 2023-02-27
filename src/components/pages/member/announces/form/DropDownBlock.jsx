import {useState, useEffect} from "react";
import {FormattedMessage} from "react-intl";
import {Col} from "react-bootstrap";
import DropDown from "./DropDown.jsx";
import {alert} from "../../validation.js";
import {isEven} from "../../../utils/utilityFunctions.js";

function DropDownBlock({cs, reset, dataIn, valid, onHandleGlobals}) {
  const {name, data: dta} = dataIn;
  const color = valid ? "green" : "red";
  const [start, setStart] = useState(1);
  const [value, setValue] = useState("");
  const [warning, setWarning] = useState(false);
  useEffect(() => {
    const data = isEven(reset) ? dta.default : dta.saved;
    //setValue(data);
    handleChange(data, 1); //update validation, warning & globals value upon reset change
    setWarning(false);
  }, [reset]);
  function handleChange(val, cs = 0) {
    setStart(0);
    setValue(val);
    const result = alert(name, null, val, true);
    if (cs === 0) setWarning(result);
    onHandleGlobals("valid", result.props.obj);
    if (cs === 0) onHandleGlobals("value", [name, val]);
  }
  return (
    <>
      <Col md="1.7">
        <label className="mx-0 px-0">
          <h5
            style={{
              whiteSpace: "pre-wrap",
              minWidth: "120px",
              color,
            }}
          >
            <FormattedMessage
              id={`src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.${name}`}
            />
            {" *"}
          </h5>
        </label>
      </Col>
      <Col md="2">
        <DropDown
          id={cs === "destination" ? "destinations" : "activities"}
          intlId={
            cs === "destination"
              ? [
                  "src.components.allPages.Menu.navbar.destinations",
                  ".title",
                  ".continents",
                  ".continentName",
                  ".countries",
                ]
              : [
                  "src.components.allPages.Menu.navbar.activities",
                  ".title",
                  ".types",
                  ".title",
                  ".subactivities",
                ]
          } //ul slicing layout
          ul={
            cs === "destination"
              ? [
                  [0, 1],
                  [1, 3],
                  [3, 6],
                ]
              : [
                  [0, 2],
                  [2, 4],
                  [4, 6],
                ]
          }
          name={name}
          value={value}
          color={color}
          onHandleChange={handleChange}
        ></DropDown>
        {start === 0 && warning}
      </Col>
    </>
  );
}

export default DropDownBlock;
