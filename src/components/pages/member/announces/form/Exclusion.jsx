import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";

function Exclusion() {
  const {formatMessage} = useIntl();
  return (
    <>
      <div className="flex d-flex m-0 p-0">
        <label className="mx-0 pl-1">
          <h5
            style={{
              minWidth: "50px",
            }}
          >
            <FormattedMessage id="global.days" />
          </h5>
        </label>
        <select
          id="daysDD"
          className="form-select form-select-lg"
          style={{
            cursor: "pointer",
            width: "100px",
            height: "30px",
            fontSize: "15px",
          }}
          multiple
          size="1"
        >
          <option selected>Open this select menu</option>
          {`${formatMessage({id: "global.weekdays"})}`
            .split(",")
            .map((day, idx) => {
              return <option key={idx}>{day}</option>;
            })}
        </select>
        <input
          id="days_excl"
          type="text"
          style={{
            width: "300px",
            textAlign: "center",
            border: "solid 1px",
            fontSize: "15px",
          }}
          className="mx-4 mt-2"
        ></input>
      </div>
      <div className="m-0 p-0">
        <label className="mx-0 pl-1">
          <h5
            style={{
              minWidth: "50px",
            }}
          >
            <FormattedMessage id="global.dates" />
          </h5>
        </label>
      </div>
    </>
  );
}

export default Exclusion;
