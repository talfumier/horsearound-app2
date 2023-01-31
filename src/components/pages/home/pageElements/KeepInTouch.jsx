import {useState} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {handleNewsLetter} from "../../common/Footer";

function KeepInTouch(props) {
  const lang = useIntl().locale;
  const [state, setState] = useState({email: null});
  return (
    <section className="greenSection">
      <div className="container">
        <div className="row gridResize">
          <div className="col-sm-3 col-xs-12">
            <div className="sectionTitleDouble">
              <p>
                <FormattedMessage id="src.components.homePage.newsletter.title1" />
              </p>
              <h2>
                <FormattedMessage id="src.components.homePage.newsletter.title2" />
              </h2>
            </div>
          </div>
          <div className="col-sm-4 col-xs-12">
            <div className="row">
              <div className="col-sm-12 col-xs-12">
                <div className="input-group" style={{marginTop: 10}}>
                  <FormattedMessage id="src.components.homePage.newsletter.email">
                    {(text) => (
                      <input
                        type="email"
                        className="form-control"
                        placeholder={text}
                        style={{height: 40}}
                        id="emailHome"
                        onChange={(e) => setState({email: e.target.value})}
                      />
                    )}
                  </FormattedMessage>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-4 col-xs-12 my-auto">
            <a
              className="btn btn-block btn-success p-2"
              style={{marginTop: 8}}
              onClick={() => {
                handleNewsLetter(state.email, lang);
              }}
            >
              <FormattedMessage id="src.components.homePage.newsletter.register" />{" "}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default KeepInTouch;
