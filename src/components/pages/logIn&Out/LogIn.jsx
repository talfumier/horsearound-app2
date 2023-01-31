import {useRef, useState, useEffect} from "react";
import {FormattedMessage} from "react-intl";
import {useCookies} from "react-cookie";
import LogInPopper from "./LogInPopper";

function LogIn() {
  const [cookies, setCookie] = useCookies(["user"]);
  const ref = useRef();
  const [state, setState] = useState(false);
  function handleClose(cs) {
    setTimeout(
      () => {
        setState(false);
      },
      cs !== 0 ? 2000 : 0
    );
  }
  return (
    <li id="loginButtonHorseAround" className="dropdown singleDrop ">
      <div
        ref={ref}
        className="dropdown singleDrop btn btn-success mt-5"
        onMouseDown={() => setState(true)}
      >
        {cookies.user ? (
          <FormattedMessage id="src.components.allPages.Menu.userSpace.logout" />
        ) : (
          <FormattedMessage id="src.components.allPages.Menu.userSpace.login" />
        )}
      </div>
      <LogInPopper
        open={state}
        anchor={ref.current}
        onClose={handleClose}
      ></LogInPopper>
    </li>
  );
}

export default LogIn;
