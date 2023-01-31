import Carousel from "react-bootstrap/Carousel";
import {FormattedMessage} from "react-intl";
import {Link} from "react-router-dom";
import slider1 from "../img/slider/slider-01-bis_red.jpg";
import slider2 from "../img/slider/slider-02-bis_red.jpg";
import slider3 from "../img/slider/slider-03-bis_red.jpg";

function HomeCarousel({noData}) {
  const sliders = [
    [slider1, 1, 2],
    [slider2, 3, 4],
    [slider3, 5, 6],
  ];
  return (
    <Carousel interval={5000} nextLabel="" prevLabel="">
      {sliders.map((item, idx) => {
        return (
          <Carousel.Item
            key={idx}
            className="containerCarousel"
            style={{zIndex: noData ? -2 : 3}}
          >
            <img
              className="col p-0"
              src={item[0]}
              alt="randonnée équestre le long des plages normandes"
            />
            <Carousel.Caption>
              <div className="text col-8 m-auto">
                <h2>
                  <FormattedMessage
                    id={
                      "src.components.homePage.HomePageCarousel.title" +
                      (idx + 1)
                    }
                  />
                </h2>
                <h3>
                  <FormattedMessage
                    id={
                      "src.components.homePage.HomePageCarousel.subTitle" +
                      (idx + 1)
                    }
                  />
                </h3>
                <div
                  className="d-flex justify-content-center my-4 p-0 mx-auto"
                  style={{fontSize: "2rem"}}
                >
                  <span
                    style={{
                      textAlign: "justify",
                      lineHeight: "2.5rem",
                    }}
                  >
                    <FormattedMessage
                      id={
                        "src.components.homePage.HomePageCarousel.phrase" +
                        item[1]
                      }
                    />
                    <br />
                    <FormattedMessage
                      id={
                        "src.components.homePage.HomePageCarousel.phrase" +
                        item[2]
                      }
                    />
                  </span>
                </div>
                {noData ? null : (
                  <Link to={"/announces"} className="btn btn-success">
                    <FormattedMessage id="src.components.homePage.HomePageCarousel.link" />
                  </Link>
                )}
              </div>
            </Carousel.Caption>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
}

export default HomeCarousel;
