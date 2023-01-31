import {Link} from "react-router-dom";
import {FormattedMessage} from "react-intl";
import Banner from "./common/Banner";
import Meta from "./common/Meta";

function NotFound() {
  return (
    <div>
      <Meta id="notFound"></Meta>
      <div className="main-wrapper">
        <Banner title={<FormattedMessage id="src.pages.NotFound.title" />} />
        <div
          className="container"
          style={{
            marginTop: "25px",
            marginBottom: "50px",
            minHeight: "300px",
          }}
        >
          <br />
          <h1
            style={{
              marginTop: "25px",
              marginBottom: "25px",
              textAlign: "center",
            }}
          >
            <FormattedMessage id="src.pages.NotFound.text" />
          </h1>
          <br />
          <br />
          <br />
          <br />
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex justify-content-center">
              <Link className="btn btn-xs btn-success p-3 " to={"/"}>
                <FormattedMessage id="src.pages.NotFound.goHome" />
              </Link>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mt-xl-0 mt-lg-0 mt-md-0 mt-sm-0 mt-2 d-flex justify-content-center">
              <Link className="btn btn-xs btn-success p-3" to={"/announces"}>
                <FormattedMessage id="src.pages.NotFound.discover" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
