import {useState, useEffect} from "react";
import {FormattedMessage} from "react-intl";
import {Col} from "react-bootstrap";
import SimpleText from "./SimpleText.jsx";
import {isEven} from "../../../utils/utilityFunctions.js";

function Price({reset, dataIn, valid, onHandleGlobals}) {
  const keys = Object.keys(dataIn);
  const x = {
    priceAdulte: "openToAdults",
    priceChild: "openToChildren",
    priceAccompagnateur: "openToNonRiders",
  };
  const [color, setColor] = useState([]);
  function init() {
    const obj = [];
    keys.map((key) => {
      obj.push(valid[key]);
    });
    return obj.indexOf(false) === -1 ? "green" : "red";
  }
  useEffect(() => {
    setColor(init());
  }, [valid]);
  const [value, setValue] = useState({});
  const [cur, setCurrency] = useState("");
  useEffect(() => {
    const data = {};
    keys.map((key, idx) => {
      data[key] = dataIn[key];
    });
    setValue(data);
    setCurrency(data.devise.data[isEven(reset) ? "default" : "saved"]);
  }, [reset]);
  function handleChange(e) {
    setCurrency(e.target.value);
    onHandleGlobals("value", [e.target.id, e.target.value]);
  }
  return (
    Object.keys(value).length > 0 && (
      <Col md="3" className="m-0 p-0">
        <div className="d-flex mx-0">
          <label className="ml-0 mt-2 px-0">
            <h5
              style={{
                whiteSpace: "pre-wrap",
                minWidth: "100px",
                color,
              }}
            >
              <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.price" />
              {" *"}
            </h5>
          </label>
          <div className="d-flex ml-5 mt-2 pt-0 ">
            <label className="mx-0 mr-4 mt-0 pt-0">
              <h5
                style={{
                  whiteSpace: "pre-wrap",
                  width: "80px",
                  textAlign: "right",
                }}
              >
                <FormattedMessage
                  id={`src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.${keys[0]}`}
                />
              </h5>
            </label>
            <select
              id="devise"
              className="ml-0 mr-3 px-0 mt-2"
              style={{
                cursor: "pointer",
                border: "solid 1px",
                borderColor: "green",
                height: "23px",
                width: "50px",
                borderRadius: "5px",
              }}
              onChange={handleChange}
              value={cur}
            >
              <option>€</option>
              <option>£</option>
              <option>$</option>
            </select>
            {keys.map((key, idx) => {
              return idx > 0 ? (
                <div className="d-flex ml-5" key={idx}>
                  <SimpleText
                    key={idx}
                    id={key}
                    reset={reset}
                    dataIn={value[key]}
                    required={true}
                    valid={valid[key]}
                    col={2}
                    trash={false}
                    w="60px"
                    lt={x[key]}
                    onHandleGlobals={onHandleGlobals}
                    style={{maxWidth: "80px"}}
                  ></SimpleText>
                  <label className="ml-4 mt-0 pl-1">
                    <h5
                      style={{
                        whiteSpace: "pre-wrap",
                        minWidth: "70px",
                        textAlign: "left",
                      }}
                    >
                      <span>{cur}</span>
                      <span id={`${key}Daily`}></span>
                    </h5>
                  </label>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </Col>
    )
  );
}

export default Price;
