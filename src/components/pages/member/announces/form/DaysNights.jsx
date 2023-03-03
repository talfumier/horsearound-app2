import {useState, useEffect} from "react";
import {FormattedMessage} from "react-intl";
import {Row, Col} from "react-bootstrap";
import {alert} from "../../validation.js";

function DaysNights({reset, data, onHandleWarning, onHandleGlobals}) {
  const [values, setValues] = useState(data); //type, nbDays, nbNights, dates
  const [color, setColor] = useState({});
  useEffect(() => {
    setValues(data);
    setColor({
      nbDays:
        values.type !== "Flex_Flex"
          ? alert("nbDays", null, data.nbDays, true).props.obj[1]
          : true,
      nbNights:
        values.type !== "Flex_Flex"
          ? alert("nbNights", null, data.nbNights, true).props.obj[1]
          : true,
    });
  }, [reset]);
  function handleChange(e) {
    setValues({...values, [e.target.id]: e.target.value});
    let result = null;
    if (values.type !== "Flex_Flex") {
      result = alert(e.target.id, null, e.target.value, true);
      setColor({...color, [e.target.id]: result.props.obj[1]});
      onHandleWarning([e.target.id, result]);
    }
    onHandleGlobals(
      "valid",
      values.type !== "Flex_Flex" ? result.props.obj : [e.target.id, true]
    );
    onHandleGlobals("value", [e.target.id, e.target.value]);
  }
  return (
    <>
      <Row>
        <Col md="3">
          <label className="ml-3">
            <h5
              style={{
                width: "100px",
                color:
                  (color.nbDays && color.nbNights) ||
                  values.type === "Flex_Flex"
                    ? "green"
                    : "red",
              }}
            >
              <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.duration" />
            </h5>
          </label>
        </Col>
        <Col md="2">
          <input
            id="nbDays"
            type="text"
            style={{
              width: "40px",
              textAlign: "center",
              border: "solid 1px",
              borderColor:
                color.nbDays || values.type === "Flex_Flex" ? "green" : "red",
              borderRadius: "5px",
            }}
            className="ml-3 mr-4 mt-2"
            onChange={handleChange}
            value={values.nbDays}
            disabled={values.type.includes("Fixed") ? false : true}
          ></input>
        </Col>
        <Col md="1">
          <label className="mx-2 pl-1">
            <h5
              style={{
                minWidth: "50px",
              }}
            >
              <FormattedMessage id="global.days" />
            </h5>
          </label>
        </Col>
        <Col md="2" className="ml-2">
          {values.type.includes("Fixed") ? (
            <input
              id="nbNights"
              type="text"
              style={{
                width: "40px",
                textAlign: "center",
                border: "solid 1px",
                borderColor: color.nbNights ? "green" : "red",
                borderRadius: "5px",
              }}
              className="mx-4 mt-2"
              onChange={handleChange}
              value={values.nbNights}
            ></input>
          ) : (
            <select
              id="nbNights"
              className="ml-4 mt-2"
              style={{
                cursor: "pointer",
                border: "solid 1px",
                borderColor: "green",
                borderRadius: "5px",
              }}
              onChange={handleChange}
              value={values.nbNights}
            >
              <option>0</option>
              <option>n</option>
              <option>n-1</option>
              <option>n+1</option>
            </select>
          )}
        </Col>
        <Col md="1">
          <label
            className={`mx-2 ${
              !values.type.includes("Fixed") ? "pl-4" : "pl-2"
            } `}
          >
            <h5
              style={{
                minWidth: "50px",
              }}
            >
              <FormattedMessage id="global.nights" />
            </h5>
          </label>
        </Col>
      </Row>
    </>
  );
}

export default DaysNights;
