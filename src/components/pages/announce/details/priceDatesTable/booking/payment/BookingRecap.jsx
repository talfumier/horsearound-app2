import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {getFormattedDate} from "../../../../../utils/utilityFunctions";

function BookingRecap({recap: data, announce}) {
  const {locale, formatMessage} = useIntl();
  const [recap, setRecap] = useState({});
  useEffect(() => {
    setRecap(data);
  }, [data]);
  function getParticipants(part) {
    //id=date.id
    let txt = [];
    ["adults", "children", "companions"].map((item, idx) => {
      if (part[item].nb > 0)
        txt.push(
          `${txt.length > 0 ? ", " : ""}${part[item].nb} ${formatMessage({
            id: "src.components.bookingPage.BookDetailInfo." + item,
          })}`
        );
    });
    return txt;
  }
  return (
    Object.keys(recap).length > 0 && (
      <>
        <div className="infoArea pl-1 pr-0 " style={{width: "300px"}}>
          <div className="d-flex justify-content-center">
            <h3 style={{textAlign: "center"}}>
              {announce.title ? announce.title[locale] : ""}
            </h3>
          </div>
          {Object.keys(recap).map((key, id) => {
            return (
              <ul key={id} className="list-unstyled mb-2">
                <li style={{margin: "0", paddingBottom: "5px"}}>
                  <i className="fa fa-calendar pl-3" aria-hidden="true" />
                  <FormattedMessage id="src.components.bookingPage.BookDetailInfo.from" />
                  <span>
                    {getFormattedDate(recap[key].date.startDate, "dd.MM.yyyy")}
                  </span>
                  <i className="fa fa-calendar ml-3" aria-hidden="true" />
                  <FormattedMessage id="src.components.bookingPage.BookDetailInfo.to" />
                  <span>
                    {getFormattedDate(recap[key].date.endDate, "dd.MM.yyyy")}
                  </span>
                </li>
                <li style={{margin: "0", paddingBottom: "5px"}}>
                  <i className="fa fa-user pl-3" aria-hidden="true" />
                  <FormattedMessage id="src.components.bookingPage.BookDetailInfo.participants" />
                  <div className="d-flex pl-3">
                    {getParticipants(recap[key].date.participants).map(
                      (item, i) => {
                        return (
                          <span key={i} style={{whiteSpace: "nowrap"}}>
                            {item}
                          </span>
                        );
                      }
                    )}
                  </div>
                </li>
                {recap[key].date.options &&
                  recap[key].date.options.price > 0 && (
                    <li style={{margin: "0", paddingBottom: "5px"}}>
                      <i
                        className="fa fa-shopping-cart pl-3"
                        aria-hidden="true"
                      />
                      <FormattedMessage id="src.components.bookingPage.BookDetailInfo.options" />
                      <span>{` ${recap[key].date.options.price} ${announce.devise}`}</span>
                    </li>
                  )}
                <div className="priceTotal m-1 ml-4">
                  {typeof recap[key].deposit !== "undefined" ? (
                    <>
                      <h3 className="mt-3 mb-1" style={{fontWeight: "bolder"}}>
                        <FormattedMessage id="src.components.bookingPage.BookDetailInfo.totalAccount" />
                        <span style={{fontSize: "16px"}}>
                          {" "}
                          : {`${recap[key].total.amount} ${announce.devise}`}
                        </span>
                      </h3>
                      <h5 className="ml-2" style={{fontWeight: "bold"}}>
                        {" "}
                        <FormattedMessage id="src.components.bookingPage.BookDetailInfo.deposit" />
                        <span>
                          {" "}
                          :{" "}
                          {`${Math.round(recap[key].deposit.amount)} ${
                            announce.devise
                          }`}
                        </span>
                        <br />
                      </h5>
                      <h5 className="ml-2" style={{fontWeight: "bold"}}>
                        <FormattedMessage id="src.components.bookingPage.BookDetailInfo.balance" />
                        <span>
                          {" "}
                          :{" "}
                          {`${Math.round(recap[key].balance.amount)} ${
                            announce.devise
                          }`}
                        </span>
                        <span
                          className="text-lowercase pt-2"
                          style={{fontWeight: "normal", lineHeight: "20px"}}
                        >
                          {`${formatMessage({
                            id: "src.components.bookingPage.BookDetailInfo.whenToPay1",
                          })}${getFormattedDate(
                            recap[key].balance.due,
                            "dd.MM.yyyy"
                          )}`}
                          )
                        </span>
                        <br />
                      </h5>
                    </>
                  ) : (
                    <div>
                      <h3 className="mt-3 mb-1" style={{fontWeight: "bolder"}}>
                        <FormattedMessage id="src.components.bookingPage.BookDetailInfo.totalAccount" />
                        <span>{` : ${recap[key].total.amount} ${announce.devise}`}</span>
                      </h3>
                    </div>
                  )}
                </div>
              </ul>
            );
          })}
        </div>
      </>
    )
  );
}

export default BookingRecap;
