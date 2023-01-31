import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {Col} from "react-bootstrap";
import {range} from "../../../utils/utilityFunctions.js";
import LevelInfo from "../../../announce/details/common/LevelInfo.jsx";
import {isEven} from "../../../utils/utilityFunctions.js";

function LevelRating({reset, dataIn, required, l0, l1, onHandleGlobals}) {
  //validation not needed because there always exists a valid value from the dropdown select
  const {formatMessage} = useIntl();
  const {name, data: dta} = dataIn;
  const [value, setValue] = useState("");
  useEffect(() => {
    const data = isEven(reset) ? dta.default : dta.saved;
    setValue(data);
  }, [reset]);
  function handleChange(e) {
    setValue(e.target.value);
    onHandleGlobals("value", [e.target.id, e.target.value]);
  }
  return (
    <Col md="3" className="m-0 p-0">
      <div className="d-flex mx-0">
        <label className="mx-0 px-0 mt-2 ">
          <h5
            style={{
              minWidth: "140px",
              color: "green",
            }}
          >
            <FormattedMessage
              id={`src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.${name}`}
            />
            {required ? " *" : null}
          </h5>
        </label>
        <select
          id={name}
          className="ml-0 mr-3 pl-3 mt-3"
          style={{
            cursor: "pointer",
            border: "solid 1px",
            borderColor: "green",
            height: "30px",
            minWidth: "250px",
            borderRadius: "5px",
          }}
          onChange={handleChange}
          value={value}
        >
          {range(1, l1.length).map((lvl) => {
            return (
              <option key={lvl} value={lvl}>
                {formatMessage({
                  id: `src.components.memberPage.tabs.annonces.details.AddAnnounceForm.span${
                    l1[lvl - 1]
                  }`,
                }).replace(":", "")}
              </option>
            );
          })}
        </select>
        <div className="ml-4 mt-3 pt-1">
          <LevelInfo
            label={null}
            l0={`src.components.memberPage.tabs.annonces.details.AddAnnounceForm.header${l0}`}
            l1_title="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.span"
            l1_desc="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.description"
            range={l1}
            rating={null}
          ></LevelInfo>
        </div>
      </div>
    </Col>
  );
}

export default LevelRating;
