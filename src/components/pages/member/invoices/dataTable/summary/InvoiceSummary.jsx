import {useIntl} from "react-intl";
import {getFormattedDate} from "../../../../utils/utilityFunctions.js";
import "../../../bookings/dataTable/summary/styles.css";
import stepsNumbering from "../../../../announce/details/priceDatesTable/booking/stepsNumbering.json";
import {
  getCompletedSteps,
  getNextSteps,
} from "../../../bookings/dataTable/DataTable.jsx";
import "./styles.css";
import logo from "../../../../../../images/logo-icon.png";

function InvoiceSummary({data: dta}) {
  const {locale, formatMessage} = useIntl();
  const {invoice, data} = dta;
  function prepareDetails() {
    const inv = {
      _id: invoice._id,
      anns: data.announce,
      booking_ids: invoice.id_booking,
      bookings: data.booking,
    };
    const details = [];
    let obj = {},
      n = 0,
      part = null,
      keys = [],
      keys_part = [],
      price = 0,
      total = 0;
    inv.anns.map((ann) => {
      n = 0;
      inv.bookings.map((bkg) => {
        if (
          bkg.id_announce === ann._id &&
          inv.booking_ids.indexOf(bkg._id) !== -1
        ) {
          part = {};
          n += 1;
          ["adults", "children", "companions"].map((item) => {
            if (bkg[item].nb !== 0) part[item] = bkg[item];
          });
          obj[bkg.ref] = {
            date: bkg.date,
            participants: part,
          };
        }
      });
      details.push({
        title: ann.title,
        devise: ann.devise,
        rate: data.tarif,
        penalty: data.penalty,
        bookings: obj,
        nbRows: n,
      });
    });
    n = details.length;
    let i = 0,
      j = 0,
      td = [];
    const tr = [];
    for (i = 0; i < n; i++) {
      if (i === 0)
        td.push(
          <td
            className="invoice"
            key={`title_${locale}${i}`}
            rowSpan={details[i].nbRows}
          >
            {details[i].title[locale]}
          </td>
        );
      for (j = 0; j < details[i].nbRows; j++) {
        keys = Object.keys(details[i].bookings); //Booking ref
        part = details[i].bookings[keys[j]].participants;
        keys_part = Object.keys(part);
        price = 0;
        td.push(
          <>
            <td className="invoice" key={`ref${i}${j}`}>
              {keys[j]}
            </td>
            <td className="invoice" key={`date${i}${j}`}>
              {`${getFormattedDate(
                details[i].bookings[keys[j]].date.dateStart,
                "dd.MM.yyyy"
              )}`}
              <br></br>
              {`${getFormattedDate(
                details[i].bookings[keys[j]].date.dateEnd,
                "dd.MM.yyyy"
              )}`}
            </td>
            <td className="invoice" key={`price${i}${j}`}>
              {keys_part.map((key, idx) => {
                price += details[i].bookings[keys[j]].participants[key].price;
                return (
                  <div>{`${formatMessage({
                    id: `src.components.announcePage.booking.${key}`,
                  })}: ${details[i].bookings[keys[j]].participants[key].nb} - ${
                    details[i].bookings[keys[j]].participants[key].price
                  } ${details[i].devise}`}</div>
                );
              })}
            </td>
            <td
              className="invoice"
              key={`rate${i}${j}`}
            >{`${details[i].rate} %`}</td>
            {details[i].penalty !== 0 && (
              <td
                className="invoice"
                key={`penalty${i}${j}`}
              >{`${details[i].penalty} %`}</td>
            )}
            <td className="invoice" key={`totalrow${i}${j}`}>{`${
              ((details[i].rate + details[i].penalty) * price) / 100
            } ${details[i].devise}`}</td>
          </>
        );
        total += price;
        tr.push(<tr key={`row${i}${j}`}>{td}</tr>);
        td = [];
      }
    }
    return {tr, total};
  }
  const details = prepareDetails();
  return (
    <div className="mx-4 my-3">
      <header className="invoice">
        <h1 className="invoice">
          {`${formatMessage({
            id: "src.components.memberPage.tabs.price.MyPrice.invoice",
          })} # ${invoice.ref}`}
        </h1>
      </header>
      <div className="mx-4">
        <address className="invoice pl-3">
          <p className="invoice">
            <span style={{fontWeight: "bold"}}>
              Horse-around.com
              <img
                src={logo}
                style={{
                  width: "2.5%",
                  position: "absolute",
                  top: 87,
                  left: 190,
                }}
              ></img>
            </span>
            <br></br>
            62, rue de Guinot
            <br></br>31130 MERVILLE - FRANCE
            <br></br>
            <i className="mr-2 fa fa-phone" aria-hidden="true" />
            {"+33 6 03 96 71 58"}
            <br></br>
            <i className="mr-2 fa fa-envelope-o" aria-hidden="true" />
            {formatMessage({id: "global.email"})}
          </p>
        </address>
        <table className="invoice">
          <thead>
            <tr>
              <th className="invoice" style={{border: 0}}></th>
              <th className="invoice">{`${formatMessage({
                id: "src.components.memberPage.tabs.price.MyPrice.invoice",
              })} #`}</th>
              <th className="invoice">{`${formatMessage({
                id: "src.components.memberPage.tabs.price.MyPrice.created",
              })}`}</th>
              <th className="invoice">{`${formatMessage({
                id: "src.components.memberPage.tabs.price.MyPrice.period",
              })}`}</th>
              <th className="invoice">{`${formatMessage({
                id: "src.components.memberPage.tabs.price.MyPrice.amountDue",
              })}`}</th>
              <th className="invoice">{`${formatMessage({
                id: "src.components.memberPage.tabs.price.MyPrice.dueDate",
              })}`}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="invoice">
                <address className="invoice px-2" style={{textAlign: "left"}}>
                  <p className="invoice">
                    <span style={{fontWeight: "bold"}}> {data.corpName}</span>
                    <br></br>
                    {data.address.address}
                    <br></br>
                    {`${data.address.postcode} ${data.address.city} - ${data.address.country}`}
                    <br></br>
                  </p>
                </address>
              </td>
              <td className="invoice">{invoice.ref}</td>
              <td className="invoice">
                {getFormattedDate(invoice.steps["1"].submitted, "dd.MM.yyyy")}
              </td>
              <td className="invoice">
                {`${getFormattedDate(invoice.period.dateStart, "dd.MM.yyyy")}`}
                <br />
                ---
                <br />
                {`${getFormattedDate(invoice.period.dateEnd, "dd.MM.yyyy")}`}
              </td>
              <td
                className="invoice"
                style={{color: "red"}}
              >{`${invoice.amount} ${data.announce[0].devise}`}</td>
              <td
                className="invoice"
                style={{color: "red"}}
              >{`${getFormattedDate(
                invoice.steps["1"].next.pro.payInvoice,
                "dd.MM.yyyy"
              )}`}</td>
            </tr>
          </tbody>
        </table>
        <br />
        <br />
        <table className="invoice">
          <thead>
            <tr>
              <th className="invoice" colSpan={"8"}>{`${formatMessage({
                id: "src.components.memberPage.tabs.price.MyPrice.details",
              })}`}</th>
            </tr>
            <tr>
              <th className="invoice">{`${formatMessage({
                id: "src.components.memberPage.tabs.price.MyPrice.announce",
              })}`}</th>
              <th className="invoice">{`${formatMessage({
                id: "src.components.memberPage.tabs.price.MyPrice.bookings",
              })}`}</th>
              <th className="invoice">{`${formatMessage({
                id: "src.components.memberPage.tabs.price.MyPrice.dates",
              })}`}</th>
              <th className="invoice">{`${formatMessage({
                id: "src.components.memberPage.tabs.price.MyPrice.participants",
              })}`}</th>
              <th className="invoice">{`${formatMessage({
                id: "src.components.memberPage.tabs.price.MyPrice.rate",
              })}`}</th>
              {data.penalty !== 0 && (
                <th className="invoice">{`${formatMessage({
                  id: "src.components.memberPage.tabs.price.MyPrice.penalty",
                })}`}</th>
              )}
              <th className="invoice">{`${formatMessage({
                id: "src.components.memberPage.tabs.price.MyPrice.total",
              })}`}</th>
            </tr>
          </thead>
          <tbody>
            {details.tr.map((row, idx) => {
              return row;
            })}
          </tbody>
        </table>
        {/* <div
          className="mr-4 pr-4"
          style={{float: "right", color: "red", fontWeight: "bolder"}}
        >
          {(details.total * (data.tarif + data.penalty)) / 100}
        </div> */}
      </div>
    </div>
  );
}

export default InvoiceSummary;
