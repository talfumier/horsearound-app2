import {useState, useEffect, useContext} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import ReactModal from "react-modal-resizable-draggable";
import {useCookies} from "react-cookie";
import Banner from "../common/Banner";
import AnnounceCarousel from "./AnnounceCarousel";
import intlData from "../../intl/translations.json";
import Meta from "../common/Meta";
import AnnouncesMap from "../announces/AnnouncesMap";
import AnnounceDetails from "./details/AnnounceDetails";
import FormBooking from "./details/priceDatesTable/booking/FormBooking";
import {decodeJWT} from "../../../services/httpUsers.js";
import {errorHandlingToast} from "../../../services/utilsFunctions.js";
import {getCompany} from "../../../services/httpUsers.js";
import {getAnnounceBookings} from "../../../services/httpBookings.js";
import ProContext from "../common/context/ProContext.js";

let subToType = {};
function PageContent({announce, images, comments}) {
  const proContext = useContext(ProContext);
  const lang = useIntl().locale;
  const types =
    intlData["en-EN"].src.components.allPages.Menu.navbar.activities.types;
  Object.keys(types).map((type) => {
    Object.keys(types[type].subactivities).map((sub) => {
      subToType[sub] = type;
    });
  });
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const currentUser = cookies.user ? decodeJWT(cookies.user) : null;
  const [pro, setPro] = useState(null);
  const [bookings, setBookings] = useState(null);
  useEffect(() => {
    async function loadData(signal) {
      //if (cookies.user) {
      let res = null;
      if (
        Object.keys(proContext).length > 0 &&
        typeof proContext.pro[announce.id_user._id] !== "undefined" //pro data available in ProContext
      ) {
        setPro(proContext.pro[announce.id_user._id]);
      } else {
        res = await getCompany(announce.id_user._id, signal);
        if (!(await errorHandlingToast(res, lang, false))) {
          setPro(res.data);
          proContext.onHandlePro(announce.id_user._id, res.data);
        }
      }
      res = await getAnnounceBookings(announce._id, signal);
      if (await errorHandlingToast(res, lang, false)) {
        setBookings([]);
        return;
      } else setBookings(res.data);
      /*  } else {
        setBookings([]);
      } */
    }
    const abortController = new AbortController();
    loadData(abortController.signal);
    return () => {
      abortController.abort(); //clean-up code after component has unmounted
    };
  }, []);
  const [modal, setOpenModal] = useState({open: false, dates: []});
  function handleFormModal(open, dates) {
    if (open) window.scrollTo(window.innerWidth / 2, window.innerHeight / 2);
    setOpenModal({open, dates});
  }
  function handleCloseModal(cs = null) {
    if (cs === "clickAway") return;
    setOpenModal({open: false, dates: []});
  }
  return (
    pro !== null &&
    bookings !== null && (
      <div>
        <Meta
          id={`activities.${announce.category}`}
          title1={`${announce.title[lang]} - `}
          desc2={announce.title[lang]}
        ></Meta>
        <Banner title={announce.title[lang]} />
        <section className="main-wrapper overflow-hidden">
          <br />
          <br />
          <ReactModal
            animation={false}
            top={0.3 * window.innerHeight}
            initWidth={0.64 * window.innerWidth}
            initHeight={0.52 * window.innerHeight}
            //className="my-modal-custom-class"
            onRequestClose={() => {
              return; //cancel modal window closing wneh clicking outside modal >>> force closing by cancel button
            }}
            isOpen={modal.open}
            style={{zIndex: "100"}}
            disableKeystroke
          >
            <FormBooking
              announce={announce}
              data={modal.dates}
              onClose={handleCloseModal}
            ></FormBooking>
          </ReactModal>
          <div className="d-flex flex-row justify-content-between m-3 mt-0 pt-0 mr-4">
            <div className="col-4" style={{zIndex: -1}}>
              <AnnounceCarousel
                images={
                  images && images.length > 0
                    ? images
                    : ["/img/home/deal/deal-01.jpg"]
                }
              />
            </div>
            <div className="col-4 h-50 m-auto">
              <h3 className="m-auto p-4 text-center" style={{color: "#7AA095"}}>
                <b>{announce.title[lang]}</b>
              </h3>
              <p
                style={{whiteSpace: "pre-line", fontSize: "20px"}}
                className="text-center "
              >
                <b style={{whiteSpace: "pre-line"}}>
                  {
                    <FormattedMessage
                      id={`src.components.allPages.Menu.navbar.activities.types.${
                        subToType[announce.category]
                      }.subactivities.${announce.category}`}
                    ></FormattedMessage>
                  }
                </b>
              </p>
              <br />
              <p style={{whiteSpace: "pre-line"}} className="text-justify">
                {" "}
                {announce.description && announce.description[lang]}
              </p>
              {announce.highlights.length !== 0 && (
                <div>
                  <br />
                  <br />
                  <div className="card">
                    <div
                      className="card-header"
                      style={{
                        backgroundColor: " #7AA095",
                        color: "white",
                      }}
                    >
                      <FormattedMessage id="src.components.announcePage.youWillLike" />
                    </div>
                    <div className="card-body">
                      {announce.highlights.map((highlight) => {
                        return (
                          <b>
                            <p
                              style={{
                                whiteSpace: "pre-line",
                              }}
                            >
                              <i
                                className="fa fa-circle-o"
                                aria-hidden="true"
                              />{" "}
                              {highlight[lang]}
                            </p>
                          </b>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="col-4 m-auto pt-5">
              <div className="bookingAside h-100">
                <AnnouncesMap announces={[announce]} />
              </div>
            </div>
          </div>
          <div className="col-8 m-auto" style={{maxWidth: "80%"}}>
            <AnnounceDetails
              announce={announce}
              proId={pro.id_user._id}
              bookings={bookings}
              comments={comments}
              onHandleFormModal={handleFormModal}
            />
          </div>
        </section>
      </div>
    )
  );
}

export default PageContent;
