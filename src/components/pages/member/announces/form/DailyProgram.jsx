import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {Row} from "react-bootstrap";
import DayUnit from "./DayUnit.jsx";
import {isEven} from "../../../utils/utilityFunctions.js";

function DailyProgram({reset, dataIn, onHandleGlobals}) {
  const {formatMessage} = useIntl();
  const {name, data: dta} = dataIn;
  const data = isEven(reset) ? dta.default : dta.saved;
  const [value, setValue] = useState(data);
  useEffect(() => {
    setValue(data);
  }, [reset]);
  function handleCreate() {
    const days = [...value];
    days.push({
      day: days.length + 1,
      title: {en: "", fr: ""},
      description: {en: "", fr: ""},
      accommodation: {en: "", fr: ""},
      nbHoursEqui: "",
    });
    setValue(days);
  }
  function handleDelete(day) {
    const days = [...value];
    let idx = -1;
    days.map((dy, i) => {
      if (dy.day === day) idx = i;
    });
    days.splice(idx, 1);
    days.map((dy, i) => {
      //renumber days after deletion
      dy.day = i + 1;
    });
    setValue(days);
    onHandleGlobals("value", [name, days]);
  }
  function handleGlobals(cs, val, day) {
    const days = [...value];
    let idx = -1;
    days.map((dy, i) => {
      if (dy.day === day) idx = i;
    });
    if (val.length === 3)
      days[idx][val[0]][val[1]] = val[2]; //title,description, accommodation
    else days[idx][val[0]] = val[1]; //nbHoursEqui
    setValue(days);
    onHandleGlobals("value", [name, days]);
  }
  return (
    <>
      <Row className="justify-content-md-left mx-2 pl-2 my-4 pt-2">
        <label className="ml-0 mr-0 pl-0 mt-2 ">
          <h5
            style={{
              minWidth: "140px",
              color: "green",
            }}
          >
            <FormattedMessage
              id={
                "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.days"
              }
            />
          </h5>
        </label>
        <button
          className="dropdown singleDrop btn btn-success h-50 mt-2"
          onClick={handleCreate}
        >
          <FormattedMessage
            id={
              "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.add"
            }
          />
        </button>
        <input
          type="text"
          className="form-control ml-5 pl-5 mt-2 w-50"
          style={{
            textAlign: "center",
            borderRadius: "5px",
          }}
          readOnly={true}
          placeholder={formatMessage({
            id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.daysPH",
          })}
        ></input>
      </Row>
      <div
        style={{
          marginLeft: "8%",
          marginRight: "8%",
        }}
      >
        {value.map((day, idx) => {
          return (
            <div
              key={idx}
              className="mx-0 my-3 px-0 pb-4"
              style={{
                border: "1px solid",
                borderColor: "green",
                borderRadius: "5px",
              }}
            >
              <DayUnit
                key={idx}
                dataIn={day}
                onHandleDelete={handleDelete}
                onHandleGlobals={handleGlobals}
              ></DayUnit>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default DailyProgram;
