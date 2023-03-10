import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import classnames from "classnames";
import "./style.css";
import {SwalOkCancel} from "../common/toastSwal/SwalOkCancel.jsx";

function NavBar({type, role, initTab, dirty, onHandleToggle, onHandleDirty}) {
  const {formatMessage} = useIntl();
  const [tab, setTab] = useState(1);
  const [count, setCount] = useState(null);
  useEffect(() => {
    setTab(initTab);
  }, [initTab]);
  async function toggle(idx) {
    if (tab !== idx) {
      if (dirty) {
        const result = await SwalOkCancel(formatMessage, "global.dirty");
        if (result === "cancel") {
          onHandleDirty(true);
          return;
        } else onHandleDirty(false);
      }
      setTab(idx);
      onHandleToggle(idx);
    }
  }
  return (
    <div className="main-wrapper w-100" style={{position: "fixed", zIndex: 2}}>
      <section className="dashboardMenu" style={{marginTop: "65px"}}>
        <nav className="navbar dashboradNav">
          <div className="">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target="#bs-example-navbar-collapse-1"
                aria-expanded="false"
              >
                <span className="sr-only">
                  <FormattedMessage id="src.components.memberPage.DashboardMenu.span" />
                </span>
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
            </div>

            <div
              className="collapse navbar-collapse navspe"
              id="bs-example-navbar-collapse-1"
            >
              <ul
                className="nav navbar-nav dashboardNavLeft d-inline mt-50"
                style={{MarginTop: -90}}
              >
                <li>
                  <a
                    className={classnames({
                      active: tab === 1, //Dashboard
                    })}
                    onClick={() => {
                      toggle(1);
                    }}
                  >
                    <i className="fa fa-tachometer" aria-hidden="true" />
                    <FormattedMessage id="src.components.memberPage.DashboardMenu.link1" />
                  </a>
                </li>
                {type === "pro" || role === "ADMIN" ? (
                  <li>
                    <a
                      id="MyAnnouncesTab"
                      className={classnames({
                        active: tab === 2, //MyAnnounces
                      })}
                      onClick={() => {
                        toggle(2);
                      }}
                    >
                      <i className="fa fa-leanpub" aria-hidden="true" />
                      {role === "ADMIN" ? (
                        <FormattedMessage id="src.components.memberPage.DashboardMenu.link4a" />
                      ) : (
                        <FormattedMessage id="src.components.memberPage.DashboardMenu.link4" />
                      )}
                    </a>
                  </li>
                ) : null}
                <li>
                  <a
                    className={classnames({
                      active: tab === 3, //Bookings
                    })}
                    onClick={() => {
                      toggle(3);
                    }}
                  >
                    <i className="fa fa-calendar-check-o" aria-hidden="true" />
                    {role === "ADMIN" ? (
                      <FormattedMessage id="src.components.memberPage.DashboardMenu.link3a" />
                    ) : (
                      <FormattedMessage id="src.components.memberPage.DashboardMenu.link3" />
                    )}
                  </a>
                </li>
                <li>
                  <a
                    className={classnames({
                      active: tab === 4, //Agenda
                    })}
                    onClick={() => {
                      toggle(4);
                    }}
                  >
                    <i className="fa fa-calendar" aria-hidden="true" />
                    <FormattedMessage id="src.components.memberPage.DashboardMenu.link7" />
                  </a>
                </li>
                {type === "pro" || role === "ADMIN" ? (
                  <li>
                    <a
                      className={classnames({
                        active: tab === 5, //Invoices
                      })}
                      onClick={() => {
                        toggle(5);
                      }}
                    >
                      <i className="fa fa-money" aria-hidden="true" />
                      {role === "ADMIN" ? (
                        <FormattedMessage id="src.components.memberPage.DashboardMenu.link6a" />
                      ) : (
                        <FormattedMessage id="src.components.memberPage.DashboardMenu.link6" />
                      )}
                    </a>
                  </li>
                ) : null}
                <li>
                  <a
                    className={classnames({
                      active: tab === 6, //Messaging
                    })}
                    style={{color: "rgba(255, 255, 255, 0.4) !important"}}
                    onClick={() => {
                      toggle(6);
                    }}
                  >
                    <i className="fa fa-comments" aria-hidden="true" />
                    <span className="notification">
                      <FormattedMessage id="src.components.memberPage.DashboardMenu.link8" />
                    </span>
                    <span className="badge">
                      {count !== null && count !== 0 ? count : ""}
                    </span>
                  </a>
                </li>
                {type === "pro" || role === "ADMIN" ? (
                  <li>
                    <a
                      className={classnames({
                        active: tab === 7, //Corporate data
                      })}
                      onClick={() => {
                        toggle(7);
                      }}
                    >
                      <i className="fa fa-cogs" aria-hidden="true" />
                      <FormattedMessage id="src.components.memberPage.DashboardMenu.link5" />
                    </a>
                  </li>
                ) : null}
                <li>
                  <a
                    className={classnames({
                      active: tab === 8, //Profile
                    })}
                    onClick={() => {
                      toggle(8);
                    }}
                  >
                    <i className="fa fa-user" aria-hidden="true" />
                    <FormattedMessage id="src.components.memberPage.DashboardMenu.link2" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </section>
    </div>
  );
}

export default NavBar;
