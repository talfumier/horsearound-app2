import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {Row} from "react-bootstrap";
import OptionUnit from "./OptionUnit.jsx";
import {isEven} from "../../../utils/utilityFunctions.js";

function Options({reset, dataIn, onHandleGlobals}) {
  const {formatMessage} = useIntl();
  const {name, data: dta} = dataIn;
  const data = isEven(reset) ? dta.default : dta.saved;
  const [value, setValue] = useState(data);
  useEffect(() => {
    setValue(data);
  }, [reset]);
  function handleCreate() {
    const options = [...value];
    options.push({
      option: options.length + 1,
      description: {en: "", fr: ""},
      price: 0,
      type: "All",
    });
    setValue(options);
  }
  function handleDelete(option) {
    const options = [...value];
    let idx = -1;
    options.map((opt, i) => {
      if (opt.option === option) idx = i;
    });
    options.splice(idx, 1);
    options.map((opt, i) => {
      //renumber options after deletion
      opt.option = i + 1;
    });
    setValue(options);
    onHandleGlobals("value", [name, options]);
  }
  function handleGlobals(cs, val, option) {
    const options = [...value];
    let idx = -1;
    options.map((opt, i) => {
      if (opt.option === option) idx = i;
    });
    if (val.length === 3) options[idx][val[0]][val[1]] = val[2]; //description
    else options[idx][val[0]] = val[1]; //price,type
    setValue(options);
    onHandleGlobals("value", [name, options]);
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
        {value.map((option, idx) => {
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
