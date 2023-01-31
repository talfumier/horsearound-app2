import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {Row, Col} from "react-bootstrap";
import _ from "lodash";
import {toastWarning} from "../../../common/toastSwal/ToastMessages.js";
import DaysNights from "./DaysNights.jsx";
import CalendarBlock from "./CalendarBlock.jsx";

function DatesType({
  reset,
  data: dta,
  onHandleChange,
  onHandleColor,
  onHandleGlobals,
}) {
  const {locale, formatMessage} = useIntl();
  const [data, setData] = useState({});
  const [duration, setDuration] = useState({});
  const [value, setValue] = useState(false); //local check box
  const [warning, setWarning] = useState({});
  useEffect(() => {
    setData(dta);
    setValue(dta.daysNights.active);
  }, [dta, reset]); //data and reset needed !!!!
  useEffect(() => {
    setDuration({
      nbDays: dta.daysNights.nbDays,
      nbNights: dta.daysNights.nbNights,
    });
    setWarning({
      nbDays: {props: {obj: [0, true]}},
      nbNights: {props: {obj: [0, true]}},
    });
  }, [reset]);
  function handleChange(e) {
    //local check box
    if (data.locked) {
      toastWarning(
        formatMessage({
          id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.warning1",
        })
      );
      return;
    }
    setValue(!value);
    onHandleChange(e);
  }
  function getWarning() {
    try {
      if (!warning.nbDays.props.obj[1]) return warning.nbDays;
      if (!warning.nbNights.props.obj[1]) return warning.nbNights;
    } catch (error) {}
    return null;
  }
  function handleWarning(val) {
    const warn = _.cloneDeep(warning);
    warn[val[0]] = val[1];
    onHandleColor({
      nbDays: warn.nbDays.props.obj[1],
      nbNights: warn.nbNights.props.obj[1],
    });
    setWarning(warn);
  }
  function handleGlobals(cs, val) {
    if (cs === "value") {
      const dur = _.cloneDeep(duration);
      dur[val[0]] = val[1];
      setDuration(dur);
    }
    onHandleGlobals(cs, val);
  }
  return (
    Object.keys(data).length === 4 && (
      <Col md="2">
        <div className="m-0">
          <input
            id={data.datesType}
            type="checkbox"
            style={{cursor: "pointer"}}
            className="mx-3"
            onChange={handleChange}
            checked={value}
          ></input>
          <label className="mx-0 px-0">
            <h5
              style={{
                whiteSpace: "pre-wrap",
                minWidth: "50px",
              }}
            >
              <FormattedMessage
                id={`src.components.announcePage.booking.${data.datesType.toLowerCase()}`}
              />
            </h5>
          </label>
          {data.daysNights.active && (
            <>
              <DaysNights
                reset={reset}
                data={{
                  type: data.datesType,
                  nbDays: data.daysNights.nbDays,
                  nbNights: data.daysNights.nbNights,
                  dates: data.dates,
                }}
                onHandleWarning={handleWarning}
                onHandleGlobals={handleGlobals}
              ></DaysNights>
              <div className="d-flex justify-content-center">
                {getWarning()}
              </div>
              <Row
                className={`justify-content-md-${
                  data.datesType === "Fixed_Fixed" ? "left" : "center"
                } mx-2 my-4 pt-2`}
                style={{
                  paddingLeft: `${
                    data.datesType === "Flex_Fixed" ? "160%" : "0"
                  }`,
                }}
              >
                <CalendarBlock
                  type={data.datesType}
                  duration={duration}
                  reset={reset}
                  data={data.dates}
                  disabled={
                    data.datesType === "Flex_Flex"
                      ? false
                      : duration.nbDays <= 0
                  }
                  onHandleColor={onHandleColor} //'Proposed dates' label color setting
                  onHandleGlobals={onHandleGlobals}
                ></CalendarBlock>
              </Row>
            </>
          )}
        </div>
      </Col>
    )
  );
}

export default DatesType;
