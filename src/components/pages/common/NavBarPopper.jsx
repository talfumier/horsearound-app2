import {useIntl, FormattedMessage} from "react-intl";
import {Link} from "react-router-dom";
import {Popper, Paper, Card, Grow, ClickAwayListener} from "@mui/material";

function NavBarPopper({id, open, anchor, onClose, intlId, ul, noLink}) {
  //noLink=true for announce creation/edit in member page, otherwise noLink=undefined
  const {messages} = useIntl();
  const keys = Object.keys(messages).filter((key) =>
    key.startsWith(`${intlId[0]}${intlId[2]}`)
  );
  let dataL0 = keys.filter((key) => key.includes(intlId[3]));
  dataL0 = dataL0.map((key) => key.replace(intlId[3], ""));
  let l0_key = null,
    l1_key = null;
  return (
    <Popper
      id="popper"
      open={open}
      anchorEl={anchor}
      transition
      disablePortal
      style={{zIndex: 100, minWidth: 600}}
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
            <Paper id="menu-list-grow">
              <ClickAwayListener onClickAway={onClose}>
                <Card className="row p-2" elevation={0}>
                  {ul.map(([start, end]) => {
                    return (
                      <ul key={start} className="list-unstyled m-4">
                        {dataL0.slice(start, end).map((l0) => {
                          let dataL1 = Object.keys(messages).filter((key) =>
                            key.startsWith(`${l0}${intlId[4]}`)
                          );
                          l0_key = l0.substring(l0.lastIndexOf(".") + 1);
                          return (
                            <ul className="mb-2" key={l0}>
                              <li key={l0}>
                                <b>
                                  <FormattedMessage id={`${l0}${intlId[3]}`} />
                                </b>
                                <ul className="ml-4">
                                  {dataL1.map((key) => {
                                    l1_key = key.substring(
                                      key.lastIndexOf(".") + 1
                                    );
                                    return (
                                      <li key={key} className="">
                                        <Link
                                          id={`${l0_key}/${l1_key}`}
                                          style={{color: "black"}}
                                          disabled={true}
                                          to={`${
                                            id === "destinations"
                                              ? "/destinations/"
                                              : "/activities/"
                                          }${l0_key}/${l1_key}`}
                                          onClick={(e) => {
                                            if (noLink) e.preventDefault();
                                            onClose(e);
                                          }}
                                        >
                                          <FormattedMessage id={key} />
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </li>
                            </ul>
                          );
                        })}
                      </ul>
                    );
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

export default NavBarPopper;
