import {useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FormattedMessage, useIntl} from "react-intl";
import Tooltip from "@mui/material/Tooltip";
import {useCookies} from "react-cookie";
import ImagesContext from "./context/ImagesContext.js";
import NavBarDropDown from "./NavBarDropDown";
import LanguageSwitch from "../../intl/LanguageSwitch";
import LogIn from "../logIn&Out/LogIn";
import {decodeJWT} from "../../../services/httpUsers.js";
import {SwalOkCancel} from "./toastSwal/SwalOkCancel.jsx";

function NavBar({dirty, onHandleDirty}) {
  const navigate = useNavigate();
  const {formatMessage} = useIntl();
  const [cookies, setCookie] = useCookies(["user"]);
  const currentUser = cookies.user ? decodeJWT(cookies.user) : null;
  const contextImages = useContext(ImagesContext);
  async function handleDirty(e, path) {
    let result = "ok";
    if (dirty) {
      e.preventDefault();
      result = await SwalOkCancel(formatMessage, "global.dirty");
    }
    if (result === "ok") {
      navigate(path);
      onHandleDirty(false);
    }
  }
  return (
    <header>
      <div className="container">
        <nav
          className="navbar navbar-default navbar-fixed-top lightHeader px-5 "
          role="navigation"
        >
          <div className="row">
            <div className="navbar-header mt-n2">
              <Link
                style={{color: "black"}}
                className="navbar-brand"
                to={dirty ? "" : "/"}
                onClick={async (e) => {
                  await handleDirty(e, "/");
                }}
              />
            </div>
            <div className="mx-auto mt-n2">
              <div
                className="collapse navbar-collapse navbar-ex1-collapse mt-n2 mx-auto"
                id="navbar-ex1-collapse"
                style={{backgroundColor: "white"}}
              >
                <ul
                  className="nav navbar-nav mx-auto w-auto"
                  style={{
                    display: "inline",
                  }}
                >
                  <li className="dropdown singleDrop">
                    <Link
                      style={{color: "black"}}
                      to={dirty ? "" : "/"}
                      onClick={async (e) => {
                        await handleDirty(e, "/");
                      }}
                      className="dropdown singleDrop"
                    >
                      <FormattedMessage id="src.components.allPages.Menu.navbar.home" />
                    </Link>
                  </li>
                  <li className="dropdown megaDropMenu ">
                    <Link
                      style={{color: "black"}}
                      to={dirty ? "" : "/about"}
                      className="dropdown singleDrop"
                      onClick={async (e) => {
                        await handleDirty(e, "/about");
                      }}
                    >
                      <FormattedMessage id="src.components.allPages.Menu.navbar.aboutUs" />
                    </Link>
                  </li>
                  <NavBarDropDown
                    id="destinations"
                    intlId={[
                      "src.components.allPages.Menu.navbar.destinations",
                      ".title",
                      ".continents",
                      ".continentName",
                      ".countries",
                    ]} //ul slicing layout
                    ul={[
                      [0, 1],
                      [1, 3],
                      [3, 6],
                    ]}
                    dirty={dirty}
                  ></NavBarDropDown>
                  <NavBarDropDown
                    id="activities"
                    intlId={[
                      "src.components.allPages.Menu.navbar.activities",
                      ".title",
                      ".types",
                      ".title",
                      ".subactivities",
                    ]} //ul slicing layout
                    ul={[
                      [0, 2],
                      [2, 4],
                      [4, 6],
                    ]}
                    dirty={dirty}
                  ></NavBarDropDown>
                  <LogIn></LogIn>
                  <LanguageSwitch images={contextImages} />
                </ul>
              </div>
            </div>
            {cookies.user && (
              <div className="row align-items-center dropdown singleDrop ml-4 pb-4 w100 ">
                <Tooltip
                  title={
                    <FormattedMessage id="src.components.allPages.Menu.userSpace.tooltip"></FormattedMessage>
                  }
                  arrow
                >
                  <Link
                    className="ml-4 pl-4 fa fa-user fa-2x "
                    to={"/member"}
                    style={{
                      border: "0",
                      cursor: "pointer",
                    }}
                  ></Link>
                </Tooltip>
                <h5 className="ml-4" style={{fontSize: "1.8rem"}}>
                  {currentUser.firstName
                    ? currentUser.firstName.toLowerCase()
                    : currentUser.email
                    ? currentUser.email
                    : null}
                </h5>
                <h5
                  id="horseAround_navbar_timer"
                  className="mt-3 pt-1 mx-2"
                  style={{
                    color: `rgb(255, 102, 0)`,
                    fontWeight: "bolder",
                    width: "50px",
                  }}
                ></h5>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
