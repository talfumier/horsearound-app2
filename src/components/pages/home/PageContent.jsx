import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {Link} from "react-router-dom";
import {useCookies} from "react-cookie";
import Meta from "../common/Meta";
import HomeCarousel from "./pageElements/HomeCarousel";
import slider1 from "./img/slider/slider-01-bis_red.jpg";
import HomeToursPackage from "./pageElements/HomeToursPackage";
import HomeTop from "./pageElements/HomeTop";
import KeepInTouch from "./pageElements/KeepInTouch";

function PageContent({announces}) {
  const noData = announces === null ? true : false;
  const isMobile = window.innerWidth < 480;
  const lang = useIntl().locale;
  const [cookies, setCookie, removeCookie] = useCookies(["filter"]);
  const [state, setState] = useState([]);
  useEffect(() => {
    const top3 = [];
    if (announces) {
      let i = 0;
      for (const ann of announces.data) {
        if (ann.title[lang]) {
          top3.push(ann);
          if (i === 2 || i === announces.data.length - 1) break;
          i++;
        }
      }
      setState(top3);
      window.addEventListener("onload", removeCookie("filter"));
      return () => {
        window.removeEventListener("onload", removeCookie("filter"));
      };
    }
  }, [announces, lang]);
  return (
    <div>
      <h1 className="invisible">HorseAround</h1>
      <Meta id="home"></Meta>
      <div className="main-wrapper">
        {!isMobile ? (
          <div className="col-12">
            <HomeCarousel noData={noData} />
          </div>
        ) : (
          <div>
            <img
              src={slider1}
              alt="rando à cheval en bord de mer"
              style={{maxWidth: "100%", height: "auto"}}
            />
            <div
              className="text col-8 mx-auto h-50 w-100 d-flex justify-content-center"
              style={{marginTop: "-100px"}}
            >
              {noData ? null : (
                <Link to={"/announces"} className="btn btn-success ">
                  <FormattedMessage id="src.components.homePage.HomePageCarousel.linkMobile" />
                </Link>
              )}
            </div>
          </div>
        )}
        {noData ? null : (
          <>
            <br />
            <br />
            <HomeToursPackage announces={announces} />
            <HomeTop top3={state}></HomeTop>
            {/* <KeepInTouch></KeepInTouch> */}
          </>
        )}
      </div>
    </div>
  );
}

export default PageContent;
