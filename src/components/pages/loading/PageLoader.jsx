import {FormattedMessage} from "react-intl";
//import logo from "../../../images/logo-dark.png";

function PageLoader({origin}) {
  return (
    <div
      className="col col-12 flex-center "
      style={{
        top: "20%",
        left: "40%",
        position: "fixed",
        width: "20%",
        backgroundColor: "#7aa095",
        borderRadius: "5px",
        border: "1px solid yellow",
      }}
    >
      {/* <img src={logo} alt="page loader" className="mx-auto d-block mb-4" /> */}
      <div
        className="d-flex justify-content-center  mx-auto my-4"
        style={{fontSize: "1.7rem", color: "#ffffff"}}
      >
        <FormattedMessage id="user_msg.standard.dataLoading" />
        {`(${origin})`}
      </div>
      <div className="d-flex justify-content-center mx-auto my-4">
        <div
          className="spinner-border text-primary"
          style={{width: "3rem", height: "3rem", margin: "1rem"}}
          role="status"
        ></div>
        <div
          className="spinner-border text-secondary"
          style={{width: "3rem", height: "3rem", margin: "1rem"}}
          role="status"
        ></div>
        <div
          className="spinner-border text-success"
          style={{width: "3rem", height: "3rem", margin: "1rem"}}
          role="status"
        ></div>
        <div
          className="spinner-border text-danger"
          style={{width: "3rem", height: "3rem", margin: "1rem"}}
          role="status"
        ></div>
        <div
          className="spinner-border text-warning"
          style={{width: "3rem", height: "3rem", margin: "1rem"}}
          role="status"
        ></div>
        <div
          className="spinner-border text-info"
          style={{width: "3rem", height: "3rem", margin: "1rem"}}
          role="status"
        ></div>
      </div>
    </div>
  );
}

export default PageLoader;
