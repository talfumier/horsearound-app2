import {FormattedMessage, useIntl} from "react-intl";
import {Link} from "react-router-dom";
import TextTruncate from "react-text-truncate";
import {getAnnounceRating, getStars} from "../../utils/Ratings";
import img from "../../utils/img/grading/star.png";
import imgGrey from "../../utils/img/grading/greystar.png";
import {getMainImage} from "../../utils/utilityFunctions.js";

function HomeTopDeals({top3, images}) {
  const lang = useIntl().locale;
  return (
    <section className="mainContentSection packagesSection">
      <div className="container">
        <div className="row ">
          <div className="col " style={{padding: 0, height: "80px"}}>
            <div className="sectionTitle" style={{marginTop: "40px"}}>
              <h2 style={{margin: 0}}>
                <span className="lightBg">
                  <FormattedMessage id="src.components.homePage.bestOffers.title" />
                </span>
              </h2>
            </div>
          </div>
        </div>
        <div className="row d-flex justify-content-center">
          {top3.map((announce, index) => {
            return (
              <div
                key={index}
                className="col-xl-4 col-lg-6 col-sm-9 col-xs-12 "
              >
                <div className="thumbnail deals w-100">
                  <img
                    className="media-object"
                    src={getMainImage(images[announce._id])}
                    alt=""
                    style={{height: "240px"}}
                  />
                  <Link
                    to={`/announce/details?id=${announce._id}`}
                    state={{
                      images:
                        images &&
                        images[announce._id] &&
                        images[announce._id].length > 0
                          ? images[announce._id]
                          : [],
                    }}
                    className="pageLink"
                  />
                  <div className="discountInfo">
                    <ul className="list-inline rating homePage">
                      {getStars(
                        getAnnounceRating(announce),
                        "li",
                        img,
                        imgGrey
                      )}
                    </ul>
                    <div>
                      <ul className="list-inline duration">
                        <li>
                          {announce.dates[0].bookingsByDay === null ? (
                            <>
                              {announce.nbDays}{" "}
                              <FormattedMessage id="src.components.homePage.bestOffers.days" />
                            </>
                          ) : (
                            <FormattedMessage id="src.components.homePage.bestOffers.freeDuration" />
                          )}
                        </li>
                        <li>
                          {announce.priceChild
                            ? announce.priceAdulte <= announce.priceChild &&
                              announce.priceAccompagnateur
                              ? announce.priceAdulte
                              : announce.priceChild <= announce.priceAdulte &&
                                announce.priceAccompagnateur
                              ? announce.priceChild
                              : announce.priceAdulte <= announce.priceChild
                              ? announce.priceAdulte
                              : announce.priceChild <= announce.priceAdulte
                              ? announce.priceChild
                              : null
                            : announce.priceAdulte}{" "}
                          {announce.devise}
                          {announce.dates[0].bookingsByDay === null ? null : (
                            <FormattedMessage id="src.components.homePage.bestOffers.d" />
                          )}
                        </li>
                        <li>
                          {announce.participantMax}{" "}
                          <FormattedMessage id="src.components.homePage.bestOffers.people" />
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="caption">
                    <h4>
                      <a
                        href={`/announce/details?id=${announce._id}`}
                        className="captionTitle"
                      >
                        <TextTruncate
                          line={1}
                          element="span"
                          truncateText=" …"
                          text={announce.title && `${announce.title[lang]}`}
                        ></TextTruncate>
                      </a>
                    </h4>
                    <div className="h-50">
                      <TextTruncate
                        line={6}
                        element="span"
                        truncateText=" …"
                        text={
                          announce.description &&
                          `${announce.description[lang]}`
                        }
                      ></TextTruncate>
                    </div>
                    <br />
                    <div className="detailsInfo">
                      <h5>
                        <span>
                          <FormattedMessage id="src.components.homePage.bestOffers.from" />{" "}
                        </span>
                        {announce.priceChild
                          ? announce.priceAdulte <= announce.priceChild &&
                            announce.priceAccompagnateur
                            ? announce.priceAdulte
                            : announce.priceChild <= announce.priceAdulte &&
                              announce.priceAccompagnateur
                            ? announce.priceChild
                            : announce.priceAdulte <= announce.priceChild
                            ? announce.priceAdulte
                            : announce.priceChild <= announce.priceAdulte
                            ? announce.priceChild
                            : null
                          : announce.priceAdulte}
                        €
                      </h5>
                      <ul className="list-inline detailsBtn">
                        <li>
                          <Link
                            to={`/announce/details?id=${announce._id}`}
                            className="btn btn-success"
                          >
                            <FormattedMessage id="src.components.homePage.bestOffers.book" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="row">
          <div className="col-xs-12">
            <div className="btnArea">
              <Link to={"/announces"} className="btn btn-success ">
                <FormattedMessage id="src.components.homePage.bestOffers.seeAll" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeTopDeals;
