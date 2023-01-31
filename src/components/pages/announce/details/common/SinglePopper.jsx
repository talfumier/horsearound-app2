import {FormattedMessage} from "react-intl";
import {Popper, Paper, Card, Grow, ClickAwayListener} from "@mui/material";

function SinglePopper({anchor, l0, l1_title, l1_desc, range, open, onClose}) {
  return (
    <Popper
      placement="right-start"
      open={open}
      anchorEl={anchor}
      transition
      disablePortal
      style={{zIndex: 100}}
    >
      {({TransitionProps, placement}) => (
        <Grow
          {...TransitionProps}
          /* style={{
            transformOrigin: placement === "right-start", //placement === "bottom" ? "center top" : "center bottom",
          }} */
        >
          <div>
            <Paper id="menu-list-grow">
              <ClickAwayListener onClickAway={onClose}>
                <Card
                  style={{width: "500px"}}
                  className="row p-2"
                  elevation={0}
                >
                  {
                    <ul className="mb-2" key={l0}>
                      <li key={l0}>
                        <b>{/* <FormattedMessage id={l0} /> */}</b>
                        <ul>
                          {range.map((idx) => {
                            return (
                              <li key={idx}>
                                <p className="mx-2 my-0" key={idx}>
                                  <span className="font-weight-bold">
                                    <FormattedMessage
                                      id={`${l1_title}${idx}`}
                                    />
                                  </span>{" "}
                                  <FormattedMessage id={`${l1_desc}${idx}`} />
                                </p>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    </ul>
                  }
                </Card>
              </ClickAwayListener>
            </Paper>
          </div>
        </Grow>
      )}
    </Popper>
  );
}

export default SinglePopper;
