import {useState} from "react";
import {Link} from "react-router-dom";
import {FormattedMessage, useIntl} from "react-intl";
import {toastError, toastSuccess} from "./toastSwal/ToastMessages.js";
import {translate} from "../../../services/httpGoogleServices.js";
import {postNewsLetter} from "../../../services/httpUsers";
import logoColor from "../../../images/logo-color-sm.png";

export async function handleNewsLetter(email, lang) {
  const res = await postNewsLetter(email);
  if (res.data.statusCode >= 400 && res.data.statusCode < 500)
    toastError(
      lang === "en"
        ? res.data.description
        : await translate({text: res.data.description, lang}) //message sent back from API
    );
  else
    toastSuccess(
      <FormattedMessage id="src.components.allPages.Footer.toastNewsletter" />
    );
}
function Footer({noLink}) {
  const lang = useIntl().locale;
  const [state, setState] = useState({email: null});
  return (
    <footer
      style={{
        position: "absolute",
        bottom: "-10000",
        width: "100%",
        height: "-200%",
      }}
    >
      <div className="footer clearfix m-0 p-0">
        <div className="container">
          <div className="row ">
            <div className="col-xl-4 col-lg-6 col-sm-9 col-xs-12">
              <div className="footerContent ">
                {noLink ? null : (
                  <Link to={"/"} className="footer-logo">
                    <img
                      src={logoColor}
                      alt="footer-logo"
                      style={{marginTop: "5px"}}
                    />
                  </Link>
                )}
                <p>
                  <FormattedMessage id="src.components.allPages.Footer.desHorseAround" />
                </p>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-sm-9 col-xs-12">
              <div className="footerContent">
                <h5>
                  <FormattedMessage id="src.components.allPages.Footer.supportHorseAround" />
                </h5>
                <p>
                  <FormattedMessage id="src.components.allPages.Footer.contactText" />
                </p>
                <ul className="list-unstyled">
                  <li>
                    <i className="fa fa-home" aria-hidden="true" />
                    <FormattedMessage id="global.address" />
                  </li>
                  <li>
                    <i className="fa fa-phone" aria-hidden="true" />
                    <FormattedMessage id="global.phone" />
                  </li>
                  <li>
                    <i className="fa fa-envelope-o" aria-hidden="true" />
                    <a href="mailTo:info@horse-around.com">
                      <FormattedMessage id="global.email" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-sm-9 col-xs-12">
              <div className="footerContent">
                <h5>newsletter</h5>
                <p>
                  <FormattedMessage id="src.components.allPages.Footer.desNewsletter" />
                </p>
                <div className="input-group">
                  <FormattedMessage id="src.components.allPages.Menu.userSpace.email">
                    {(text) => (
                      <input
                        type="email"
                        className="form-control"
                        placeholder={text}
                        id="emailhome"
                        aria-describedby="basic-addon21"
                        onChange={(e) => {
                          setState({email: e.target.value});
                        }}
                      />
                    )}
                  </FormattedMessage>
                  <span className="input-group-addon" id="basic-addon21">
                    <i
                      className="fa fa-long-arrow-right"
                      aria-hidden="true"
                      style={{cursor: "pointer", marginLeft: "-5px"}}
                      onClick={() => {
                        handleNewsLetter(state.email, lang);
                      }}
                    />
                  </span>
                </div>
                <ul className="list-inline">
                  <li>
                    <a
                      href="https://www.facebook.com/Horse-Around-102659337783267/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fa fa-facebook" aria-hidden="true" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.pinterest.fr/H0rseAr0und/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fa fa-pinterest-p" aria-hidden="true" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/horsearound_off/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fa fa-instagram" aria-hidden="true" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copyRight clearfix">
        <div className="container">
          <div className="row">
            <div className="col-sm-6 col-sm-push-6 col-xs-12">
              <ul className="list-inline">
                <li>
                  <a href="/CGU-CGV">
                    <FormattedMessage id="src.components.allPages.Footer.linkSupport.CGU" />
                  </a>
                </li>
                <li>
                  <a href="/mentions-legales">
                    <FormattedMessage id="src.components.allPages.Footer.linkSupport.legalMention" />
                  </a>
                </li>
                <li>
                  <a href="/about">
                    <FormattedMessage id="src.components.allPages.Footer.linkSupport.aboutUs" />
                  </a>
                </li>
                <li>
                  <a href="/support">
                    <FormattedMessage id="src.components.allPages.Footer.linkSupport.support" />
                  </a>
                </li>
                {/*<!--<li><a href="#">Blog</a></li>-->*/}
              </ul>
            </div>
            <div className="col-sm-6 col-sm-pull-6 col-xs-12 m-0 p-0">
              <div className="copyRightText">
                <p>
                  <FormattedMessage id="src.components.allPages.Footer.copyright" />{" "}
                  <FormattedMessage id="src.components.allPages.Footer.poweredBy" />
                  <a
                    target="_blank"
                    href="https://horse-around.com/"
                    rel="noopener noreferrer"
                  >
                    {" "}
                    horse-around.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
