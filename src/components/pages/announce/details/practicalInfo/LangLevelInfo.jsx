import React, {useState, useRef} from "react";
import {FormattedMessage} from "react-intl";
import {StarRatingLevel} from "../../../utils/Ratings";
import SinglePopper from "../common/SinglePopper";

function LangLevelInfo({label, l0, l1_title, l1_desc, range, levels}) {
  const ref = useRef();
  const [state, setState] = useState(false);
  function handleToggle(e, cs) {
    if (e.target.id === "btn_info" && cs === "clickAway") return;
    setState(!state);
  }
  return (
    <div className="row mb-4 w-100 ">
      <h5 className="media-heading ml-4 font-weight-bold">
        <FormattedMessage id={label} />
      </h5>
      {Object.keys(levels).map((lang, idx) => {
        return (
          levels[lang].level > 0 && (
            <React.Fragment key={idx}>
              <img
                key={idx}
                src={levels[lang].img}
                style={{
                  width: "25px",
                  height: "17px",
                  marginLeft: "17px",
                  marginRight: "7px",
                }}
                alt={`${lang} flag`}
              />
              <StarRatingLevel key={`${idx}x`} level={levels[lang].level} />
            </React.Fragment>
          )
        );
      })}
      <button
        id="btn_info"
        className="fa fa-info-circle fa-2x"
        style={{color: "#7AA095", border: "0", marginLeft: "10px"}}
        onClick={handleToggle}
      ></button>
      <div ref={ref} className="d-inline" style={{width: "20px"}}></div>
      <SinglePopper
        anchor={ref.current}
        l0={l0}
        l1_title={l1_title}
        l1_desc={l1_desc}
        range={range}
        open={state}
        onClose={(e) => {
          handleToggle(e, "clickAway");
        }}
      ></SinglePopper>
    </div>
  );
}

export default LangLevelInfo;
