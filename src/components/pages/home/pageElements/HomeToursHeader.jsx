import React, {useState} from "react";
import {FormattedMessage} from "react-intl";

function HomeToursHeader({catsPack, onChangePackage}) {
  const [state, setState] = useState({active: "all"});
  return (
    <React.Fragment>
      <div className="row">
        <div className="col-xs-12" style={{height: "80px"}}>
          <div className="sectionTitle">
            <h2>
              <span>
                <FormattedMessage id="src.components.homePage.HomePageToursPackage.title" />
              </span>
            </h2>
            <p>
              <FormattedMessage id="src.components.homePage.HomePageToursPackage.phrase" />
            </p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12">
          <div className="filter-container isotopeFilters">
            <ul className="list-inline filter">
              {Object.keys(catsPack).map((key) => {
                return (
                  <li
                    className={key === state.active ? "active" : ""}
                    key={key}
                  >
                    <a
                      key={key}
                      onClick={() => {
                        setState({active: key});
                        onChangePackage(key);
                      }}
                    >
                      <FormattedMessage
                        id={catsPack[key].id}
                      ></FormattedMessage>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default HomeToursHeader;
