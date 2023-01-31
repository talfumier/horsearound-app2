import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {Link} from "react-router-dom";
import {parseISO, getMonth} from "date-fns";
import img from "../home/img/deal/deal-01.jpg";
import TextTruncate from "react-text-truncate";
import {testGuaranteedDeparture, testPromo} from "../utils/utilityFunctions";
import RatingTable from "./RatingTable";
import {getMainImage} from "../utils/utilityFunctions";

function SmallAnnounce({announce, images}) {
  const intl = useIntl();
  const lang = intl.locale;
  const [state, setState] = useState({
    months: null,
  });
  useEffect(() => {
    let months = [];
    announce.dates.forEach((date) => {
      let monthStart = getMonth(parseISO(date.period.dateStart.$date));
      const monthEnd = getMonth(parseISO(date.period.dateEnd.$date));
      if (monthStart > monthEnd) {
        for (let i = monthStart; i <= 11; i++) months.push(i + 1);
        monthStart = 0;
      }
      for (let i = monthStart; i <= monthEnd; i++)
        if (!months.includes(i + 1)) months.push(i + 1);
    });
    setState({months});
  }, []);
  const monthLetters = {
    1: ["J-", "january"],
    2: ["F-", "february"],
    3: ["M-", "march"],
    4: ["A-", "april"],
    5: ["M-", "may"],
    6: ["J-", "june"],
    7: ["J-", "july"],
    8: ["A-", "august"],
    9: ["S-", "september"],
    10: ["O-", "october"],
    11: ["N-", "november"],
    12: ["D", "december"],
  };
  const root = "src.components.annoncesPage.annonces.smallAnnounces.";
  function getGoIn() {
    for (let m = 1; m < 13; m++) {
      if (state.months.includes(m) && m > getMonth(new Date()))
        return (
          <p style={{color: "white", fontSize: 12}}>
            <FormattedMessage id={`${root}go`} />
            <FormattedMessage id={`${root}${monthLetters[m][1]}`} />
          </p>
        );
    }
    return null;
  }
  function getGuaranteedDeparture() {
    try {
      const result = testGuaranteedDeparture(
        announce.dates,
        announce.participantMin,
        announce.participantMax
      );
      if (result.includes("non")) return null;
      return (
        <div className="discountInfo">
          <div className="discountOffer">
            <h4
              style={{
                fontSize: lang === "fr" ? "14px" : "10px",
              }}
            >
              <FormattedMessage id={result}></FormattedMessage>
            </h4>
          </div>
        </div>
      );
    } catch (error) {
      return null;
    }
  }
  function getDatesTypeLabel() {
    let x = "",
      y = "";
    if (
      announce.datesType === "Fixed_Fixed" ||
      announce.datesType === "Flex_Fixed"
    ) {
      x =
        announce.nbDays > 0
          ? `${announce.nbDays}${intl.formatMessage({
              id: "src.components.annoncesPage.annonces.smallAnnounces.days",
            })}`
          : "";
      if (announce.nbDays === 1) x = x.slice(0, -1);
      y =
        announce.nbNights > 0
          ? `${announce.nbDays > 0 ? " | " : ""}${
              announce.nbNights
            }${intl.formatMessage({
              id: "src.components.annoncesPage.annonces.smallAnnounces.nights",
            })}`
          : "";
      if (announce.nbNights === 1) y = y.slice(0, -1);
      return (
        <>
          {x}
          {y}
          {announce.datesType === "Flex_Fixed" &&
            `
              ${x.length > 0 || y.length > 0 ? " - " : ""}${intl.formatMessage({
              id: "src.components.annoncesPage.annonces.smallAnnounces.flex_fixed",
            })}`}
        </>
      );
    } else
      return (
        <FormattedMessage id="src.components.annoncesPage.annonces.smallAnnounces.flex_flex" />
      );
  }
  return (
    state.months !== null && (
      <div
        className="media packagesList col-xl-12 row mx-0"
        //onMouseEnter={() => onHover(announce)}
        //onMouseLeave={() => onUnHover()}
      >
        <Link
          className="media-left fancybox-pop py-5 my-auto col-xl-5 row"
          to={`/announce/details?id=${announce._id}`}
          state={{
            images: images && images.length > 0 ? images : [],
          }}
        >
          <div className="thumbnail deals w-100 m-4">
            <img
              className="media-object"
              src={
                images && images.length > 0 ? getMainImage(images).data : img
              }
              alt="img"
            />
            {getGuaranteedDeparture()}
            {testPromo(announce.dates) === "Promo" ? (
              <div className="discountInfo d-flex justify-content-end align-items-start">
                <div className="discountOffer mr-4">
                  <h4
                    style={{
                      fontSize: "16px",
                    }}
                  >
                    <FormattedMessage id="src.components.annoncesPage.annonces.smallAnnounces.promo" />
                  </h4>
                </div>
              </div>
            ) : null}
          </div>
        </Link>
        <div className="media-body col-xl-8 row mx-4">
          <div className="bodyLeft my-auto">
            <h4 className="media-heading" style={{fontWeight: "bold"}}>
              <Link
                to={`/announce/details?id=${announce._id}`}
                state={{
                  images: images && images.length > 0 ? images : [],
                }}
              >
                {announce.title[lang]}
              </Link>
            </h4>
            <RatingTable announce={announce} />
            <TextTruncate
              line={5}
              element="span"
              truncateText=" …"
              text={announce.description && announce.description[lang]}
            ></TextTruncate>
            <div className="col px-0">
              <div className="row mx-auto">
                <p
                  style={{
                    marginTop: 10,
                    borderStyle: "solid",
                    borderRadius: 3,
                    borderWidth: 1,
                    paddingRight: 10,
                  }}
                >
                  <i
                    className="fa fa-clock-o"
                    aria-hidden="true"
                    style={{marginLeft: 10, marginRight: 10}}
                  />
                  {announce.dates.length > 0 && getDatesTypeLabel()}
                </p>
              </div>
              <div className="row mx-6">
                <ul className="month">
                  {Object.keys(monthLetters).map((key) => {
                    return (
                      <li key={key}>
                        {!state.months.includes(parseInt(key)) ? (
                          monthLetters[key][0]
                        ) : (
                          <b style={{color: "#7AA095"}}>
                            {monthLetters[key][0]}
                          </b>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="bodyRight">
            <div
              className="bookingDetails"
              style={{height: 350, paddingTop: 30, paddingBottom: 30}}
            >
              <br />
              <br />
              <br />
              <span style={{color: "#fff", fontSize: 20}}>
                {(
                  <FormattedMessage
                    id={`src.components.allPages.Menu.navbar.destinations.continents.${announce.destination[0]}.countries.${announce.destination[1]}`}
                  />
                ) || (
                  <FormattedMessage id="src.components.announcePage.booking.noDestination" />
                )}
              </span>
              <br />
              <br />
              <p style={{color: "white", fontSize: 16}}>
                <FormattedMessage id="src.components.annoncesPage.annonces.smallAnnounces.from" />
                {announce.priceChild
                  ? announce.priceAdulte > announce.priceChild
                    ? announce.priceChild
                    : announce.priceAdulte
                  : announce.priceAdulte}
                €
                {announce.dates.length > 0 &&
                  announce.dates[0].bookingsByDay && (
                    <FormattedMessage id="src.components.homePage.ActivityBox.day" />
                  )}
              </p>
              <ul style={{marginTop: 30}}>
                <li>
                  <Link
                    to={`/announce/details?id=${announce._id}`}
                    state={{
                      images: images && images.length > 0 ? images : [],
                    }}
                    className="btn btn-success announce-btn"
                  >
                    <FormattedMessage id="src.components.annoncesPage.annonces.smallAnnounces.details" />
                  </Link>
                </li>
              </ul>
              {getGoIn()}
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default SmallAnnounce;
