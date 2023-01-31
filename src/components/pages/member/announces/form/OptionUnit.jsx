import {useState, useEffect} from "react";
import {Row} from "react-bootstrap";
import {useIntl} from "react-intl";
import LanguageBlock from "./LanguageBlock.jsx";
import SimpleText from "./SimpleText.jsx";

function OptionUnit({dataIn, onHandleDelete, onHandleGlobals}) {
  const {formatMessage} = useIntl();
  const keys = Object.keys(dataIn);
  const [value, setValue] = useState("All");
  const [currency, setCurrency] = useState(null);
  useEffect(() => {
    function changeEvent() {
      try {
        setCurrency(document.getElementById("devise").value);
      } catch (error) {}
    }
    changeEvent(); //initial currency setting
    try {
      document.getElementById("devise").addEventListener("change", changeEvent);
    } catch (error) {}
    return () => {
      try {
        document
          .getElementById("devise")
          .removeEventListener("change", changeEvent);
      } catch (error) {}
    };
  });
  function handleChange(e) {
    setValue(e.target.value);
    handleGlobals("value", [e.target.id, e.target.value], dataIn.option);
  }
  function handleGlobals(cs, val, option) {
    if (cs === "valid") return; //no validation at all since it is optional
    onHandleGlobals(cs, val, option);
  }
  return keys.map((key, idx) => {
    return (
      <div key={idx}>
        {key === "option" && (
          <button
            type="button"
            className="dropdown singleDrop btn btn-success h-50"
          >
            {formatMessage({
              id: "src.components.announcePage.announceDetailTab.program.option",
            })}
            <span className="badge badge-light mx-2">{dataIn[key]}</span>

            <i
              className="fa fa-trash fa-lg ml-4"
              onClick={() => {
                onHandleDelete(idx + 1);
              }}
            ></i>
          </button>
        )}
        {key === "description" && (
          <LanguageBlock
            key={idx}
            type={`${idx === 1 ? "text" : "textarea"}`}
            nested={true}
            dataIn={{name: key, data: dataIn[key]}}
            required={false}
            valid={{[key]: true}}
            onHandleGlobals={(cs, val) => {
              handleGlobals(cs, val, dataIn.option);
            }}
          ></LanguageBlock>
        )}
        {key === "price" && (
          <Row className="justify-content-md-center mt-4">
            <div
              className="d-flex justify-content-center mt-4"
              style={{width: "50%"}}
            >
              <SimpleText
                dataIn={{name: key, data: dataIn[key]}}
                required={false}
                valid={{[key]: true}}
                onHandleGlobals={(cs, val) => {
                  handleGlobals(cs, val, dataIn.option);
                }}
                w="100px"
              ></SimpleText>
              <label className="ml-0 pl-0 mr-4 mt-1 pt-0">
                <h5
                  style={{
                    whiteSpace: "pre-wrap",
                    width: "20px",
                    textAlign: "left",
                  }}
                >
                  {currency}
                </h5>
              </label>
              <select
                id="type"
                className="ml-4 pl-4 mt-2"
                style={{
                  cursor: "pointer",
                  border: "solid 1px",
                  borderColor: "green",
                  height: "34px",
                  width: "120px",
                  borderRadius: "5px",
                }}
                onChange={handleChange}
                value={value}
              >
                <option value="All">
                  {formatMessage({
                    id: "src.components.memberPage.tabs.annonces.details.AddOption.optionAll",
                  })}
                </option>
                <option value="Day">
                  {formatMessage({
                    id: "src.components.memberPage.tabs.annonces.details.AddOption.optionDay",
                  })}
                </option>
                <option value="Night">
                  {formatMessage({
                    id: "src.components.memberPage.tabs.annonces.details.AddOption.optionNight",
                  })}
                </option>
                <option value="Person">
                  {formatMessage({
                    id: "src.components.memberPage.tabs.annonces.details.AddOption.optionPerson",
                  })}
                </option>
              </select>
            </div>
          </Row>
        )}
      </div>
    );
  });
}

export default OptionUnit;
