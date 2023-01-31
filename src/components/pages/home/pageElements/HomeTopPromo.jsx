import {Link} from "react-router-dom";
import {FormattedMessage, useIntl} from "react-intl";
import {StarRating} from "../../utils/Ratings";

function HomeTopPromo({topDeal, images}) {
  const lang = useIntl().locale;
  return (
    <section className="promotionWrapper">
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="promotionTable">
              <div className="promotionTableInner">
                <div className="promotionInfo">
                  <span>
                    <FormattedMessage id="src.components.homePage.parallax.discover" />
                  </span>
                  {topDeal ? (
                    <div className="col ">
                      <div>
                        <h2>{topDeal.title[lang]}</h2>
                        <h3 style={{color: "white"}}>
                          {" "}
                          {topDeal.destination[lang]}{" "}
                        </h3>
                      </div>
                      <StarRating announce={topDeal} />
                      <p>
                        {topDeal.priceChild
                          ? topDeal.priceAdulte <= topDeal.priceChild &&
                            topDeal.priceAccompagnateur
                            ? topDeal.priceAdulte
                            : topDeal.priceChild <= topDeal.priceAdulte &&
                              topDeal.priceAccompagnateur
                            ? topDeal.priceChild
                            : topDeal.priceAdulte <= topDeal.priceChild
                            ? topDeal.priceAdulte
                            : topDeal.priceChild <= topDeal.priceAdulte
                            ? topDeal.priceChild
                            : null
                          : topDeal.priceAdulte}{" "}
                        €{" "}
                        <FormattedMessage id="src.components.homePage.parallax.perPerson" />{" "}
                        - {topDeal.nbDays}{" "}
                        <FormattedMessage id="src.components.homePage.parallax.days" />
                      </p>
                      <div className="btnArea">
                        <Link
                          to={`/announce/details?id=${topDeal._id}`}
                          state={{
                            images:
                              images && images[topDeal._id]
                                ? images[topDeal._id]
                                : [],
                          }}
                          className="btn btn-success "
                          style={{
                            height: "50px",
                            padding: "1.3rem",
                            width: "200px",
                          }}
                        >
                          <FormattedMessage id="src.components.homePage.HomePageCarousel.link" />
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeTopPromo;
