import {useState, useEffect, useContext} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {FormattedMessage, useIntl} from "react-intl";
import {Card, Tooltip} from "@mui/material";
import _ from "lodash";
import {differenceInCalendarDays} from "date-fns";
import ProContext from "../../../../common/context/ProContext.js";
import BookingRecap from "./payment/BookingRecap.jsx";
import {SwalOkCancel} from "../../../../common/toastSwal/SwalOkCancel.jsx";
import {
  getLastBookingRef,
  postBooking,
} from "../../../../../../services/httpBookings.js";
import {errorHandlingToast} from "../../../../../../services/utilsFunctions.js";
import {successFailure} from "../../../../member/announces/form/AnnounceForm.jsx";
import {decodeJWT} from "../../../../../../services/httpUsers.js";
import {getDaysNights} from "./CountersTable.jsx";
import stepsAll from "./stepsAll.json";
import stepsShort from "./stepsShort.json";
import {RenderInWindow} from "../../../../common/RenderInWindow.jsx";
import BookingSummary from "../../../../member/bookings/dataTable/summary/BookingSummary.jsx";
import {toastInfo} from "../../../../common/toastSwal/ToastMessages.js";
import {padToNDigits} from "../../../../utils/utilityFunctions.js";

let post_ids = []; //stores newly created bookings _id
function Confirmation({
  announce,
  data,
  recap,
  tabsCheck,
  locks,
  onHandleTabsCheck,
  onHandleLocks,
}) {
  const {booking, personal, checks} = data;
  const [cookies, setCookie] = useCookies(["user"]);
  const {_id: userId, type} = decodeJWT(cookies.user);
  const location = useLocation();
  const navigate = useNavigate();
  const {locale, formatMessage} = useIntl();
  const proContext = useContext(ProContext);
  const [pro, setPro] = useState(null);
  const [allCheck, setAllCheck] = useState(null);
  const [confirmed, setConfirmed] = useState(null);
  const [saved, setSaved] = useState(null);
  const [openSummary, setOpenSummary] = useState(false);
  const abortController = new AbortController();
  useEffect(() => {
    setPro(proContext.pro[announce.id_user._id]);
    setAllCheck(false);
    setConfirmed(false);
    setSaved(false);
    return () => {
      abortController.abort();
    };
  }, []);
  useEffect(() => {
    if (locks) {
      setAllCheck(true);
      return;
    }
    const tbs = _.cloneDeep(tabsCheck);
    delete tbs["5"]; //remove confirmation step
    setAllCheck(JSON.stringify(tbs).indexOf(false) === -1);
  }, [tabsCheck]);
  function getFaultyTabs() {
    const tbs = _.cloneDeep(tabsCheck);
    delete tbs["5"]; //remove confirmation step
    const id = "src.components.bookingPage.StepProgress.";
    const tabsName = [
        "bookingStep",
        "optionStep",
        "registrationStep",
        "invoiceStep",
        "paymentStep",
      ],
      result = [];
    Object.keys(tbs).map((key, idx) => {
      if (JSON.stringify(tbs[key]).indexOf(false) !== -1)
        result.push(` ' ${formatMessage({id: `${id}${tabsName[idx]}`})} ' `);
    });
    return result;
  }
  const alert = (type = allCheck ? "ready" : "missing") => {
    return (
      <>
        <div
          className={`alert alert-${
            type === "ready" || type === "success"
              ? "success"
              : type === "reflexion"
              ? "warning"
              : "danger"
          } justify-content-center w-80 m-4 mt-0 p-2`}
          style={{fontSize: "1.3rem"}}
        >
          <div>
            <strong>
              <FormattedMessage
                id={`src.components.bookingPage.StepFour.title${type}`}
              />
            </strong>
          </div>
          <div className="mt-4 mb-4">
            {`${formatMessage({
              id: `src.components.bookingPage.StepFour.alert1${type}`,
            })}
          ${
            type === "ready" || type === "success" || type === "reflexion"
              ? _.startCase(pro.id_user.firstName)
              : getFaultyTabs()
          } ${
              type === "ready" || type === "success" || type === "reflexion"
                ? _.upperCase(pro.id_user.lastName)
                : ""
            } ${formatMessage({
              id: `src.components.bookingPage.StepFour.alert2${type}`,
            })}
          `}
          </div>
          <div className="my-4 ">
            {`${
              type === "ready"
                ? formatMessage({
                    id: `src.components.bookingPage.StepFour.alert1${type}reflexion`,
                  })
                : ""
            }`}
          </div>
        </div>
        {!confirmed ? (
          <div
            className="d-flex justify-content-center mx-auto "
            style={{width: "100%"}}
          >
            <div
              disabled={allCheck && !confirmed && !locks ? false : true}
              className="dropdown singleDrop btn btn-success mx-auto"
              onClick={handleConfirm}
            >
              {formatMessage({
                id: "src.components.bookingPage.StepFour.finalise",
              })}
            </div>
            {allCheck && (
              <Tooltip
                title={formatMessage({
                  id: "src.components.bookingPage.StepFour.printTT",
                })}
                arrow
              >
                <div
                  className="mt-2"
                  style={{
                    fontSize: 30,
                    cursor: "pointer",
                    color: "#7aa095",
                  }}
                  onClick={() => {
                    if (openSummary) {
                      toastInfo(
                        formatMessage({
                          id: "user_msg.standard.errors.windowOpen",
                        })
                      );
                      return;
                    }
                    setOpenSummary(true);
                  }}
                >
                  &#128438;
                </div>
              </Tooltip>
            )}
            <div
              disabled={allCheck && !saved && !locks ? false : true}
              className="dropdown singleDrop btn btn-success mx-auto"
              onClick={handleSave}
            >
              {formatMessage({
                id: "src.components.bookingPage.StepFour.saveSubmitLater",
              })}
            </div>
          </div>
        ) : null}
      </>
    );
  };
  function getBookingRef(proId, last_ref) {
    let ref = proId.slice(-6);
    const year = new Date().getFullYear();
    if (!last_ref || last_ref.slice(7, 11) != year) ref = `${ref}_${year}_001`;
    else {
      const n = padToNDigits(parseInt(last_ref.slice(-3)) + 1, 3);
      ref = `${ref}_${year}-${n}`;
    }
    return ref;
  }
  async function prepareBody(confmd) {
    return await getLastBookingRef(
      pro.id_user._id,
      cookies.user,
      abortController.signal
    ).then((resolve, reject) => {
      if (reject) return [];
      if (resolve) {
        const bodies = [],
          keys = Object.keys(booking.dateParticipants);
        let lastBookingRef = resolve.data.ref;
        let body = null,
          ref = null;
        (announce.datesType === "Fixed_Fixed"
          ? booking.dates
          : booking.selection
        ).map((date, idx) => {
          const cs = typeof recap[date.id].deposit !== "undefined" ? 1 : 0,
            steps = cs === 1 ? stepsAll : stepsShort;
          steps["0"].saved = new Date();
          steps["0"].active = !confmd;
          if (confmd) {
            steps["1"].submitted = new Date();
            steps["1"].active = true;
            if (cs === 1) {
              steps["4"].next.particulier.sendBalance =
                recap[date.id].balance.due;
              steps["6"].next.particulier.seeYou = date.startDate;
            } else steps["4"].next.particulier.seeYou = date.startDate;
          }
          ref = getBookingRef(pro.id_user._id, lastBookingRef);
          lastBookingRef = ref;
          body = {
            ref,
            id_user: userId,
            id_announce: announce._id,
            date: {dateStart: date.startDate, dateEnd: date.endDate},
            daysNights: getDaysNights(
              announce.nbDays,
              announce.nbNights,
              differenceInCalendarDays(date.endDate, date.startDate) + 1
            ),
            adults: {
              nb: booking.dateParticipants[keys[idx]].booking["0"],
              price: booking.cost[keys[idx]]["0"],
            },
            children: {
              nb: booking.dateParticipants[keys[idx]].booking["1"],
              price: booking.cost[keys[idx]]["1"],
            },
            companions: {
              nb: booking.dateParticipants[keys[idx]].booking["2"],
              price: booking.cost[keys[idx]]["2"],
            },
            paymentRecap: {
              total: {amount: recap[date.id].total.amount},
              options: {
                amount: recap[date.id].date.options
                  ? recap[date.id].date.options.price
                  : 0,
              },
            },
            paymentInfo: {
              billingFirstName: personal["1"].firstName,
              billingLastName: personal["1"].lastName,
              billingAddress: personal["1"].address,
              billingCity: personal["1"].city,
              billingPostCode: personal["1"].postcode,
              billingCountry: personal["1"].country,
              billingConditionsAccepted: checks.cbAccept,
              billingPaymentMeans: checks.cbPayment1
                ? "bank transfer"
                : checks.cbPayment2
                ? "check"
                : "credit card",
            },
            options: recap[date.id].date.options
              ? recap[date.id].date.options.opts
              : {},
            byPro: type === "pro",
            steps,
          };
          if (recap[date.id].deposit)
            body.paymentRecap = {
              ...body.paymentRecap,
              deposit: {amount: recap[date.id].deposit.amount},
              balance: {
                amount: recap[date.id].balance.amount,
                due: recap[date.id].balance.due,
              },
            };
          if (body.adults.nb + body.children.nb + body.companions.nb > 0)
            bodies.push(body);
        });
        console.log("body FormBooking", bodies);
        return bodies;
      }
    });
  }
  async function handlePostRequest(confmd) {
    return await prepareBody(confmd).then(async (resolve, reject) => {
      if (reject) return false;
      if (resolve) {
        const n = resolve.length,
          bl = [];
        let res = null;
        resolve.map(async (body, idx) => {
          post_ids = [];
          res = await postBooking(body, cookies.user, abortController.signal);
          bl.push(!(await errorHandlingToast(res, locale, false)));
          post_ids.push(res.data.data._id);
          if (idx === n - 1) {
            successFailure("POST", bl, formatMessage, "UpdateBooking");
          }
        });
        return bl.indexOf(false) === -1;
      }
    });
  }
  async function handleConfirm() {
    if (confirmed || locks) return;
    const result = await SwalOkCancel(
      formatMessage,
      "src.components.bookingPage.StepFour.finaliseConfirm"
    );
    if (result === "cancel") return;
    else
      handlePostRequest(true).then((resolve, reject) => {
        if (resolve) {
          setConfirmed(true);
          onHandleTabsCheck("4", true);
          onHandleLocks(true);
        }
      });
  }
  async function handleSave() {
    if (saved || locks) return;
    handlePostRequest(false).then((resolve, reject) => {
      if (resolve) {
        setSaved(true);
        onHandleLocks(true);
      }
    });
  }
  async function prepareSummaryData() {
    return await prepareBody(false).then((resolve, reject) => {
      if (reject) return [];
      if (resolve) {
        resolve.map((data) => {
          data.announce = announce;
          data.pro = {...pro.id_user};
          data.company = {
            _id: pro._id,
            corpName: pro.corpName,
            bankCode: pro.bankCode,
            guichetCode: pro.guichetCode,
            numberAccount: pro.numberAccount,
            keyAccount: pro.keyAccount,
            deviseAccount: pro.deviseAccount,
            iban: pro.iban,
            bic: pro.bic,
            checkOrder: pro.checkOrder,
            checkAdress: pro.checkAdress,
          };
        });
        return resolve;
      }
    });
  }
  return (
    pro !== null && (
      <>
        {openSummary && (
          <RenderInWindow
            comp={<BookingSummary data={prepareSummaryData()}></BookingSummary>}
            size={{width: 900, height: 500, x: 400, y: 200}}
            onClose={() => {
              setOpenSummary(false);
            }}
          ></RenderInWindow>
        )}
        <BookingRecap recap={recap} announce={announce}></BookingRecap>
        <Card
          variant="outlined"
          style={{
            marginTop: "20px",
            marginLeft: "10px",
            marginRight: "10px",
            paddingBottom: "15px",
            width: "75%",
          }}
        >
          <div className="p-4 mb-0 w-100">
            {alert(confirmed ? "success" : saved ? "reflexion" : undefined)}
            {(confirmed || saved || locks) && (
              <div
                className="d-flex justify-content-center mx-auto mt-4 dropdown singleDrop btn btn-success"
                style={{width: "50%"}}
              >
                <a
                  onClick={() => {
                    navigate(
                      `${location.pathname}${location.search}&MyBookings_ids`, //add 'MyBookings' parameter in url to be able to come back on tab3 when using browser back button
                      {
                        replace: true,
                        state: location.state,
                      }
                    );
                    navigate(`/member?MyBookings_ids=${post_ids}`); //navigate to MemberPage 'Bookings' tab instead of landing on DashBoard tab
                  }}
                >
                  <FormattedMessage id="src.components.bookingPage.StepFour.redirect" />
                </a>
              </div>
            )}
          </div>
        </Card>
      </>
    )
  );
}
export default Confirmation;
