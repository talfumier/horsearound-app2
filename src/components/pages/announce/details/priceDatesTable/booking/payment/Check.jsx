import {FormattedMessage, useIntl} from "react-intl";

function Check({
  data,
  locks,
  cbPayment2,
  prt = false,
  onHandleOpen,
  onHandleCbPayment,
}) {
  const {checkOrder, checkAdress} = data;
  const {formatMessage} = useIntl();
  return (
    <>
      {!prt && (
        <div className="d-flex justify-content-between">
          <FormattedMessage id="src.components.bookingPage.StepThreeForm.tab2Msg" />
          <i
            className="fa fa-print fa-lg mt-2 mr-3 "
            style={{
              color: "#7AA095",
              border: "0",
              cursor: "pointer",
            }}
            onClick={() => {
              onHandleOpen("check");
            }}
          ></i>
        </div>
      )}
      <div className="row align-items-start mt-3">
        <div className="col-6">
          <label>
            <h6 style={{fontWeight: "bolder", margin: 0}}>
              <FormattedMessage id="src.components.bookingPage.StepThreeForm.chequeOrder" />
            </h6>
          </label>
          <textarea
            type="text"
            className="form-control"
            disabled={true}
            value={checkOrder}
            style={{minWidth: "50%"}}
          ></textarea>
        </div>
        <div className="col ml-4 pl-4">
          <label>
            <h6 style={{fontWeight: "bolder", margin: 0}}>
              <FormattedMessage id="src.components.bookingPage.StepThreeForm.dispatchAddress" />
            </h6>
          </label>
          <textarea
            type="text"
            className="form-control"
            disabled={true}
            value={checkAdress}
            rows="3"
            style={{minWidth: "50%"}}
          ></textarea>
        </div>
      </div>
      {!prt && (
        <div className="row align-items-start ml-2  mt-4">
          <input
            id="payment2"
            type="checkbox"
            className="form-check-input mt-3"
            disabled={locks}
            onChange={() => {
              onHandleCbPayment("2", !cbPayment2);
            }}
            checked={cbPayment2}
          ></input>
          <label htmlFor="payment1">
            <h5
              style={{
                marginLeft: "20px",
                marginBottom: "0",
                paddingBottom: 0,
                color: cbPayment2 ? "green" : null,
              }}
            >
              {formatMessage({
                id: "src.components.bookingPage.StepProgress.paymentMeansCheck",
              })}
            </h5>
          </label>
        </div>
      )}
    </>
  );
}

export default Check;
