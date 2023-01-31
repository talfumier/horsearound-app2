import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {FormattedMessage} from "react-intl";

function ActivityBox({img, title, link, announce}) {
  const [state, setState] = useState({
    announce: null,
    price: null,
    date: null,
  });
  useEffect(() => {
    setState({
      announce: announce ? announce : null,
      price: announce
        ? announce.priceChild < announce.priceAdulte
          ? announce.priceChild
          : announce.priceAdulte
        : null,
      date: announce
        ? typeof announce.dates[0].bookings === "number"
          ? new Date(announce.dates[0].period.dateStart).toLocaleDateString()
          : new Date(
              announce.dates[0].bookingsByDay[0].day
            ).toLocaleDateString()
        : null,
    });
  }, [announce]);
  return (
    <div className="col-sm-4 isotopeSelector america africa">
      <article className="">
        <figure>
          <img src={img} alt="" />
          <h4 className="home_activ">{title}</h4>
          <div className="overlay-background">
            <div className="inner" />
          </div>
          <div className="overlay">
            <Link className="fancybox-pop" to={link}>
              <div className="overlayInfo">
                {state.price ? (
                  <h5>
                    <FormattedMessage id="src.components.homePage.ActivityBox.from" />{" "}
                    <span>
                      {state.price}€xxxxx
                      {typeof state.announce.dates[0].bookings === "number" ? (
                        <FormattedMessage id="src.components.homePage.ActivityBox.day" />
                      ) : null}
                    </span>
                  </h5>
                ) : null}
                {state.date ? (
                  <p>
                    <i className="fa fa-calendar" aria-hidden="true" />
                    {state.date}
                  </p>
                ) : null}
              </div>
            </Link>
          </div>
        </figure>
      </article>
    </div>
  );
}

export default ActivityBox;
