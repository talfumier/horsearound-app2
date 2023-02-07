import {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useCookies} from "react-cookie";
import {FormattedMessage, useIntl} from "react-intl";
import {Helmet} from "react-helmet";
import _ from "lodash";
import {parseISO, isWithinInterval, eachDayOfInterval} from "date-fns";
import {getUsers} from "../../../services/httpUsers.js";
import {
  getUserBookings,
  getProBookings,
  getInvoicesByUser,
  patchBooking,
  patchAnnounceDates,
  deleteBooking,
} from "../../../services/httpBookings.js";
import {successFailure} from "./announces/form/AnnounceForm.jsx";
import {errorHandlingToast} from "../../../services/utilsFunctions.js";
import NavBar from "./NavBar.jsx";
import PageContent from "./PageContent.jsx";
import {decodeJWT} from "../../../services/httpUsers.js";
import ContainerToast from "../common/toastSwal/ContainerToast.jsx";
import {SwalOkCancel} from "../common/toastSwal/SwalOkCancel.jsx";

let originalBookings = {},
  originalInvoices = {};
function MemberPage({
  announces: allAnnounces,
  onHandleSaveDelete,
  onHandleDirty,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const {locale, formatMessage} = useIntl();
  const [tab, setTab] = useState(1);
  const [cookies, setCookie] = useCookies(["user"]);
  const currentUser = cookies.user ? decodeJWT(cookies.user) : null;
  const [announces, setAnnounces] = useState([]);
  const [flg, setFlag] = useState(false); // data loading complete indicator;
  const [proUsers, setProUsers] = useState([]);
  const [bookings, setBookings] = useState({});
  const [invoices, setInvoices] = useState({});
  const [selected, setSelected] = useState(null);
  const [dirty, setDirty] = useState(null);
  const [spin, setSpinner] = useState({bookings: false, invoices: false});
  async function loadProUsers(signal) {
    if (currentUser.role === "ADMIN") {
      const res = await getUsers("pro", cookies.user, signal);
      if (!(await errorHandlingToast(res, locale, false))) {
        setProUsers(res.data);
      }
    }
  }
  const abortController = new AbortController();
  useEffect(() => {
    setDirty(false);
    loadProUsers(abortController.signal);
    return () => {
      abortController.abort(); //clean-up code after component has unmounted
    };
  }, []);
  async function loadProBookings(usrs, signal) {
    const n = usrs.length,
      bkg = {};
    let res = null;
    usrs.map(async (usr, idx) => {
      res = await getProBookings(usr._id, cookies.user, signal);
      if (!(await errorHandlingToast(res, locale, false)))
        bkg[usr._id] = {
          data: res.data,
          nbBookings: res.data.length,
          nbSaved: res.data.filter((item) => item.steps["0"].saved !== null)
            .length,
        };
      if (idx === n - 1) {
        originalBookings = bkg;
        setBookings(bkg);
      }
    });
  }
  async function loadProInvoices(usrs, signal) {
    const n = usrs.length,
      pmt = {};
    let res = null;
    usrs.map(async (usr, idx) => {
      res = await getInvoicesByUser(usr._id, cookies.user, signal);
      if (!(await errorHandlingToast(res, locale, false)))
        pmt[usr._id] = {
          data: res.data,
          nbInvoices: res.data[0].invoice.length,
          nbPending: _.filter(res.data[0].invoice, (inv) => {
            return inv.steps["3"].paymentReceived === null;
          }).length,
        };
      if (idx === n - 1) {
        originalInvoices = pmt;
        setInvoices(pmt);
      }
    });
  }
  async function loadUserBookings(usr, signal) {
    const bkg = {},
      res = await getUserBookings(usr._id, cookies.user, signal);
    if (!(await errorHandlingToast(res, locale, false))) {
      bkg[usr._id] = {
        data: res.data,
        nbBookings: res.data.length,
        nbSaved: res.data.filter((item) => item.steps["0"].saved !== null)
          .length,
      };
      originalBookings = bkg;
      setBookings(bkg);
    }
  }
  useEffect(() => {
    if (proUsers.length === 0) return;
    const abortController = new AbortController(), //ADMIN case
      signal = abortController.signal;
    loadProBookings(proUsers, signal);
    loadProInvoices(proUsers, signal);
    return () => {
      if (flg) abortController.abort(); //clean-up code after component has unmounted
    };
  }, [proUsers]);
  useEffect(() => {
    if (currentUser === null || currentUser.role === "ADMIN") return;
    const abortController = new AbortController(),
      signal = abortController.signal;
    if (currentUser.type === "pro") {
      loadProBookings([currentUser], signal);
      loadProInvoices([currentUser], signal);
    } else loadUserBookings(currentUser, signal);
    return () => {
      abortController.abort(); //clean-up code after component has unmounted
    };
  }, []);
  useEffect(() => {
    let bl = Object.keys(bookings).length > 0;
    if (bl && (currentUser.type === "pro" || currentUser.role === "ADMIN"))
      bl = Object.keys(invoices).length > 0;
    setFlag(bl);
  }, [proUsers, bookings, invoices]);
  const queryParams = [];
  const uRLSearch = new URLSearchParams(location.search);
  for (let item of uRLSearch) {
    queryParams.push(item);
  }
  useEffect(() => {
    const sel = {};
    let cs = 0,
      cs0 = 0,
      cs1 = 0,
      cs2 = 0,
      user_id = null;
    if (queryParams && queryParams[0]) {
      switch (queryParams[0][0]) {
        case "MyAnnounces":
          cs = -1;
          queryParams.map((param, idx) => {
            if (idx > 0) {
              switch (param[0]) {
                case "filtered":
                  cs0 = -1;
                  break;
                case "archived":
                  cs1 = -1;
                  break;
                case "noPast":
                  cs2 = -1;
                  break;
                default:
                  if (idx === 1) user_id = param[0];
                  if (idx >= 2) sel[param[0]] = 1;
              }
            }
          });
      }
    }
    let anns = [];
    switch (currentUser.role) {
      case "ADMIN":
        anns =
          user_id === null
            ? allAnnounces.data
            : _.filter(allAnnounces.data, (ann) => {
                return ann.id_user._id === user_id;
              });
        setAnnounces(anns);
        break;
      default:
        if (currentUser.type === "pro") {
          anns = _.filter(allAnnounces.data, (ann) => {
            return ann.id_user._id === currentUser._id;
          });
          setAnnounces(anns);
        }
    }
    anns.map((ann) => {
      if (typeof sel[ann._id] === "undefined") sel[ann._id] = 0; //init selected items that are not already set by queryParams
    });
    setSelected({...selected, announces: sel});
    if (cs === -1) {
      setTab(2);
      setTimeout(() => {
        try {
          if (cs1 === -1)
            document.getElementById("archivedSlider").checked = true;
          if (cs0 === -1)
            document.getElementById("MyAnnouncesTabFilter").click();
          if (cs2 === -1) document.getElementById("pastSlider").click();
        } catch (error) {}
      }, 500);
      navigate("/member", {replace: true});
    }
  }, []);
  useEffect(() => {
    if (!flg) return;
    const sel = {};
    let cs = 0;
    if (queryParams && queryParams[0]) {
      switch (queryParams[0][0]) {
        case "MyBookings_ids": //booking._id
          cs = -2;
          queryParams[0][1].split(",").map((id) => {
            sel[id] = 1; //id >>> booking _id
          });
          break;
        case "MyBookings_ann_id": //announce._id
          cs = -2;
          Object.keys(bookings).map((userId) => {
            bookings[userId].data.map((bkg) => {
              if (bkg.announce._id === queryParams[0][1]) sel[bkg._id] = 1;
            });
          });
      }
    }
    Object.keys(bookings).map((userId) => {
      bookings[userId].data.map((bkg) => {
        if (typeof sel[bkg._id] === "undefined") sel[bkg._id] = 0; //init selected items that are not already set by queryParams
      });
    });
    setSelected({...selected, bookings: sel});
    if (cs === -2) setTab(3); //MyBookings tab
  }, [flg]);
  function handleBookingChange(id, etid, cs = "change") {
    const bkgs = _.cloneDeep(bookings);
    Object.keys(bookings).map((usr) => {
      bookings[usr].data.map((bkg, idx) => {
        if (bkg._id === id) {
          Object.keys(bkg.steps).map(async (key) => {
            if (bkg.steps[key].active) {
              let result = null,
                body_bkg = _.cloneDeep(bkg.steps),
                body_ann = _.cloneDeep(bkg.announce.dates),
                stepKeys = null,
                inc = 0,
                res = null,
                bl = [],
                bkg_start = null,
                bkg_end = null,
                ann_date_start = null,
                ann_date_end = null,
                bbd = null,
                i = null,
                j = null;
              switch (cs) {
                case "change":
                  switch (currentUser.type) {
                    case "particulier": //a 'particulier' can only accomplish 'particulier' steps
                      if (Object.keys(bkg.steps[key].next)[0] === "pro") return;
                      break;
                    case "pro": //a 'pro' can declare some 'particulier' steps accomplished  when he got the evidence that the money is in its hands
                      if (
                        bkg.steps[key].by === "particulier" &&
                        Object.keys(bkg.steps[key])[0] === null &&
                        ["depositSent", "balanceSent", "totalSent"].indexOf(
                          etid
                        ) === -1
                      )
                        return;
                  }
                  result = await SwalOkCancel(
                    formatMessage,
                    "src.components.memberPage.tabs.MyReservation.bookingNext"
                  );
                  if (result === "cancel") return;
                  setSpinner({bookings: true});
                  if (etid === "validate") inc = 1; //dates bookings data in announce need to be incremented
                  if (etid === "akn" && body_bkg["15"].active) inc = -1; //dates bookings data in announce need to be decremented
                  body_bkg[key].active = false;
                  stepKeys = Object.keys(
                    bkg.steps[
                      etid !== "refundRejected" ? parseInt(key) + 1 : 20
                    ]
                  );
                  body_bkg[etid !== "refundRejected" ? parseInt(key) + 1 : 20][
                    stepKeys[0]
                  ] = new Date();
                  body_bkg[
                    etid !== "refundRejected" ? parseInt(key) + 1 : 20
                  ].active = true;
                  if (inc !== 0) {
                    bkg.announce.dates.map((date, idx) => {
                      ann_date_start = parseISO(date.period.dateStart);
                      ann_date_end = parseISO(date.period.dateEnd);
                      bkg_start = parseISO(bkg.date.dateStart);
                      bkg_end = parseISO(bkg.date.dateEnd);
                      //find the corresponding date in announce.dates
                      i = -1;
                      if (
                        (bkg.announce.datesType === "Fixed_Fixed" &&
                          ann_date_start.setHours(0, 0, 0, 0) ===
                            bkg_start.setHours(0, 0, 0, 0) &&
                          ann_date_end.setHours(0, 0, 0, 0) ===
                            bkg_end.setHours(0, 0, 0, 0)) ||
                        (bkg.announce.datesType !== "Fixed_Fixed" &&
                          isWithinInterval(bkg_start.setHours(0, 0, 0, 0), {
                            start: ann_date_start.setHours(0, 0, 0, 0),
                            end: ann_date_end.setHours(0, 0, 0, 0),
                          }) &&
                          isWithinInterval(bkg_end.setHours(0, 0, 0, 0), {
                            start: ann_date_start.setHours(0, 0, 0, 0),
                            end: ann_date_end.setHours(0, 0, 0, 0),
                          }))
                      ) {
                        body_ann[idx].bookings += inc; //announce dates bookings data increment(inc=1)/decrement(inc=-1)
                        bbd = _.cloneDeep(date.bookingsByDay);
                        eachDayOfInterval({
                          start: bkg_start,
                          end: bkg_end,
                        }).map((bkg_dt) => {
                          i = -1;
                          date.bookingsByDay.map((ann_dt, jdx) => {
                            if (
                              i === -1 &&
                              parseISO(ann_dt.day).setHours(0, 0, 0, 0) ===
                                bkg_dt.setHours(0, 0, 0, 0)
                            ) {
                              i = 0;
                              bbd[jdx].bookings = {
                                0: bbd[jdx].bookings["0"] + inc * bkg.adults.nb,
                                1:
                                  bbd[jdx].bookings["1"] +
                                  inc * bkg.children.nb,
                                2:
                                  bbd[jdx].bookings["2"] +
                                  inc * bkg.companions.nb,
                              };
                            }
                          });
                          //date not found in existing announce date bookingsByDay, create one (increment case only)
                          if (inc === 1 && i === -1) {
                            i = 0;
                            bbd.push({
                              day: bkg_dt,
                              bookings: {
                                0: bkg.adults.nb,
                                1: bkg.children.nb,
                                2: bkg.companions.nb,
                              },
                            });
                          }
                        });
                        if (i === 0) body_ann[idx].bookingsByDay = bbd;
                      }
                    });
                  }
                  console.log("body booking step", body_bkg);
                  //break;
                  res = await patchBooking(
                    id,
                    {steps: body_bkg},
                    cookies.user,
                    abortController.signal
                  );
                  bl[0] = !(await errorHandlingToast(res, locale, false));
                  if (inc !== 0 && bl[0]) {
                    console.log("body announce bookingsByDay", body_ann);
                    res = await patchAnnounceDates(
                      bkg.announce._id,
                      {dates: body_ann},
                      cookies.user,
                      abortController.signal
                    );
                    bl[1] = !(await errorHandlingToast(res, locale, false));
                  }
                  if (bl.indexOf(false) === -1) {
                    originalBookings[usr].data[idx].steps = body_bkg;
                    bkgs[usr].data[idx].steps = body_bkg;
                  }
                  successFailure("PATCH", bl, formatMessage, "UpdateBooking");
                  break;
                case "cancel":
                  result = await SwalOkCancel(
                    formatMessage,
                    `src.components.memberPage.tabs.MyReservation.${
                      parseInt(key) <= 1 ? "bookingDelete" : "bookingCancel"
                    }`
                  );
                  if (result === "cancel") return;
                  setSpinner({bookings: true});
                  if (
                    parseInt(key) <= 1 &&
                    currentUser.type === "particulier"
                  ) {
                    //delete booking if it is in an early stage ('saved' or 'submitted'), at this stage announce.dates.bookings are not affected
                    res = await deleteBooking(
                      id,
                      cookies.user,
                      abortController.signal
                    );
                    bl[0] = !(await errorHandlingToast(res, locale, false));
                    if (bl[0]) {
                      originalBookings[usr].data.splice(idx, 1);
                      bkgs[usr].data.splice(idx, 1);
                      originalBookings[usr].nbBookings += -1;
                      bkgs[usr].nbBookings += -1;
                      originalBookings[usr].nbSaved += -1;
                      bkgs[usr].nbSaved += -1;
                    }
                    successFailure(
                      "DELETE",
                      bl,
                      formatMessage,
                      "UpdateBooking"
                    );
                  } else {
                    //raise a cancel request at step 15 (particulier) or cancel booking at step 25 (pro)
                    originalBookings[usr].data[idx].steps[key].active = false;
                    bkgs[usr].data[idx].steps[key].active = false;
                    j =
                      currentUser.type === "particulier"
                        ? ["15", "cancelRequest"]
                        : ["25", "cancel"];
                    originalBookings[usr].data[idx].steps[j[0]][j[1]] =
                      new Date();
                    bkgs[usr].data[idx].steps[j[0]][j[1]] = new Date();
                    originalBookings[usr].data[idx].steps[j[0]].active = true;
                    bkgs[usr].data[idx].steps[j[0]].active = true;
                  }
              }
              setSpinner({bookings: false});
              setBookings(bkgs);
            }
          });
        }
      });
    });
  }
  function handleInvoiceChange(id, etid, cs = "change") {
    console.log(id, etid);
  }
  try {
    async function handleToggle(idx, user) {
      switch (idx) {
        case 1: //dashboard
          setBookings(originalBookings);
          setInvoices(originalInvoices);
          break;
        case 2: //announces
          if (user && user.type === "pro")
            setAnnounces(
              _.filter(announces, (ann) => {
                return ann.id_user._id === user._id;
              })
            );
          else if (currentUser.role === "ADMIN")
            setAnnounces(allAnnounces.data);
          break;
        case 3: //bookings
          if (user) {
            const bkg = {};
            Object.keys(bookings).map((key) => {
              if (key === user._id)
                bkg[user._id] = _.cloneDeep(bookings[user._id]);
            });
            setBookings(bkg);
          } else setBookings(originalBookings);
          break;
        case 5: //Invoices
          if (user) {
            const pmt = {};
            Object.keys(invoices).map((key) => {
              if (key === user._id)
                pmt[user._id] = _.cloneDeep(invoices[user._id]);
            });
            setInvoices(pmt);
          } else setInvoices(originalInvoices);
      }
      setTab(idx);
    }
    return (
      flg && (
        <>
          <ContainerToast></ContainerToast>
          <div>
            <FormattedMessage id="metaData.memberSpace.title">
              {(text) => (
                <Helmet>
                  <title>{text}</title>
                </Helmet>
              )}
            </FormattedMessage>
            <FormattedMessage id="metaData.memberSpace.description">
              {(text) => (
                <Helmet>
                  <meta name="description" content={text} />
                </Helmet>
              )}
            </FormattedMessage>
            <h1 className="invisible" style={{height: "0px", margin: "0px"}}>
              MemberPage
            </h1>
            <NavBar
              type={currentUser.type}
              role={currentUser.role}
              initTab={tab}
              dirty={dirty}
              onHandleToggle={handleToggle}
              onHandleDirty={(bl) => {
                setDirty(bl);
                onHandleDirty(bl);
              }}
            />
            <PageContent
              announces={announces}
              users={proUsers.length > 0 ? proUsers : [currentUser]}
              bookings={bookings}
              invoices={invoices}
              selected={selected}
              tab={tab}
              spinner={spin}
              onHandleToggle={handleToggle}
              onHandleSaveDelete={onHandleSaveDelete}
              onHandleDirty={(bl) => {
                setDirty(bl);
                onHandleDirty(bl);
              }}
              onHandleBookingChange={handleBookingChange}
              onHandleInvoiceChange={handleInvoiceChange}
            />
          </div>
        </>
      )
    );
  } catch (error) {
    return null; //current user logged out
  }
}

export default MemberPage;
