import {useState, useRef} from "react";
import {useIntl} from "react-intl";
import {
  Tooltip,
  Popper,
  Paper,
  Card,
  Grow,
  ClickAwayListener,
} from "@mui/material";

function PopperInfo({data, idTT, icon}) {
  const ref = useRef();
  const {formatMessage} = useIntl();
  const [state, setState] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  function handleToggle(e, cs) {
    setOpen(false);
    if (e.target.id === "btn_info" && cs === "clickAway") return;
    setState(!state);
  }
  return (
    <div className="row ml-5 mb-5 mt-1 w-100">
      <Tooltip
        title={formatMessage({
          id: idTT,
        })}
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        arrow
      >
        <button
          ref={ref}
          id="btn_info"
          className={icon}
          style={{
            color: "#7AA095",
            background: "transparent",
            border: "0",
          }}
          onClick={handleToggle}
        ></button>
      </Tooltip>
      <div className="d-inline" style={{width: "20px"}}></div>
      <PopperWindow
        anchor={ref.current}
        data={data}
        open={state}
        onClose={(e) => {
          handleToggle(e, "clickAway");
        }}
      ></PopperWindow>
    </div>
  );
}
export default PopperInfo;

function PopperWindow({anchor, data, open, onClose}) {
  return (
    <Popper
      placement="bottom"
      open={open}
      anchorEl={anchor}
      transition
      disablePortal
      style={{zIndex: 100}}
    >
      {({TransitionProps, placement}) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin:
              placement === "bottom" ? "center bottom" : "center bottom",
          }}
        >
          <div>
            <Paper id="menu-list-grow ">
              <ClickAwayListener onClickAway={onClose}>
                <Card
                  style={{
                    width: "270px",
                    marginTop: "20px",
                    paddingLeft: "20px",
                  }}
                  className="row "
                  elevation={0}
                >
                  {data.map((item, idx) => {
                    return <ul className="mb-2" key={idx}>{`${item[0]}`}</ul>;
                  })}
                </Card>
              </ClickAwayListener>
            </Paper>
          </div>
        </Grow>
      )}
    </Popper>
  );
}
