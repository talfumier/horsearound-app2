import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {Row} from "react-bootstrap";
import _ from "lodash";
import OptionUnit from "./OptionUnit.jsx";
import {isEven} from "../../../utils/utilityFunctions.js";
import {validate} from "../../validation.js";

function Options({reset, dataIn, onHandleGlobals}) {
  const {formatMessage} = useIntl();
  const {name, data: dta} = dataIn;
  const [data, setData] = useState([]);
  const [valid, setValid] = useState([]);
  useEffect(() => {
    const options = _.cloneDeep(isEven(reset) ? dta.default : dta.saved);
    setData(options);
    const valide = [];
    options.map((option, idx) => {
      valide.push({
        option: idx + 1,
        title: {
          en: validate("title", option["title"].en)[0],
          fr: validate("title", option["title"].fr)[0],
        },
        description: {en: true, fr: true},
        price: validate("price", option["price"])[0],
        type: validate("type", option["type"])[0],
      });
    });
    onHandleGlobals("valid", [
      name,
      JSON.stringify(valide).indexOf(false) === -1,
    ]);
    setValid(valide);
  }, [reset]);
  function handleCreate() {
    const options = [...data];
    options.push({
      option: options.length + 1,
      title: {en: "", fr: ""},
      description: {en: "", fr: ""},
      price: 0,
      type: "All",
    });
    setData(options);
    onHandleGlobals("value", [name, options]);
    const valide = _.cloneDeep(valid);
    valide.push({
      option: options.length,
      title: {en: false, fr: false},
      description: {en: true, fr: true},
      price: false,
      type: true,
    });
    setValid(valide);
    onHandleGlobals("valid", [name, false]);
  }
  function handleDelete(option) {
    const options = _.cloneDeep(data),
      valide = _.cloneDeep(valid);
    let idx = -1;
    options.map((opt, i) => {
      if (opt.option === option) idx = i;
    });
    options.splice(idx, 1);
    options.map((opt, i) => {
      //renumber options after deletion
      opt.option = i + 1;
    });
    setData(options);
    onHandleGlobals("value", [name, options]);
    valide.splice(idx, 1);
    valide.map((opt, i) => {
      //renumber valide after deletion
      opt.option = i + 1;
    });
    setValid(valide);
    onHandleGlobals("valid", [
      name,
      JSON.stringify(valide).indexOf(false) === -1,
    ]);
  }
  function handleGlobals(cs, val, option) {
    const options = _.cloneDeep(data);
    let idx = -1;
    options.map((opt, i) => {
      if (opt.option === option) idx = i;
    });
    if (cs === "value") {
      if (val.length === 3)
        options[idx][val[0]][val[1]] = val[2]; //title,description,
      else options[idx][val[0]] = val[1]; //price, type
      setData(options);
      onHandleGlobals("value", [name, options]);
    } else {
      const valide = _.cloneDeep(valid);
      valid.map((opt, idx) => {
        if (opt.option === option) {
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
                "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.options"
              }
            />
          </h5>
        </label>
        <button
          className="dropdown singleDrop btn btn-success h-50 ml-0 mt-2"
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
            id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.optionsPH",
          })}
        ></input>
      </Row>
      <div
        style={{
          marginLeft: "8%",
          marginRight: "8%",
        }}
      >
        {data.map((option, idx) => {
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
              <OptionUnit
                key={idx}
                dataIn={option}
                valid={valid[idx]}
                onHandleDelete={handleDelete}
                onHandleGlobals={handleGlobals}
              ></OptionUnit>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Options;
