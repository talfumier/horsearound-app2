import {useState} from "react";
import {FormattedMessage} from "react-intl";
import {Card} from "@mui/material";
import BookingRecap from "./BookingRecap";
import PersonalInfo from "../PersonalInfo";
import {RenderInWindow} from "../../../../../common/RenderInWindow";
import RulesCancellation from "./RulesCancellation";

function InvoiceInfo({
  announce,
  data,
  recap,
  personalData,
  locks,
  cbSame,
  cbAccept,
  onHandleCbSame,
  onHandleCbAccept,
  onHandleDataOut,
  onHandleTabsCheck,
}) {
  const [open, setOpen] = useState();
  const alert = () => {
    return !cbAccept ? (
      <div
        className="d-flex alert alert-danger justify-content-center ml-4 mt-0 mb-0 p-2"
        style={{fontSize: "1.3rem", maxWidth: "45%"}}
      >
        <strong>
          <FormattedMessage id="src.components.bookingPage.StepThreeForm.alertCBaccept" />
        </strong>
      </div>
    ) : null;
  };
  return (
    <>
      <BookingRecap recap={recap} announce={announce}></BookingRecap>
      <Card
        variant="outlined"
        style={{
          marginTop: "20px",
          marginLeft: "10px",
          marginRight: "10px",
          paddingBottom: "15px",
          width: "75%",
        }}
      >
        <div className="d-flex row  ">
          <div className="col-3 ml-3 ">
            <h5 style={{fontWeight: "bold"}}>
              <FormattedMessage id="src.components.bookingPage.StepThreeForm.invoiceAdress" />
            </h5>{" "}
          </div>
          <div className="col-4 mt-2 pt-1">
            <input
              id="same"
              type="checkbox"
              className="form-check-input"
              disabled={locks}
              onChange={() => {
                onHandleCbSame(!cbSame);
                //setState(!cbSame);
              }}
              checked={cbSame}
            ></input>
            <label htmlFor="same">
              <h5 style={{marginLeft: "20px", marginTop: "3px"}}>
                <FormattedMessage id="src.components.bookingPage.StepThreeForm.invoiceCBsame" />
              </h5>
            </label>
          </div>
        </div>
        <PersonalInfo
          type={1}
          dataIn={personalData}
          cbSame={cbSame}
          locks={locks}
          onHandleCbSame={onHandleCbSame}
          onHandleDataOut={onHandleDataOut}
          onHandleTabsCheck={onHandleTabsCheck}
        ></PersonalInfo>
        <div className="d-flex align-items-top m-4">
          <input
            id="accept"
            type="checkbox"
            className="form-check-input mt-0"
            disabled={locks}
            onChange={() => {
              onHandleCbAccept(!cbAccept);
            }}
            checked={cbAccept}
          ></input>
          <label htmlFor="accept">
            <h5
              style={{
                marginLeft: "20px",
                marginTop: 0,
                marginBottom: 0,
                paddingBottom: 0,
              }}
            >
              <FormattedMessage id="src.components.bookingPage.StepThreeForm.invoiceCBaccept" />
              {" *"}
            </h5>
          </label>
          <button
            id="btn_info"
            className="fa fa-info-circle fa-2x pt-1 pl-3"
            style={{
              color: "#7AA095",
              background: "transparent",
              border: "0",
              maxWidth: "15px",
              marginTop: "-8px",
            }}
            onClick={() => {
              setOpen(!open);
            }}
          ></button>
          {open && (
            <RenderInWindow
              comp={<RulesCancellation></RulesCancellation>} //to be replaced by PdfViewer when pdf file is on the server at http:/...
              size={{width: 600, height: 400, x: 400, y: 200}}
              onClose={() => {
                setOpen(false);
              }}
            ></RenderInWindow>
          )}
        </div>
        {alert()}
      </Card>
    </>
  );
}

export default InvoiceInfo;
