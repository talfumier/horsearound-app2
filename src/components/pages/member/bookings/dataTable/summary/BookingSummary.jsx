import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {Row, Col} from "react-bootstrap";
import {getFormattedDate} from "../../../../utils/utilityFunctions.js";
import {Card} from "@mui/material";
import "./styles.css";
import stepsNumbering from "../../../../announce/details/priceDatesTable/booking/stepsNumbering.json";
import {getCompletedSteps} from "../DataTable.jsx";
import {getNextSteps} from "../DataTable.jsx";

function BookingSummary({data: data_arr}) {
  const {locale, formatMessage} = useIntl();
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    if (typeof data_arr.then === "function")
      data_arr.then((resolve, reject) => {
        if (resolve) setBookings(resolve);
      });
    else setBookings(data_arr);
  }, []);
  function getParticipants(data) {
    let txt = [],
      total = 0;
    ["adults", "children", "companions"].map((item, idx) => {
      if (data[item]?.nb > 0)
        txt.push(
          `${txt.length > 0 ? ", " : ""}${data[item].nb} ${formatMessage({
            id: "src.components.bookingPage.BookDetailInfo." + item,
          })}`
        );
      total += data[item].price;
    });
    return [txt, total];
  }
  function getOptions(data) {
    let txt = [];
    if (!data.options) return null;
    Object.keys(data.options).map((key) => {
      txt.push(
        <p className="summary normal my-0 py-0" key={key}>
          <span
            style={{
              textDecoration: !data.options[key] ? "line-through" : null,
            }}
          >
            {`${data.announce.options[key - 1].description[locale]}`}
          </span>
          {data.options[key] ? (
            <span style={{paddingLeft: 5}}> &#x2714;</span>
          ) : null}
        </p>
      );
    });
    return txt;
  }
  let participants = null;
  return bookings.map((data, idx) => {
    participants = getParticipants(data);
    return (
      <Card
        key={idx}
        variant="outlined"
        className="summary card"
        style={{
          marginTop: "20px",
          marginLeft: "10px",
          marginRight: "10px",
          paddingBottom: "40px",
          width: "75%",
          borderWidth: "1px",
        }}
      >
        <Row key={1} className="justify-content-md-left ">
          <Col className="d-flex justify-content-left summary title ml-4 pl-4 ">
            <span>
              <FormattedMessage id="src.components.bookingPage.BookDetailInfo.bookingRef" />
              {` ${data.ref}`}
            </span>
            <span className="summary normal ml-2">
              <FormattedMessage id="src.components.bookingPage.BookDetailInfo.bookingOwner" />
              {`${data.paymentInfo.billingFirstName} ${data.paymentInfo.billingLastName}`}
            </span>
          </Col>
        </Row>
        <Row key={2} className="justify-content-md-left ">
          <Col className="summary title ml-4 ">
            <i className="fas fa-horse-head pr-3"></i>
            <span>
              <FormattedMessage id="src.components.bookingPage.BookDetailInfo.activity" />
            </span>
            <span className="summary normal">
              {data.announce.title[locale]}
            </span>
          </Col>
        </Row>
        <Row key={3} className="justify-content-md-left ">
          <Col className="summary title ml-4">
            <i className="fas fa-house-user mr-1 pr-2" />
            <span>
              <FormattedMessage id="src.components.bookingPage.BookDetailInfo.organizer" />
            </span>
            <span className="summary normal">{data.company.corpName}</span>
            <p className="summary normal ml-4 pl-3">{`${data.pro.firstName} ${data.pro.lastName} - ${data.pro.email}`}</p>
          </Col>
        </Row>
        <Row key={4} className="justify-content-md-left ">
          <Col className="summary title ml-4">
            <i className="fa fa-calendar pr-3" />
            <span>
              <FormattedMessage id="src.components.bookingPage.BookDetailInfo.from" />
            </span>
            <span className="summary normal">
              {getFormattedDate(data.date.dateStart, "dd.MM.yyyy")}
            </span>
            <i className="fa fa-calendar pr-3" />
            <span>
              <FormattedMessage id="src.components.bookingPage.BookDetailInfo.to" />
            </span>
            <span className="summary normal">
              {getFormattedDate(data.date.dateEnd, "dd.MM.yyyy")}
            </span>
          </Col>
        </Row>
        <Row key={5} className="justify-content-md-left ">
          <Col className="summary title ml-4">
            <i className="fa fa-user pl-1 pr-3" />
            <span>
              <FormattedMessage id="src.components.bookingPage.BookDetailInfo.participants" />
            </span>
            <span className="summary normal">
              {` ${participants[1]} ${data.announce.devise}`}
            </span>
            <div
              className="d-flex summary normal ml-3 pl-4"
              style={{whiteSpace: "nowrap"}}
            >
              {participants[0]}
            </div>
          </Col>
        </Row>
        {data.paymentRecap.options && (
          <Row key={6} className="justify-content-md-left ">
            <Col className="summary title ml-4">
              <i className="fa fa-shopping-cart pl-1 pr-3" />
              <span>
                <FormattedMessage id="src.components.bookingPage.BookDetailInfo.options" />
              </span>
              <span className="summary normal">
                {` ${data.paymentRecap.options.amount} ${data.announce.devise}`}
              </span>
              <div
                className="summary normal ml-3 pl-4"
                style={{whiteSpace: "nowrap"}}
              >
                {getOptions(data)}
              </div>
            </Col>
          </Row>
        )}
        <Row key={7} className="justify-content-md-left ">
          <Col
            className="summary title ml-4"
            style={{fontSize: 20, color: "red"}}
          >
            <i className="fa fa-money pl-1 pr-2" />
            <span>
              <FormattedMessage id="src.components.bookingPage.BookDetailInfo.totalAccount" />
            </span>
            <span>{` : ${data.paymentRecap.total.amount} ${data.announce.devise}`}</span>
            {typeof data.paymentRecap.deposit === "undefined" && (
              <span
                className="text-lowercase pt-2"
                style={{fontWeight: "normal", lineHeight: "20px"}}
              >
                <FormattedMessage id="src.components.bookingPage.BookDetailInfo.whenToPay2" />
              </span>
            )}
          </Col>
        </Row>
        {typeof data.paymentRecap.deposit !== "undefined" ? (
          <>
            <Row key={8} className="justify-content-md-left ">
              <Col className="summary title ml-4" style={{color: "blue"}}>
                <span className="summary title deposit-balance">
                  <FormattedMessage id="src.components.bookingPage.BookDetailInfo.deposit" />
                </span>
                <span>{`: ${Math.round(data.paymentRecap.deposit.amount)} ${
                  data.announce.devise
                }`}</span>{" "}
                <span
                  className="text-lowercase pt-2"
                  style={{fontWeight: "normal", lineHeight: "20px"}}
                >
                  <FormattedMessage id="src.components.bookingPage.BookDetailInfo.whenToPay2" />
                </span>
              </Col>
            </Row>
            <Row key={9} className="justify-content-md-left ">
              <Col className="summary title ml-4" style={{color: "blue"}}>
                <span className="summary title deposit-balance">
                  <FormattedMessage id="src.components.bookingPage.BookDetailInfo.balance" />
                </span>
                <span>{`: ${Math.round(data.paymentRecap.balance.amount)} ${
                  data.announce.devise
                }`}</span>{" "}
                <span
                  className="text-lowercase pt-2"
                  style={{fontWeight: "normal", lineHeight: "20px"}}
                >
                  {`${formatMessage({
                    id: "src.components.bookingPage.BookDetailInfo.whenToPay1",
                  })}${getFormattedDate(
                    data.paymentRecap.balance.due,
                    "dd.MM.yyyy"
                  )})`}
                </span>
              </Col>
            </Row>
          </>
        ) : null}
        <Row key={10} className="justify-content-md-left ">
          <Col className="summary title payment-means">
            <span>
              <FormattedMessage id="src.components.bookingPage.BookDetailInfo.paymentMeans" />
            </span>
            <span className="summary normal">
              {data.paymentInfo.billingPaymentMeans}
            </span>
          </Col>
        </Row>
        {data.paymentInfo.billingPaymentMeans === "bank transfer" && (
          <>
            <Row key={"10a"} className="justify-content-md-left ">
              <Col className="summary title rib">
                <label style={{width: "7%"}}>{"RIB"}</label>
                <input
                  type="text"
                  disabled={true}
                  value={`${data.company.bankCode}  ${data.company.guichetCode}  ${data.company.numberAccount}  ${data.company.keyAccount}`}
                  className="summary normal text-center"
                  style={{width: "60%"}}
                ></input>
              </Col>
            </Row>
            <Row key={"10b"} className="justify-content-md-left ">
              <Col className="summary title rib">
                <label style={{width: "7%"}}>{"IBAN"}</label>
                <input
                  type="text"
                  disabled={true}
                  value={`${data.company.iban}`}
                  className="summary normal text-center"
                  style={{width: "60%"}}
                ></input>
                <label style={{width: "5%"}}>{"BIC"}</label>
                <input
                  type="text"
                  disabled={true}
                  value={`${data.company.bic}`}
                  className="summary normal text-center"
                  style={{width: "20%"}}
                ></input>
              </Col>
            </Row>
          </>
        )}
        {data.paymentInfo.billingPaymentMeans === "check" && (
          <Row key={"10c"} className="justify-content-md-left ">
            <Col className="summary title rib ">
              <label>
                <FormattedMessage id="src.components.bookingPage.StepThreeForm.chequeOrder" />
              </label>
              <textarea
                disabled={true}
                value={`${data.company.checkOrder}`}
                className="form-control "
                rows="5"
                cols="20"
              ></textarea>
            </Col>
            <Col className="summary title rib ">
              <label>
                <FormattedMessage id="src.components.bookingPage.StepThreeForm.dispatchAddress" />
              </label>
              <textarea
                disabled={true}
                value={`${data.company.checkAdress}`}
                className="form-control "
                rows="5"
                cols="25"
              ></textarea>
            </Col>
          </Row>
        )}
        <Row key={12} className="justify-content-md-center ">
          <Col className="summary title text-center">
            <span>
              <FormattedMessage id="src.components.bookingPage.BookDetailInfo.status" />
            </span>
            <span className="summary normal">
              {getFormattedDate(new Date())}
            </span>
            <div
              className="summary normal ml-1 mt-2 "
              style={{fontSize: "13px"}}
            >
              {Object.keys(stepsNumbering).map((txt) => {
                return getCompletedSteps(
                  data.steps,
                  txt,
                  stepsNumbering[txt],
                  formatMessage
                );
              })}
            </div>
          </Col>
          <Col className="summary title text-center">
            <span>
              <FormattedMessage id="src.components.memberPage.tabs.MyReservation.rColumnStepsToDo" />
            </span>
            <div className="d-flex flex-column justify-content-center summary normal ml-4 mt-2 ">
              {getNextSteps(data.steps, data._id, formatMessage, null)}
            </div>
          </Col>
        </Row>
      </Card>
    );
  });
}

export default BookingSummary;
