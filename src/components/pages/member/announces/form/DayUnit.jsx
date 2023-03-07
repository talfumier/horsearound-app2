import {Row} from "react-bootstrap";
import {useIntl} from "react-intl";
import LanguageBlock from "./LanguageBlock.jsx";
import SimpleText from "./SimpleText.jsx";

function DayUnit({dataIn, valid, onHandleDelete, onHandleGlobals}) {
  const {formatMessage} = useIntl();
  const keys = Object.keys(dataIn);
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
        {key !== "day" && key !== "nbHoursEqui" && key !== "nbKmsEqui" && (
          <LanguageBlock
            key={idx}
            type={`${idx === 1 ? "text" : "textarea"}`}
            nested={true}
            dataIn={{name: key, data: dataIn[key]}}
            required={key === "title" ? true : false}
            valid={valid[key]}
            onHandleGlobals={(cs, val) => {
              onHandleGlobals(cs, val, dataIn.day);
            }}
          ></LanguageBlock>
        )}
        {key === "nbHoursEqui" && (
          <Row className="justify-content-md-center mt-4">
            <div
              className="d-flex justify-content-center mt-4"
              style={{width: "50%"}}
            >
              {["nbHoursEqui", "nbKmsEqui"].map((ky) => {
                return (
                  <SimpleText
                    key={ky}
                    dataIn={{name: ky, data: dataIn[ky]}}
                    w="70px"
                    required={false}
                    valid={true}
                    onHandleGlobals={(cs, val) => {
                      onHandleGlobals(cs, val, dataIn.day);
                    }}
                  ></SimpleText>
                );
              })}
            </div>
          </Row>
        )}
      </div>
    );
  });
}

export default DayUnit;
