import {useRef, useState} from "react";
import {Link} from "react-router-dom";
import {FormattedMessage, useIntl} from "react-intl";
import NavBarPopper from "./NavBarPopper";
import {SwalOkCancel} from "./toastSwal/SwalOkCancel.jsx";

function NavBarDropDown({id, intlId, ul, dirty}) {
  const ref = useRef();
  const {formatMessage} = useIntl();
  const [state, setState] = useState(false);
  async function handleToggle(e) {
    if (dirty) {
      let result = "ok";
      e.preventDefault();
      result = await SwalOkCancel(formatMessage, "global.dirty");
      if (result === "ok") setState(true);
    } else setState(!state);
  }
  function handleClose() {
    setState(false);
  }
  return (
    <li className="dropdown megaDropMenu" style={{paddingTop: "38px"}}>
      <Link
        ref={ref}
        to={""}
        onClick={handleToggle}
        aria-controls="customized-menu"
        aria-haspopup="true"
        className="dropdown singleDrop mb-0 pt-0"
        color="primary"
      >
        <FormattedMessage id={`${intlId[0]}${intlId[1]}`} />
      </Link>
      <NavBarPopper
        id={id}
        open={state}
        anchor={ref.current}
        onClose={handleClose}
        intlId={intlId}
        ul={ul}
      ></NavBarPopper>
    </li>
  );
}

export default NavBarDropDown;
