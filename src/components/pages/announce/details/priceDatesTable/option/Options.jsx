import {useState, useEffect} from "react";
import {useIntl} from "react-intl";
import {Card} from "@mui/material";
import _ from "lodash";
import {
  getFormattedDate,
  sumOfPropsValues,
} from "../../../../utils/utilityFunctions.js";
import BookingRecap from "../booking/payment/BookingRecap.jsx";

function Options({dataIn, recap, locks, mt, onHandleOptions}) {
  const {locale, formatMessage} = useIntl();
  const {datesType, options, devise} = dataIn.announce;
  const {dateParticipants} = dataIn;
  let dates = null;
  if (datesType === "Fixed_Fixed") dates = dataIn.dates;
  else dates = dataIn.selection;
  const [dateOptions, setDateOptions] = useState({});
  useEffect(() => {
    const dt_opts = {};
    let obj = {};
    dates.map((date, idx) => {
      if (sumOfPropsValues(dateParticipants[date.id].booking) > 0) {
        obj = {};
        options.map((opt) => {
          obj[opt.option] = false;
        });
        dt_opts[date.id] = obj;
      }
    });
    setDateOptions(dt_opts);
  }, [dates]);
  function handleOptions(dateId, optionId) {
    const dt_opts = _.cloneDeep(dateOptions);
    dt_opts[dateId] = {
      ...dt_opts[dateId],
      [optionId]: !dt_opts[dateId][optionId],
    };
    setDateOptions(dt_opts);
    onHandleOptions(dateId, dt_opts[dateId]);
  }
  return (
    <>
      <BookingRecap recap={recap} announce={dataIn.announce}></BookingRecap>
      <Card
        variant="outlined"
        style={{
          marginTop: mt ? mt : 20,
          marginLeft: "10px",
          marginRight: "10px",
          paddingBottom: "40px",
          width: "75%",
          borderWidth: "1px",
        }}
      >
        <div className="container">
          {options.map((option, idx) => {
            return (
              <div key={idx}>
                <div className="row align-items-start mt-1">
                  <div className="col-5 mt-4">
                    <label>
                      <h6 style={{margin: 0}}>
                        {`${formatMessage({
                          id: "src.components.bookingPage.StepOptions.option#",
                        })} ${option.option}`}
                      </h6>
                    </label>
                    <textarea
                      className="form-control"
                      disabled={true}
                      value={`${option.title[locale]}\n${option.description[locale]}`}
                    ></textarea>
                  </div>
                  <div className="col-2 mt-4">
                    <label>
                      <h6 style={{margin: 0}}>
                        {`${formatMessage({
                          id: "src.components.bookingPage.StepOptions.optionPrice",
                        })}`}
                      </h6>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      disabled={true}
                      value={`${option.price} ${devise}   ${formatMessage({
                        id: `src.components.memberPage.tabs.annonces.details.AddOption.option${option.type}`,
                      })}`}
                    ></input>
                  </div>
                </div>
                {dates.map((date, i) => {
                  return (
                    dateOptions[date.id] && (
                      <div
                        key={10 * idx + i}
                        className="row align-items-start mt-2 pt-0"
                      >
                        <div className="d-flex justify-content-left ml-4 pl-4 mt-1">
                          <h5
                            className="ml-4 mt-1 pt-1"
                            style={{paddingLeft: "20px"}}
                          >
                            {`${getFormattedDate(
                              date.startDate,
                              "dd.MM.yyy"
                            )} - ${getFormattedDate(
                              date.endDate,
                              "dd.MM.yyy"
                            )}`}
                          </h5>
                          <input
                            id="option"
                            type="checkbox"
                            className="form-check-input mt-2 ml-4"
                            disabled={locks}
                            onChange={() => {
                              handleOptions(date.id, option.option);
                            }}
                            checked={dateOptions[date.id][option.option]}
                          ></input>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

export default Options;
