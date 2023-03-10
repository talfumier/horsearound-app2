import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {Row} from "react-bootstrap";
import _ from "lodash";
import DayUnit from "./DayUnit.jsx";
import {isEven} from "../../../utils/utilityFunctions.js";
import {validate} from "../../validation.js";

function DailyProgram({reset, dataIn, onHandleGlobals}) {
  const {formatMessage} = useIntl();
  const {name, data: dta} = dataIn;
  const [data, setData] = useState([]);
  const [valid, setValid] = useState([]);
  useEffect(() => {
    const days = _.cloneDeep(isEven(reset) ? dta.default : dta.saved);
    setData(days);
    const valide = [];
    days.map((day, idx) => {
      valide.push({
        day: idx + 1,
        title: {
          en: validate("title", day["title"].en)[0],
          fr: validate("title", day["title"].fr)[0],
        },
        description: {en: true, fr: true},
        accommodation: {en: true, fr: true},
        nbHoursEqui: true,
        nbKmsEqui: true,
      });
    });
    onHandleGlobals("valid", [
      name,
      JSON.stringify(valide).indexOf(false) === -1,
    ]);
    setValid(valide);
  }, [reset]);
  function handleCreate() {
    const days = _.cloneDeep(data);
    days.push({
      day: days.length + 1,
      title: {en: "", fr: ""},
      description: {en: "", fr: ""},
      accommodation: {en: "", fr: ""},
      nbHoursEqui: "",
      nbKmsEqui: "",
    });
    setData(days);
    onHandleGlobals("value", [name, days]);
    const valide = _.cloneDeep(valid);
    valide.push({
      day: days.length,
      title: {en: false, fr: false},
      description: {en: true, fr: true},
      accommodation: {en: true, fr: true},
      nbHoursEqui: true,
      nbKmsEqui: true,
    });
    setValid(valide);
    onHandleGlobals("valid", [name, false]);
  }
  function handleDelete(day) {
    const days = _.cloneDeep(data),
      valide = _.cloneDeep(valid);
    let idx = -1;
    days.map((dy, i) => {
      if (dy.day === day) idx = i;
    });
    days.splice(idx, 1);
    days.map((dy, i) => {
      //renumber days after deletion
      dy.day = i + 1;
    });
    setData(days);
    onHandleGlobals("value", [name, days]);
    valide.splice(idx, 1);
    valide.map((dy, i) => {
      //renumber valide after deletion
      dy.day = i + 1;
    });
    setValid(valide);
    onHandleGlobals("valid", [
      name,
      JSON.stringify(valide).indexOf(false) === -1,
    ]);
  }
  function handleGlobals(cs, val, day) {
    const days = _.cloneDeep(data);
    let idx = -1;
    days.map((dy, i) => {
      if (dy.day === day) idx = i;
    });
    if (cs === "value") {
      if (val.length === 3)
        days[idx][val[0]][val[1]] = val[2]; //title,description, accommodation
      else days[idx][val[0]] = val[1]; //nbHoursEqui
      setData(days);
      onHandleGlobals("value", [name, days]);
    } else {
      const valide = _.cloneDeep(valid);
      valid.map((dy, idx) => {
        if (dy.day === day) {
          switch (val.length) {
            case 2:
              valide[idx][val[0]] = val[1];
              break;
            case 3:
              valide[idx][val[0]][val[1]] = val[2];
          }
        }
      });
      setValid(valide);
      onHandleGlobals("valid", [
        name,
        JSON.stringify(valide).indexOf(false) === -1,
      ]);
    }
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
      {
        <div
          style={{
            marginLeft: "8%",
            marginRight: "8%",
          }}
        >
          {data.map((day, idx) => {
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
                  valid={valid[idx]}
                  onHandleDelete={handleDelete}
                  onHandleGlobals={handleGlobals}
                ></DayUnit>
              </div>
            );
          })}
        </div>
      }
    </>
  );
}

export default DailyProgram;
