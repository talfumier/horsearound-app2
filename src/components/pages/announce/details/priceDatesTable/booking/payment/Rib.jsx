import {FormattedMessage, useIntl} from "react-intl";

function Rib({
  data,
  cbPayment1,
  prt = false,
  locks,
  onHandleOpen,
  onHandleCbPayment,
}) {
  const {
    bankCode,
    guichetCode,
    numberAccount,
    keyAccount,
    deviseAccount,
    iban,
    bic,
  } = data;
  const {formatMessage} = useIntl();
  return (
    <>
      {!prt && (
        <div className="d-flex justify-content-between">
          <FormattedMessage id="src.components.bookingPage.StepThreeForm.tab1Msg" />
          <i
            className="fa fa-print fa-lg mt-2 mr-3 "
            style={{
              color: "#7AA095",
              border: "0",
              cursor: "pointer",
            }}
            onClick={() => {
              onHandleOpen("rib");
            }}
          ></i>
        </div>
      )}
      <div className="container">
        <div className="row align-items-start mt-3">
          <div className="col-2">
            <label>
              <h6 style={{fontWeight: "bolder", margin: 0}}>
                <FormattedMessage id="src.components.bookingPage.StepThreeForm.bankCode" />
              </h6>
            </label>
            <input
              type="text"
              className="form-control"
              disabled={true}
              value={bankCode}
              style={{minWidth: "50%"}}
            ></input>
          </div>
          <div className="col-2">
            <label>
              <h6 style={{fontWeight: "bolder", margin: 0}}>
                <FormattedMessage id="src.components.bookingPage.StepThreeForm.ticketWindowCode" />
              </h6>
            </label>
            <input
              type="text"
              className="form-control"
              disabled={true}
              value={guichetCode}
              style={{minWidth: "50%"}}
            ></input>
          </div>
          <div className="col-2">
            <label>
              <h6 style={{fontWeight: "bolder", margin: 0}}>
                <FormattedMessage id="src.components.bookingPage.StepThreeForm.accountCode" />
              </h6>
            </label>
            <input
              type="text"
              className="form-control"
              disabled={true}
              value={numberAccount}
              style={{minWidth: "50%"}}
            ></input>
          </div>
          <div className="col-1">
            <label>
              <h6 style={{fontWeight: "bolder", margin: 0}}>
                <FormattedMessage id="src.components.bookingPage.StepThreeForm.RIBKey" />
              </h6>
            </label>
            <input
              type="text"
              className="form-control"
              disabled={true}
              value={keyAccount}
              style={{minWidth: "50%"}}
            ></input>
          </div>
          <div className="col-1">
            <label>
              <h6 style={{fontWeight: "bolder", margin: 0}}>
                <FormattedMessage id="src.components.bookingPage.StepThreeForm.devise" />
              </h6>
            </label>
            <input
              type="text"
              className="form-control"
              disabled={true}
              value={deviseAccount}
              style={{minWidth: "50%"}}
            ></input>
          </div>
        </div>
        <div className="row align-items-start mt-3">
          <div className="col-3">
            <label>
              <h6 style={{fontWeight: "bolder", margin: 0}}>
                <FormattedMessage id="src.components.bookingPage.StepThreeForm.IBAN" />
              </h6>
            </label>
            <input
              type="text"
              className="form-control"
              disabled={true}
              value={iban}
              style={{minWidth: "50%"}}
            ></input>
          </div>
          <div className="col-2">
            <label>
              <h6 style={{fontWeight: "bolder", margin: 0}}>
                <FormattedMessage id="src.components.bookingPage.StepThreeForm.BIC" />
              </h6>
            </label>
            <input
              type="text"
              className="form-control"
              disabled={true}
              value={bic}
              style={{minWidth: "50%"}}
            ></input>
          </div>
        </div>
      </div>
      {!prt && (
        <div className="row align-items-start ml-4  mt-4">
          <input
            id="payment1"
            type="checkbox"
            className="form-check-input mt-3"
            disabled={locks}
            onChange={() => {
              onHandleCbPayment("1", !cbPayment1);
            }}
            checked={cbPayment1}
            style={{
              cursor: "pointer",
            }}
          ></input>
          <label htmlFor="payment1">
            <h5
              style={{
                marginLeft: "20px",
                marginBottom: "0",
                paddingBottom: 0,
                color: cbPayment1 ? "green" : null,
                cursor: "pointer",
              }}
            >
              {formatMessage({
                id: "src.components.bookingPage.StepProgress.paymentMeansRib",
              })}
            </h5>
          </label>
        </div>
      )}
    </>
  );
}

export default Rib;
