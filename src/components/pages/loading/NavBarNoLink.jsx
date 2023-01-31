import {FormattedMessage} from "react-intl";
import LanguageSwitch from "../../intl/LanguageSwitch";

function NavBarNoLink() {
  return (
    <header>
      <div className="container">
        <nav
          className="navbar navbar-default navbar-fixed-top lightHeader px-5 "
          role="navigation"
        >
          <div className="row">
            <div className="navbar-header mt-n2">
              <a style={{color: "black"}} className="navbar-brand" />
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
                    <a style={{color: "black"}} className="dropdown singleDrop">
                      <FormattedMessage id="src.components.allPages.Menu.navbar.home" />
                    </a>
                  </li>
                  <li className="dropdown megaDropMenu ">
                    <a
                      style={{color: "black"}}
                      to={"/about"}
                      className="dropdown singleDrop"
                    >
                      <FormattedMessage id="src.components.allPages.Menu.navbar.aboutUs" />
                    </a>
                  </li>
                  <li
                    className="dropdown megaDropMenu "
                    style={{paddingTop: "38px"}}
                  >
                    <a
                      aria-controls="customized-menu"
                      aria-haspopup="true"
                      className="dropdown singleDrop mb-0 pt-0"
                      color="primary"
                    >
                      <FormattedMessage id="src.components.allPages.Menu.navbar.destinations.title" />
                    </a>
                  </li>
                  <li
                    className="dropdown megaDropMenu "
                    style={{paddingTop: "38px"}}
                  >
                    <a
                      aria-controls="customized-menu"
                      aria-haspopup="true"
                      className="dropdown singleDrop mb-0 pt-0"
                      color="primary"
                    >
                      <FormattedMessage id="src.components.allPages.Menu.navbar.activities.title" />
                    </a>
                  </li>
                  <LanguageSwitch noLink={true} />
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default NavBarNoLink;
