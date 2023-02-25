import {useState, useEffect} from "react";
import {FormattedMessage} from "react-intl";
import {Col, Row} from "react-bootstrap";
import mongoose from "mongoose";
import _ from "lodash";
import {isEven} from "../../../utils/utilityFunctions.js";
import ParticipantDetails from "./ParticipantDetails.jsx";

function ParticipantsInfo({reset, dataIn, onHandleGlobals}) {
  const keys = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "birthdate",
    "birthplace",
    "sex",
    "height",
    "weight",
    "occupation",
    "diet",
    "treatment",
  ];
  const [values, setValues] = useState({});
  const [expanded, setExpanded] = useState(null);
  useEffect(() => {
    let obj = {},
      arr = [];
    dataIn.data[isEven(reset) ? "default" : "saved"].map((part) => {
      arr = [];
      keys.map((key) => {
        arr.push({
          name: key,
          data: {
            default: "",
            saved: typeof part[key] !== "undefined" ? part[key] : "",
          },
        });
      });
      obj[part._id] = arr;
    });
    setValues(obj);
  }, [dataIn, reset]);
  function handleGlobals(cs, val, id) {
    if (cs === "valid") return;
    const vals = _.cloneDeep(values);
    values[id].map((item, idx) => {
      if (item.name === val[0]) vals[id][idx].data.saved = val[1];
    });
    onHandleGlobals("value", ["participantsInfo", prepareGlobals(vals)]);
    setValues(vals);
  }
  function prepareGlobals(vals) {
    const result = [];
    let obj = null;
    Object.keys(vals).map((key) => {
      obj = {};
      vals[key].map((item) => {
        obj[item.name] = item.data.saved;
      });
      obj = {...obj, _id: key};
      result.push(obj);
    });
    return result;
  }
  function handleParticipant(cs, id) {
    const vals = _.cloneDeep(values);
    let obj = {};
    switch (cs) {
      case "new":
        const _id = mongoose.Types.ObjectId().toString();
        const arr = [];
        keys.map((ky) => {
          arr.push({name: ky, data: {default: "", saved: ""}});
          obj[ky] = "";
        });
        obj = {...obj, _id};
        vals[_id] = arr;
        setExpanded({[_id]: true});
        break;
      case "del":
        delete vals[id];
    }
    onHandleGlobals("value", ["participantsInfo", prepareGlobals(vals)]);
    setValues(vals);
  }
  return (
    <Row className="justify-content-md-left pl-1 mt-0 pt-0">
      <label className="ml-4 pl-1 mt-0 mr-2">
        <h5
          style={{
            whiteSpace: "pre-wrap",
            color: "green",
          }}
        >
          <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.participantsDetails" />
        </h5>
        <button
          className="btn btn-success btn-default ml-4"
          onClick={() => {
            handleParticipant("new");
          }}
        >
          <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.add" />
        </button>
      </label>
      <Col md="10">
        <div style={{height: 200, overflowY: "auto"}}>
          {Object.keys(values).map((id, idx) => {
            return (
              <ParticipantDetails
                key={idx}
                reset={reset}
                expanded={expanded}
                values={values[id]}
                id={id}
                onHandleGlobals={handleGlobals}
                onHandleParticipant={handleParticipant}
              ></ParticipantDetails>
            );
          })}
        </div>
      </Col>
    </Row>
  );
}

export default ParticipantsInfo;
