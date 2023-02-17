import {useState, useEffect, useContext, useRef} from "react";
import SwipeableViews from "react-swipeable-views";
import {Typography, ClickAwayListener} from "@mui/material";
import {FormattedMessage, useIntl} from "react-intl";
import {useCookies} from "react-cookie";
import _ from "lodash";
import {addDays, differenceInCalendarDays} from "date-fns";
import {
  CalendarRangeFixed2,
  CalendarRangeFlexFixed_Flex2,
} from "../../../../common/datepicker/CalendarRange";
import CountersTable from "./CountersTable";
import {
  getFormattedDate,
  sumOfPropsValues,
} from "../../../../utils/utilityFunctions.js";
import {getNRandomColors} from "../../../../utils/utilityFunctions";
import TabsBar from "./TabsBar";
import Options from "../option/Options.jsx";
import PersonalInfo from "./PersonalInfo";
import InvoiceInfo from "./payment/InvoiceInfo";
import PaymentTabs from "./payment/PaymentTabs";
import Confirmation from "./Confirmation.jsx";
import UserContext from "../../../../common/context/UserContext.js";
import {loadUserdata} from "../../../../logIn&Out/FormLogin.jsx";
import jwtDecode from "jwt-decode";
import {getDaysNights} from "./CountersTable";

let date_id = null;
function FormBooking({announce, data, onClose}) {
  const {locale} = useIntl();
  const [cookies, setCookie] = useCookies(["user"]);
  const {_id} = jwtDecode(cookies.user);
  const userContext = useContext(UserContext);
  let user = null;
  let rangeColors = data.length === 1 ? ["#3d91ff"] : ["#3d91ff", "#3ecf8e"];
  if (data.length > 2)
    rangeColors = rangeColors.concat(getNRandomColors(data.length - 2));
  const [dates, setDates] = useState([]);
  const [dateParticipants, setDateParticipants] = useState({});
  const [dateOptions, setDateOptions] = useState({});
  const [cost, setCost] = useState({});
  const [recap, setRecap] = useState({});
  const [tabsCheck, setTabsCheck] = useState({});
  const [locks, setLocks] = useState(false);
  useEffect(() => {
    let dates = [];
    if (announce.datesType === "Fixed_Fixed") {
      _.orderBy(_.cloneDeep(data), ["departure"], ["asc"]).map((date, idx) => {
        delete Object.assign(date, {startDate: date.departure})["departure"];
        delete Object.assign(date, {endDate: date.return})["return"];
        dates.push({...date, rangeColor: rangeColors[idx]});
      });
      setDateParticipants(getInitialParticipants(dates, null));
      setCost(getInitialCost(dates));
    } else dates = _.cloneDeep(data);
    dates = _.uniqWith(_.orderBy(dates, ["startDate"], ["asc"]), _.isEqual);
    setDates(dates);
    setTabsCheck({
      0: false,
      1: true,
      2: false,
      3: {green: false, cbAccept: false}, //InvoiceInfo component
      4: false,
      5: false,
    });
  }, []);
  const [state, setState] = useState(0);
  const [selection, setSelection] = useState([]);
  const [del, setDelete] = useState(null);
  function handleChange(value) {
    setState(value);
  }
  function handleClose() {
    handleChange(0);
    onClose();
  }
  const personalDataKeys = [
    "firstName",
    "lastName",
    "address",
    "city",
    "postcode",
    "country",
    "birthdate",
    "birthplace",
    "email",
    "telephone",
  ];
  function initPersonalData() {
    const data = {0: {}, 1: {}};
    [0, 1].map((item) => {
      personalDataKeys.map((key, idx) => {
        switch (key) {
          case "address":
            data[item][key] =
              typeof user.address !== "undefined" ? user.address.address : "";
            break;
          case "city":
          case "postcode":
          case "country":
            data[item][key] =
              typeof user.address !== "undefined" ? user.address[key] : "";
            break;
          case "telephone":
            if (item === 1) break;
            data[item][key] =
              typeof user.phone !== "undefined" ? user.phone : "";
            break;
          case "birthdate":
            if (item === 1) break;
            data[item][key] =
              typeof user[key] !== "undefined"
                ? getFormattedDate(user[key])
                : "";
            break;
          case "birthplace":
            if (item === 1) break;
            data[item][key] = typeof user[key] !== "undefined" ? user[key] : "";
            break;
          case "email":
            if (item === 1) break;
          default:
            data[item][key] = typeof user[key] !== "undefined" ? user[key] : "";
        }
      });
    });
    return data;
  }
  const [checks, setChecks] = useState({});
  const [personalData, setPersonalData] = useState({});
  useEffect(() => {
    async function loadData() {
      user = userContext.user;
      if (Object.keys(user).length === 0)
        user = await loadUserdata(userContext, _id, cookies.user, locale); //reload required in case of page refresh (context data flushed)
      setPersonalData(initPersonalData());
      setChecks({
        cbSame: true,
        cbAccept: false,
        cbPayment1: false,
        cbPayment2: false,
      });
    }
    loadData();
  }, []);
  function handleDataOut(type, id, value) {
    const data = _.cloneDeep(personalData);
    data[type][id] = value;
    if (
      type === 0 &&
      checks.cbSame &&
      ["birthdate", "birthplace", "email", "telephone"].indexOf(id) === -1
    )
      data[1][id] = value;
    setPersonalData(data);
  }
  function handleChecksChange(id, value) {
    if (id === "cbSame") {
      if (value) {
        const data = _.cloneDeep(personalData);
        data[1] = {...data[0]};
        let i = -1;
        data[1] = _.pickBy(data[0], () => {
          i += 1;
          return i < 6;
        });
        setPersonalData(data);
      }
    }
    const cks = {...checks},
      cs = id.slice(-1);
    cks[id] = value;
    if ((cs === "1" || cs === "2") && value)
      cks[cs === "1" ? "cbPayment2" : "cbPayment1"] = false;
    setChecks(cks);
    if (id === "cbAccept" || cs === "1" || cs === "2") {
      const tbs = _.cloneDeep(tabsCheck);
      if (id === "cbAccept") tbs["3"].cbAccept = value;
      else tbs["4"] = cks["cbPayment1"] || cks["cbPayment2"] ? true : false;
      setTabsCheck(tbs);
    }
  }
  function getInvoiceData() {
    //get invoice view data when cbSame ticked
    if (checks.cbSame)
      return _.pickBy(personalData[0], (id) => {
        return personalDataKeys.indexOf(id) <= 6 ? true : false;
      });
    else return personalData[1];
  }
  function getInitialParticipants(dates, master_dates) {
    const obj = {};
    dates.map((date) => {
      obj[date.id] = getDateInitialParticipant(date, master_dates);
    });
    return obj;
  }
  function getDateInitialParticipant(date, master_dates) {
    let registered = 0;
    switch (announce.datesType) {
      case "Fixed_Fixed": //all dates are master dates
        registered = sumOfPropsValues(date.bookingsByDay[0].bookings); //participants already confirmed, bookings for each day of the period is the same
        break;
      case "Flex_Fixed": //only master dates have bookingsByDay prop
      case "Flex_Flex":
        let result = _.filter(
          master_dates[date.master_id].bookingsByDay,
          (ob) => {
            return (
              ob.day.setHours(0, 0, 0, 0) >=
                date.startDate.setHours(0, 0, 0, 0) && //sets hour,mn,sec and return time in ms
              ob.day.setHours(0, 0, 0, 0) <= date.endDate.setHours(0, 0, 0, 0)
            );
          }
        );
        result = _.maxBy(result, (ob) => {
          return sumOfPropsValues(ob.bookings);
        });
        registered = sumOfPropsValues(result.bookings); //participants already confirmed
    }
    return {
      booking: {0: 0, 1: 0, 2: 0},
      registered,
    };
  }
  function getInitialCost(dates) {
    const obj = {};
    dates.map((date) => {
      obj[date.id] = {0: 0, 1: 0, 2: 0};
    });
    return obj;
  }
  function getTotalDateParticipants(dateId) {
    return (
      sumOfPropsValues(dateParticipants[dateId].booking) +
      dateParticipants[dateId].registered
    );
  }
  function handleSelection(cs, sel) {
    const participants = _.cloneDeep(dateParticipants),
      cst = _.cloneDeep(cost);
    switch (cs) {
      case "new": //Flex_Fixed only
        participants[sel.id] = getDateInitialParticipant(sel, dates); //dates are master_dates in Flex_Fixed
        setSelection([...selection, sel]); //add range in CountersTable component
        cst[sel.id] = {0: 0, 1: 0, 2: 0};
        break;
      case "del":
        setDelete(sel); //delete range in CalendarRange component
        const dts = //delete range in CountersTable component
          announce.datesType === "Fixed_Fixed"
            ? _.cloneDeep(dates)
            : _.cloneDeep(selection);
        _.remove(dts, (dt) => {
          return (
            dt.startDate.setHours(0, 0, 0, 0) ===
              sel.startDate.setHours(0, 0, 0, 0) &&
            dt.endDate.setHours(0, 0, 0, 0) === sel.endDate.setHours(0, 0, 0, 0)
          );
        });
        announce.datesType === "Fixed_Fixed"
          ? setDates(dts)
          : setSelection(dts);
        delete participants[sel.id];
        delete cst[sel.id];
    }
    setDateParticipants(participants);
    setCost(cst);
  }
  function handleParticipants(id, idx, inc, costInc) {
    //id=date.id, idx=0(adult),1(children),2(companion)
    date_id = id;
    const participants = {...dateParticipants};
    if (inc > 0 && getTotalDateParticipants(id) >= announce.participantMax)
      return;
    participants[id].booking[idx] += inc;
    setDateParticipants(participants);
    const cst = {...cost};
    let n = 1;
    if (announce.datesType === "Flex_Flex") {
      const sel = _.filter(selection, {id})[0];
      n = differenceInCalendarDays(sel.endDate, sel.startDate) + 1; //cost increment is per day in Flex_Flex
    }
    cst[id][idx] += n * costInc;
    setCost(cst);
    const keys = Object.keys(cst);
    n = keys.length;
    let cs = -1;
    for (let i = 0; i < n; i++) {
      if (sumOfPropsValues(cst[keys[i]]) > 0) {
        cs += 1;
        break;
      }
    }
    setTabsCheck({...tabsCheck, [0]: cs === -1 ? false : true});
  }
  useEffect(() => {
    if (date_id === null || dates.length === 0) return;
    //update recap each time there are changes in participants or options selection for a given date
    const rec = _.cloneDeep(recap);
    const date = _.filter(dates, (date) => {
      return date.id === date_id;
    })[0];
    const lastDate = addDays(date.startDate, -40),
      totalOptions = getDateOptionsCost(
        date,
        dateParticipants[date_id],
        dateOptions[date_id]
      ),
      total = sumOfPropsValues(cost[date_id]) + totalOptions;
    if (total > 0) {
      rec[date_id] = {
        date: {
          startDate: date.startDate,
          endDate: date.endDate,
          participants: {
            adults: {
              nb: dateParticipants[date_id].booking[0],
              price: cost[date_id][0],
            },
            children: {
              nb: dateParticipants[date_id].booking[1],
              price: cost[date_id][1],
            },
            companions: {
              nb: dateParticipants[date_id].booking[2],
              price: cost[date_id][2],
            },
          },
          options: {
            opts: dateOptions[date_id] ? dateOptions[date_id] : {},
            price: totalOptions,
          },
        },
      };
      if (new Date().setHours(0, 0, 0, 0) < lastDate.setHours(0, 0, 0, 0)) {
        rec[date_id].deposit = {
          amount: 0.3 * total,
        };
        rec[date_id].balance = {
          amount: 0.7 * total,
          due: lastDate,
        };
      }
      rec[date_id].total = {
        amount: total,
      };
    } else delete rec[date_id];
    setRecap(rec);
    date_id = null;
  }, [cost, dateOptions]);
  function getDateOptionsCost(date, datePartcpts, dateOpts) {
    const dn = getDaysNights(
      announce.nbDays,
      announce.nbNights,
      date.duration
    ).split("/");
    const totalDatePartcpts =
      datePartcpts.booking[0] +
      datePartcpts.booking[1] +
      datePartcpts.booking[2];
    let optionsCost = 0;
    if (dateOpts) {
      Object.keys(dateOpts).map((optId) => {
        if (dateOpts[optId]) {
          switch (announce.options[optId - 1].type) {
            case "All":
              optionsCost += announce.options[optId - 1].price;
              break;
            case "Day": //i.e per day per person
              optionsCost +=
                announce.options[optId - 1].price * dn[0] * totalDatePartcpts;
              break;
            case "Night": //i.e per night per person
              optionsCost +=
                announce.options[optId - 1].price * dn[1] * totalDatePartcpts;
            case "Person":
              return announce.options[optId - 1].price * totalDatePartcpts;
          }
        }
      });
    }
    return ((100 - date.promotion) * optionsCost) / 100;
  }
  function handleOptions(dateId, opts) {
    date_id = dateId;
    setDateOptions({...dateOptions, [dateId]: opts});
  }
  function handleTabsCheck(idx, val) {
    if (locks) return;
    const tbs = _.cloneDeep(tabsCheck);
    if (idx === 3) tbs[idx].green = val;
    else tbs[idx] = val;
    setTabsCheck(tbs);
  }
  function handleLocks(val) {
    setLocks(true);
  }
  return (
    Object.keys(personalData).length > 0 &&
    Object.keys(announce).length > 0 && (
      <ClickAwayListener
        onClickAway={() => {
          onClose("clickAway");
        }}
      >
        <div className="w-100">
          <TabsBar
            tab={state}
            tabsCheck={tabsCheck}
            onHandleChange={handleChange}
          ></TabsBar>
          <SwipeableViews index={state}>
            <Typography className="p-0 m-4" component="div">
              <div className="d-flex">
                {announce.datesType === "Fixed_Fixed" && (
                  <CalendarRangeFixed2
                    dates={dates}
                    del={del}
                    rangeColors={rangeColors}
                  ></CalendarRangeFixed2>
                )}
                {(announce.datesType === "Flex_Fixed" ||
                  announce.datesType === "Flex_Flex") && (
                  <CalendarRangeFlexFixed_Flex2
                    type={announce.datesType}
                    dates={dates}
                    del={del}
                    rangeColors={rangeColors}
                    disabled={locks}
                    onHandleNewSelection={(sel) => {
                      handleSelection("new", sel);
                    }}
                  ></CalendarRangeFlexFixed_Flex2>
                )}
                <CountersTable
                  announce={announce}
                  data={
                    announce.datesType === "Fixed_Fixed"
                      ? {dates, dateParticipants, cost}
                      : {dates, selection, dateParticipants, cost}
                  }
                  locks={locks}
                  onHandleParticipants={handleParticipants}
                  onHandleDelete={(sel) => {
                    handleSelection("del", sel);
                  }}
                ></CountersTable>
              </div>
            </Typography>
            <Typography component="div">
              <div className="d-flex justify-content-center">
                {state === 1 && ( //lazy loading
                  <Options
                    dataIn={{announce, dates, dateParticipants}}
                    recap={recap}
                    locks={locks}
                    onHandleOptions={handleOptions}
                  ></Options>
                )}
              </div>
            </Typography>
            <Typography component="div">
              <div className="d-flex justify-content-center">
                {state === 2 && ( //lazy loading
                  <PersonalInfo
                    type={0}
                    onHandleDataOut={handleDataOut}
                    dataIn={personalData[0]}
                    locks={locks}
                    onHandleTabsCheck={handleTabsCheck}
                  ></PersonalInfo>
                )}
              </div>
            </Typography>
            <Typography component="div">
              <div className="d-flex justify-content-center">
                {state === 3 && ( //lazy loading
                  <InvoiceInfo
                    announce={announce}
                    data={
                      announce.datesType === "Fixed_Fixed"
                        ? {
                            dates,
                            dateParticipants,
                            cost,
                          }
                        : {
                            dates,
                            selection,
                            dateParticipants,
                            cost,
                          }
                    }
                    recap={recap}
                    personalData={getInvoiceData()}
                    locks={locks}
                    cbSame={checks.cbSame}
                    onHandleCbSame={(value) => {
                      handleChecksChange("cbSame", value);
                    }}
                    cbAccept={checks.cbAccept}
                    onHandleCbAccept={(value) => {
                      handleChecksChange("cbAccept", value);
                    }}
                    onHandleDataOut={handleDataOut}
                    onHandleTabsCheck={handleTabsCheck}
                  ></InvoiceInfo>
                )}
              </div>
            </Typography>
            <div className="d-flex justify-content-center ">
              {state === 4 && ( //lazy loading
                <PaymentTabs
                  announce={announce}
                  recap={recap}
                  cbPayment1={checks.cbPayment1}
                  cbPayment2={checks.cbPayment2}
                  locks={locks}
                  onHandleCbPayment={(cs, value) => {
                    handleChecksChange("cbPayment" + cs, value);
                  }}
                ></PaymentTabs>
              )}
            </div>
            <div className="d-flex justify-content-center ">
              <Confirmation
                announce={announce}
                data={{
                  booking:
                    announce.datesType === "Fixed_Fixed"
                      ? {
                          dates,
                          dateParticipants,
                          cost,
                        }
                      : {
                          dates,
                          selection,
                          dateParticipants,
                          cost,
                        },
                  personal: personalData,
                  checks,
                }}
                recap={recap}
                tabsCheck={tabsCheck}
                locks={locks}
                onHandleTabsCheck={handleTabsCheck}
                onHandleLocks={handleLocks}
              ></Confirmation>
            </div>
          </SwipeableViews>
          <div className="d-flex flex-row-reverse justify-content-between ">
            <div>
              <button
                id="formBookingCloseButton"
                className="btn btn-success m-0 mt-2 ml-3 "
                onClick={handleClose}
              >
                <FormattedMessage id="global.close"></FormattedMessage>
              </button>
              <button
                className="btn btn-success m-0 mt-2 ml-3"
                onClick={() => {
                  handleChange(state > 0 ? state - 1 : 0);
                }}
              >
                <FormattedMessage id="global.previous"></FormattedMessage>
                <i className="fa fa-angle-left ml-1 mr-0 pl-2 pr-0"></i>
              </button>
              <button
                className="btn btn-success m-0 mt-2 mr-3"
                onClick={() => {
                  handleChange(state < 5 ? state + 1 : state);
                }}
              >
                <FormattedMessage id="global.next"></FormattedMessage>
                <i className="fa fa-angle-right ml-1 mr-0 pl-2 pr-0"></i>
              </button>
            </div>
          </div>
        </div>
      </ClickAwayListener>
    )
  );
}

export default FormBooking;
