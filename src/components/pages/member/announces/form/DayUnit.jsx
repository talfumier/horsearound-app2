import {Row} from "react-bootstrap";
import {useIntl} from "react-intl";
import LanguageBlock from "./LanguageBlock.jsx";
import SimpleText from "./SimpleText.jsx";

function DayUnit({dataIn, onHandleDelete, onHandleGlobals}) {
  const {formatMessage} = useIntl();
  const keys = Object.keys(dataIn);
  function handleGlobals(cs, val, day) {
    if (cs === "valid") return; //no validation at all since it is optional
    onHandleGlobals(cs, val, day);
  }
  return keys.map((key, idx) => {
    return (
      <div key={idx}>
        {key === "day" && (
          <button
            type="button"
            className="dropdown singleDrop btn btn-success h-50"
          >
            {formatMessage({
              id: "src.components.announcePage.announceDetailTab.program.day",
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
        {key !== "day" && key !== "nbHoursEqui" && (
          <LanguageBlock
            key={idx}
            type={`${idx === 1 ? "text" : "textarea"}`}
            nested={true}
            dataIn={{name: key, data: dataIn[key]}}
            required={false}
            valid={{[key]: true}}
            onHandleGlobals={(cs, val) => {
              handleGlobals(cs, val, dataIn.day);
            }}
          ></LanguageBlock>
        )}
        {key === "nbHoursEqui" && (
          <Row className="justify-content-md-center mt-4">
            <SimpleText
              dataIn={{name: key, data: dataIn[key]}}
              required={false}
              valid={{[key]: true}}
              onHandleGlobals={(cs, val) => {
                handleGlobals(cs, val, dataIn.day);
              }}
            ></SimpleText>
          </Row>
        )}
      </div>
    );
  });
}

export default DayUnit;
