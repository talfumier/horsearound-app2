import {useState, useRef} from "react";
import {FormattedMessage} from "react-intl";
import SinglePopper from "./SinglePopper";

function LevelInfo({label, l0, l1_title, l1_desc, range, rating}) {
  const ref = useRef();
  const [state, setState] = useState(false);
  function handleToggle(e, cs) {
    if (e.target.id === "btn_info" && cs === "clickAway") return;
    setState(!state);
  }
  return (
    <div className="row mb-4 w-100">
      {label !== null ? (
        <h5 className="media-heading ml-4 mb-0 font-weight-bold">
          <FormattedMessage id={label} />
        </h5>
      ) : null}
      <div className="pl-4 pr-4">{rating}</div>
      <button
        id="btn_info"
        className="fa fa-info-circle fa-2x"
        style={{
          color: "#7AA095",
          background: "transparent",
          border: "0",
          maxWidth: "15px",
        }}
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

export default LevelInfo;
