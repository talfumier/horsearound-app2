import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {Col} from "react-bootstrap";
import {isEven} from "../../../utils/utilityFunctions.js";

function GuideAdultChildRider({reset, dataIn, onHandleGlobals}) {
  const {formatMessage} = useIntl();
  const keys = Object.keys(dataIn);
  const [value, setValue] = useState(init());
  useEffect(() => {
    setValue(init());
  }, [reset]);
  function init() {
    const obj = {};
    keys.map((key) => {
      obj[key] = dataIn[key].data[isEven(reset) ? "default" : "saved"] ? 1 : 0;
    });
    return obj;
  }
  function handleChange(e) {
    setValue((data) => ({
      ...data,
      [e.target.id]: e.target.value,
    }));
    onHandleGlobals("value", [e.target.id, e.target.value == 1 ? true : false]); //no object equality
  }
  return (
    <Col md="7">
      <div className="d-flex mx-0">
        {keys.map((key, idx) => {
          return (
            <div key={idx}>
              <label key={idx} className="mx-0 mr-4 mt-2 px-0">
                <h5
                  style={{
                    whiteSpace: "pre-wrap",
                    width: "170px",
                    textAlign: "right",
                  }}
                >
                  <FormattedMessage
                    id={`src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.${key}`}
                  />
                </h5>
              </label>
              <select
                id={key}
                className="ml-0 mr-3 px-0 mt-3"
                style={{
                  cursor: "pointer",
                  border: "solid 1px",
                  borderColor: "green",
                  height: "23px",
                  borderRadius: "5px",
                }}
                onChange={handleChange}
                value={value[key]}
              >
                <option value={1}>{formatMessage({id: "global.yes"})}</option>
                <option value={0}>{formatMessage({id: "global.no"})}</option>
              </select>
            </div>
          );
        })}
      </div>
    </Col>
  );
}

export default GuideAdultChildRider;
