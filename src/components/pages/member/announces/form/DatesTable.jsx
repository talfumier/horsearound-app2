import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ThemeProvider,
} from "@mui/material";
import _ from "lodash";
import Counter from "./Counter.jsx";
import {getMuiThemes} from "../../../common/mui/MuiThemes.js";
import {getFormattedDate} from "../../../utils/utilityFunctions.js";
import Exclusion from "./Exclusion.jsx";
import {toastWarning} from "../../../common/toastSwal/ToastMessages.js";

let dates_id = 0,
  original = [];
function DatesTable({type, data, onHandleDelete, onHandleGlobals}) {
  const {locale, formatMessage} = useIntl();
  const theme = getMuiThemes("DatesTable", locale);
  const [dates, setDates] = useState([]);
  useEffect(() => {
    original = initData();
    setDates(original);
  }, [data]);
  function initData() {
    const dts = [];
    data.map((date, idx) => {
      dts.push({
        id: (dates_id += 1),
        bookings: date.bookings,
        startDate: date.period.dateStart,
        endDate: date.period.dateEnd,
        duration: {
          nbDays: date.duration.nbDays,
          nbNights: date.duration.nbNights,
        },
        promotion: date.promotion ? date.promotion : 0,
        bookingsByDay: date.bookingsByDay,
        rangeColor: date.color,
      });
    });
    return dts;
  }
  function formatDates(data) {
    const dts = [];
    data.map((date) => {
      dts.push({
        ...date,
        period: {dateStart: date.startDate, dateEnd: date.endDate},
      });
    });
    return dts;
  }
  function handlePromoIncrements(id, inc) {
    const dts = [...dates];
    dts.map((dt) => {
      if (dt.id === id) dt.promotion += inc;
    });
    setDates(dts);
    onHandleGlobals("valid", ["dates", dts.length > 0 ? true : false]);
    onHandleGlobals("value", ["dates", formatDates(dts)]);
  }
  function handlePast(checked) {
    if (checked)
      setDates(
        _.filter(dates, (date) => {
          return (
            date.endDate.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)
          );
        })
      );
    else setDates(original);
  }
  return (
    <TableContainer component={Paper} sx={{maxHeight: 345}}>
      <Table size="small" stickyHeader aria-label="sticky table">
        <ThemeProvider theme={theme.header}>
          <TableHead>
            <TableRow>
              <TableCell>
                <div className="d-flex mt-3 ml-5">
                  <p style={{color: "white"}}>
                    <FormattedMessage id="src.components.memberPage.tabs.annonces.MyAnnonces.slider2" />
                  </p>
                  <label className="switch ml-2">
                    <input
                      id="pastSlider1"
                      type="checkbox"
                      onChange={() => {
                        handlePast(
                          document.getElementById("pastSlider1").checked
                        );
                      }}
                    />
                    <span className="slider slider1 round "></span>
                  </label>
                </div>
              </TableCell>
              <TableCell></TableCell>
              {!type.Fixed_Fixed && (
                <TableCell>
                  <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.exclude" />
                </TableCell>
              )}
              <TableCell>
                {`${_.startCase(
                  formatMessage({id: "global.days"})
                )}/${_.startCase(formatMessage({id: "global.nights"}))}`}
              </TableCell>
              <TableCell>
                <FormattedMessage id="src.components.announcePage.announceDetailTab.moreInfoTable.promo" />
              </TableCell>
            </TableRow>
          </TableHead>
        </ThemeProvider>
        <ThemeProvider theme={theme.body}>
          {dates.length > 0 && (
            <TableBody>
              {_.orderBy(dates, ["startDate"], ["asc"]).map((date, index) => {
                return (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: `${date.rangeColor}8f`,
                    }}
                  >
                    <TableCell>
                      <h5>{`${getFormattedDate(
                        date.startDate,
                        "dd.MM.yyyy"
                      )} - ${getFormattedDate(
                        date.endDate,
                        "dd.MM.yyyy"
                      )}`}</h5>
                    </TableCell>
                    <TableCell>
                      <button
                        className="fa fa-trash fa-2x p-0 m-0"
                        style={{
                          backgroundColor: "transparent",
                          border: "0",
                        }}
                        onClick={() => {
                          if (
                            date.bookingsByDay &&
                            date.bookingsByDay.length > 0
                          )
                            toastWarning(
                              <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.warning2" />
                            );
                          else onHandleDelete(date);
                        }}
                      ></button>
                    </TableCell>
                    {!type.Fixed_Fixed && (
                      <TableCell>{/* <Exclusion></Exclusion> */}</TableCell>
                    )}
                    <TableCell>
                      <h5>
                        {`${date.duration.nbDays} / ${date.duration.nbNights}`}
                      </h5>
                    </TableCell>
                    <TableCell>
                      <Counter
                        id={date.id}
                        promotion={date.promotion}
                        onHandleIncrements={handlePromoIncrements}
                      ></Counter>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </ThemeProvider>
      </Table>
    </TableContainer>
  );
}

export default DatesTable;
