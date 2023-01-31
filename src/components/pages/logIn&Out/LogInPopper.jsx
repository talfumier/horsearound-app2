import {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {Popper, Paper, Card, Grow, ClickAwayListener} from "@mui/material";
import {CloseOutlined} from "@mui/icons-material";
import {IconButton} from "@mui/material";
import FormLogin from "./FormLogin";

function LogInPopper({open, anchor, onClose}) {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname !== "/") onClose(); //close popper when moving from one page to the other
  }, [location]);
  return (
    <Popper
      id="popper"
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
              placement === "bottom" ? "center top" : "center bottom",
          }}
        >
          <div>
            <Paper style={{width: "400px"}} id="menu-list-grow">
              <ClickAwayListener
                mouseEvent="onMouseDown"
                onClickAway={() => {
                  onClose(0);
                }}
              >
                <Card
                  className="row p-2 d-flex flex-row-reverse "
                  elevation={0}
                  style={{backgroundColor: "#EEEEEE", position: "relative"}}
                >
                  <IconButton
                    onClick={() => {
                      onClose(0);
                    }}
                    style={{backgroundColor: "#D9D9D9", position: "absolute"}}
                  >
                    <CloseOutlined />
                  </IconButton>
                  <FormLogin onClose={onClose}></FormLogin>
                </Card>
              </ClickAwayListener>
            </Paper>
          </div>
        </Grow>
      )}
    </Popper>
  );
}
export default LogInPopper;
