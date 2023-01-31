import {useState, useEffect} from "react";
import {FormattedMessage} from "react-intl";
import {Col} from "react-bootstrap";
import SimpleText from "./SimpleText.jsx";

function Participants({reset, dataIn, valid, onHandleGlobals}) {
  const keys = Object.keys(dataIn);
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
  useEffect(() => {
    const data = {};
    keys.map((key, idx) => {
      data[key] = dataIn[key];
    });
    setValue(data);
  }, [reset]);
  return (
    Object.keys(value).length > 0 && (
      <Col md="10" className="m-0 p-0">
        <div className="d-flex mx-0">
          <label className="ml-0 mt-2 px-0">
            <h5
              style={{
                whiteSpace: "pre-wrap",
                minWidth: "100px",
                color,
              }}
            >
              <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.participants" />
              {" *"}
            </h5>
          </label>
          <div className="d-flex ml-5 mt-2 pt-0">
            {keys.map((key, idx) => {
              return (
                <SimpleText
                  reset={reset}
                  key={idx}
                  dataIn={value[key]}
                  required={true}
                  valid={valid[key]}
                  col={1}
                  trash={false}
                  w="60px"
                  onHandleGlobals={onHandleGlobals}
                ></SimpleText>
              );
            })}
          </div>
        </div>
      </Col>
    )
  );
}

export default Participants;
