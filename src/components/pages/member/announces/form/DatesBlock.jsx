import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {Row, Col} from "react-bootstrap";
import _ from "lodash";
import DatesType from "./DatesType.jsx";
import {alert} from "../../validation.js";
import {isEven, sumOfPropsValues} from "../../../utils/utilityFunctions.js";

let activeType = null;
function DatesBlock({reset, dataIn, onHandleGlobals}) {
  //console.log("dataIn", dataIn);
  const {locale, formatMessage} = useIntl();
  const types = ["Fixed_Fixed", "Flex_Fixed", "Flex_Flex"];
  const [values, setValues] = useState({});
  const [color, setColor] = useState({});
  useEffect(() => {
    const val = {};
    Object.keys(dataIn).map((key) => {
      if (key !== "daysNights")
        val[key] = dataIn[key].data[isEven(reset) ? "default" : "saved"];
      else val[key] = initDaysNights(val.datesType, dataIn.daysNights);
    });
    val.locked = val.dates.length > 0 ? true : false;
    setValues(val);
  }, [reset]);
  useEffect(() => {
    setColor({
      nbDays: true, //sets color of 'Proposed dates' label
      nbNights: true,
      dates: true,
    });
  }, []);
  useEffect(() => {
    updatePriceLabels();
  }, [locale]);
  function initDaysNights(type, daysNights) {
    activeType = type;
    const obj = {};
    types.map((typ) => {
      if (typ === type) {
        obj[typ] = {
          active: true,
          nbDays: daysNights.nbDays[isEven(reset) ? "default" : "saved"],
          nbNights: daysNights.nbNights[isEven(reset) ? "default" : "saved"],
        };
      } else
        obj[typ] = {
          active: false,
          nbDays: typ === "Flex_Flex" ? "n" : 0,
          nbNights: 0,
        };
    });
    return obj;
  }
  function handleChange(e) {
    if (e.target.id.includes("F")) {
      //datesType
      if (e.target.value === "on") {
        const val = _.cloneDeep(values.daysNights);
        Object.keys(values.daysNights).map((key) => {
          if (key === e.target.id) activeType = key;
          val[key] = {
            active: key === e.target.id ? true : false,
            /* nbDays: val[key].nbDays,
            nbNights: val[key].nbNights, */
            nbDays: activeType === "Flex_Flex" ? "n" : 0, //update nbDays to default value upon datesType change
            nbNights: 0, //update nbNights to default value upon datesType change
          };
        });
        setValues({...values, daysNights: val, dates: []}); //reset dates to [] upon datesType change (possible when all dates are removed)
        if (activeType !== "Flex_Flex") {
          let result = alert("nbDays", null, val[activeType].nbDays, true);
          onHandleGlobals("valid", result.props.obj);
          result = alert("nbNights", null, val[activeType].nbNights, true);
          onHandleGlobals("valid", result.props.obj);
        } else {
          onHandleGlobals("valid", ["nbDays", true]);
          onHandleGlobals("valid", ["nbNights", true]);
        }
        onHandleGlobals("value", ["datesType", e.target.id]);
        onHandleGlobals("value", [
          "nbDays",
          activeType === "Flex_Flex" ? "n" : 0,
        ]); //update globals.nbDays to default value upon datesType change
        onHandleGlobals("value", ["nbNights", 0]); //update globals.nbNights to default value upon datesType change
        updatePriceLabels();
      }
    }
  }
  function updatePriceLabels() {
    setTimeout(() => {
      ["priceAdulteDaily", "priceChildDaily", "priceAccompagnateurDaily"].map(
        (id) => {
          try {
            document.getElementById(id).innerHTML =
              activeType === "Flex_Flex"
                ? formatMessage({
                    id: "global.daily",
                  })
                : null;
          } catch (error) {}
        }
      );
    }, 500);
  }
  function handleColor(val) {
    const col = _.cloneDeep(color);
    Object.keys(val).map((key) => {
      col[key] = val[key];
    });
    setColor(col);
    const vls = _.cloneDeep(values);
    if (!col.dates)
      vls.locked = false; //set locked flag to false when dates.length = 0
    else vls.locked = true; //set locked flag to true when dates.length > 0
    setValues(vls);
  }
  return (
    Object.keys(values).length === 4 && (
      <>
        <Row className="justify-content-md-left mx-2 pl-2 my-4 pt-2">
          <Col md="1.7">
            <label className="mx-0 px-0">
              <h5
                style={{
                  whiteSpace: "pre-wrap",
                  minWidth: "120px",
                  color: sumOfPropsValues(color) === 3 ? "green" : "red",
                }}
              >
                <FormattedMessage
                  id={`src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.dates`}
                />
                {" *"}
              </h5>
            </label>
          </Col>
          {types.map((type, idx) => {
            return (
              <DatesType
                key={idx}
                reset={reset}
                data={{
                  datesType: type,
                  daysNights: values.daysNights[type],
                  dates: type === values.datesType ? values.dates : [],
                  locked: values.locked,
                }}
                onHandleChange={handleChange}
                onHandleColor={handleColor} //'Proposed dates' label color
                onHandleGlobals={onHandleGlobals}
              ></DatesType>
            );
          })}
        </Row>
      </>
    )
  );
}

export default DatesBlock;
