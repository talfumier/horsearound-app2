import {useState, useEffect} from "react";
import {useIntl} from "react-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  Checkbox,
  ThemeProvider,
} from "@mui/material";
import _ from "lodash";
import {parseISO} from "date-fns";
import TableToolbar from "./TableToolbar.jsx";
import Tablehead from "./Tablehead.jsx";
import {
  getFormattedDate,
  sumOfPropsValues,
} from "../../../utils/utilityFunctions.js";
import stepsNumbering from "../../../announce/details/priceDatesTable/booking/stepsNumbering.json";
import {RenderInWindow} from "../../../common/RenderInWindow.jsx";
import BookingSummary from "./summary/BookingSummary.jsx";
import {toastInfo} from "../../../common/toastSwal/ToastMessages.js";

export function getNextSteps(steps, id, formatMessage, onHandleBookingChange) {
  function getButton(step, by, txt, idx, id) {
    const key = Object.keys(step)[0];
    return (
      <ul key={idx}>
        <button
          id={txt}
          className="btn btn-warning my-2 px-2 py-1"
          style={{
            fontSize: "1.2rem",
            fontWeight: "500",
            paddingRight: "5px",
            color: by === "pro" ? "#305496" : "#ffffff",
            backgroundColor:
              by === "pro" ? "yellow" : by === "admin" ? "#7aa095" : "#4472C4",
          }}
          onClick={(e) => {
            if (
              [
                "waitRefundDecision",
                "seeYou",
                "seeYouSoon",
                "informRejected",
                "completed",
              ].indexOf(e.target.id) !== -1
            )
              return;
            if (onHandleBookingChange) onHandleBookingChange(id, e.target.id);
          }}
        >
          {stepsNumbering[txt] !== undefined &&
            ` ${
              txt === "akn" ? stepsNumbering["akn"][key] : stepsNumbering[txt]
            } - `}
          {`${formatMessage({
            id: `src.components.memberPage.tabs.MyReservation.${txt}`,
          })}`}
          {txt === "completed" && <span className="ml-2">&#x2714;</span>}
          {`${
            txt === "seeYou"
              ? getFormattedDate(step.next[by][txt], "dd.MM.yyyy")
              : ""
          }`}
        </button>
      </ul>
    );
  }
  let step = null,
    txt = null;
  return Object.keys(steps).map((key) => {
    step = steps[key];
    if (step && step.active) {
      if (step.next)
        return (
          <div
            className="mx-1 px-1"
            key={key}
            style={{color: "red", fontWeight: "bolder"}}
          >
            {Object.keys(step.next).map((by, idx) => {
              txt = Object.keys(step.next[by])[0];
              if (txt !== "multiple") return getButton(step, by, txt, idx, id);
              else {
                return (
                  <div className="my-0 py-0" key={idx}>
                    {Object.keys(step.next[by].multiple).map((tx, i) => {
                      return getButton(step, by, tx, i + 10, id);
                    })}
                  </div>
                );
              }
            })}
          </div>
        );
      else return getButton(step, "admin", "completed", 22, id); //'completed', next=undefined
    }
  });
}
export function getCompletedSteps(steps, txt, taskNbr, formatMessage) {
  let step = null;
  return Object.keys(steps).map((key) => {
    step = steps[key];
    if (step && step[txt])
      return (
        <div
          className="d-flex justify-content-left ml-1 py-1"
          key={key}
          style={{
            color: "dark green",
            fontWeight: "600",
          }}
        >
          <div
            className="badge badge-light mr-2"
            style={{
              backgroundColor: step.by === "pro" ? "yellow" : "#4472C4",
              color: step.by === "pro" ? "#305496" : "white",
              fontWeight: "normal",
              width: "30px",
              height: "20px",
              border: "solid 1px",
              paddingLeft: 0,
              paddingRight: 0,
            }}
          >
            {taskNbr}
          </div>
          <div>
            {`${formatMessage({
              id: `src.components.memberPage.tabs.MyReservation.${txt}`,
            })} ${getFormattedDate(step[txt], "dd.MM.yyyy")} `}
            &#x2714;
          </div>
        </div>
      );
  });
}

let original = [],
  firstSel = null;
function DataTable({
  headCells,
  bookings,
  selected: sel,
  themes,
  spinner,
  onHandleBookingChange,
}) {
  const {locale, formatMessage} = useIntl();
  const [rows, setRows] = useState([]);
  useEffect(() => {
    original = prepareData(headCells, bookings); //default past parameter=true (i.e. includes dates in the past)
    setRows(original);
  }, [bookings]);
  const [selected, setSelected] = useState(sel);
  const [numFiltered, setNumFiltered] = useState(0);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  function scrollToBottom(id) {
    const elemt = document.getElementById(id);
    if (!elemt) return;
    elemt.scrollTop = elemt.scrollHeight;
  }
  function prepareData(headCells, bkgs, past = true) {
    let data = [];
    Object.keys(bkgs).map((key) => {
      if (bkgs[key].nbBookings > 0) data = data.concat(bkgs[key].data);
    });
    const rows = [],
      n = headCells.length,
      now = new Date().setHours(0, 0, 0, 0);
    let obj = {};
    data.map((rec) => {
      if (
        past ||
        (!past &&
          ((parseISO(rec.date.dateStart).setHours(0, 0, 0, 0) < now &&
            parseISO(rec.date.dateEnd).setHours(0, 0, 0, 0) >= now) ||
            parseISO(rec.date.dateStart).setHours(0, 0, 0, 0) >= now))
      ) {
        obj = {};
        for (let i = 0; i < n; i++) {
          {
            switch (i) {
              case 0: //reference-booked by
                obj[headCells[i].name] = (
                  <>
                    {`${rec.ref}`}
                    <br />
                    {`${rec.user.email}`}
                  </>
                );
                break;
              case 1: //activity - organizer
                obj[headCells[i].name] = (
                  <>
                    {`${rec.announce.title[locale]}`}
                    <br />
                    {`${rec.company.corpName}`}
                  </>
                );
                break;
              case 2: //date
                obj[headCells[i].name] = (
                  <>
                    {`${getFormattedDate(rec.date.dateStart, "dd.MM.yyyy")}`}
                    <br />
                    {`${getFormattedDate(rec.date.dateEnd, "dd.MM.yyyy")}`}
                  </>
                );
                break;
              case 3: //days/nights
                obj[headCells[i].name] = rec.daysNights;
                break;
              case 4: //participants
                obj[headCells[i].name] = (
                  <>
                    {rec.adults && rec.adults.nb > 0
                      ? `${formatMessage({
                          id: "src.components.announcePage.booking.adults",
                        })} : ${rec.adults.nb}`
                      : ""}
                    {rec.adults && rec.adults.nb > 0 ? <br /> : ""}
                    {rec.children && rec.children.nb > 0
                      ? `${formatMessage({
                          id: "src.components.announcePage.booking.children",
                        })} : ${rec.children.nb}`
                      : ""}
                    {rec.children && rec.children.nb > 0 ? <br /> : ""}
                    {rec.companions && rec.companions.nb > 0
                      ? `${formatMessage({
                          id: "src.components.announcePage.booking.accompanying",
                        })} : ${rec.companions.nb}`
                      : ""}
                  </>
                );
                break;
              case 5: //options
                obj[headCells[i].name] = rec.options && (
                  <div>
                    {Object.keys(rec.options).map((option) => {
                      return (
                        rec.options[option] && (
                          <ul key={option}>{`Option ${option} `}&#x2714;</ul>
                        )
                      );
                    })}
                  </div>
                );

                break;
              case 6: //price
                if (!rec.paymentRecap)
                  obj[headCells[i].name] = `${
                    rec.adults
                      ? rec.adults.price
                      : 0 + rec.children
                      ? rec.children.price
                      : 0 + rec.companions
                      ? rec.companions.price
                      : 0
                  } ${rec.announce.devise}`;
                else {
                  if (rec.paymentRecap.deposit)
                    obj[headCells[i].name] = (
                      <div className="d-flex flex-column mx-3">
                        <div className="d-flex justify-content-left ml-3">
                          {`${formatMessage({
                            id: "src.components.bookingPage.BookDetailInfo.deposit",
                          })} : ${rec.paymentRecap.deposit.amount} ${
                            rec.announce.devise
                          } - ${formatMessage({
                            id: "src.components.bookingPage.BookDetailInfo.asap",
                          })}
                        `}
                        </div>
                        <div className="d-flex justify-content-left ml-3">
                          {`${formatMessage({
                            id: "src.components.bookingPage.BookDetailInfo.balance",
                          })} : ${rec.paymentRecap.balance.amount} ${
                            rec.announce.devise
                          } - ${getFormattedDate(
                            rec.paymentRecap.balance.due,
                            "dd.MM.yyyy"
                          )}`}
                        </div>
                      </div>
                    );
                  else
                    obj[headCells[i].name] = (
                      <div className="d-flex flex-column mx-3">
                        <div className="d-flex justify-content-left ml-3">
                          {`${formatMessage({
                            id: "src.components.bookingPage.BookDetailInfo.totalAccount",
                          })}: ${rec.paymentRecap.total.amount} ${
                            rec.announce.devise
                          } - ${formatMessage({
                            id: "src.components.bookingPage.BookDetailInfo.asap",
                          })}
                    `}
                        </div>
                      </div>
                    );
                }
                break;
              case 7: //steps completed
                obj[headCells[i].name] = (
                  <div
                    id={rec._id}
                    className="d-flex flex-column mx-0 px-0 my-2"
                    style={{
                      maxHeight: "70px",
                      overflowY: "scroll",
                    }}
                  >
                    {Object.keys(stepsNumbering).map((txt) => {
                      return getCompletedSteps(
                        rec.steps,
                        txt,
                        stepsNumbering[txt],
                        formatMessage
                      );
                    })}
                  </div>
                );
                setTimeout(() => {
                  scrollToBottom(rec._id);
                }, 500);
                break;
              case 8: //steps to be done
                obj[headCells[i].name] = (
                  <div className="justify-content-left mx-1 px-1">
                    {getNextSteps(
                      rec.steps,
                      rec._id,
                      formatMessage,
                      onHandleBookingChange
                    )}
                  </div>
                );
                break;
              case 9: //cancel
                obj[headCells[i].name] = (
                  <>
                    <button
                      className="fa fa-trash mx-4"
                      style={{
                        color: "#7aa095",
                        border: "0",
                        fontSize: "20px",
                      }}
                      onClick={(e) => {
                        onHandleBookingChange(rec._id, e.target.id, "cancel");
                      }}
                    ></button>
                  </>
                );
                break;
              case 10: //booking _id
                obj[headCells[i].name] = rec._id;
                break;
              case 11: //id_user
                obj[headCells[i].name] = rec.id_user;
                break;
              case 12: //announce_id
                obj[headCells[i].name] = rec.announce._id;
                break;
            }
          }
        }
        rows.push(obj);
      }
    });
    return rows;
  }
  function handleSummary() {
    if (!selected) return;
    if (open) {
      toastInfo(formatMessage({id: "user_msg.standard.errors.windowOpen"}));
      return;
    }
    firstSel = null;
    Object.keys(selected).map((id) => {
      if (selected[id] === 1 && firstSel === null) {
        Object.keys(bookings).map((usr) => {
          bookings[usr].data.map((bkg, idx) => {
            if (firstSel === null && bkg._id === id) {
              firstSel = [usr, idx];
            }
          });
        });
      }
    });
    setOpen(true);
  }
  const handleSelectAllClick = (event) => {
    const newSelecteds = {};
    rows.map((row) => {
      newSelecteds[row.id] = event.target.checked ? 1 : 0;
    });
    setSelected(newSelecteds);
  };
  const handleClick = (id) => {
    if (selected[id] === 1) setSelected({...selected, [id]: 0});
    else setSelected({...selected, [id]: 1});
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };
  const handlePast = (past) => {
    original = prepareData(headCells, bookings, !past); //past parameter is the opposite of past slider position
    setRows(original);
  };
  const isSelected = (id) => {
    return selected[id] === 1;
  };
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const filterData = (filter) => {
    if (filter) {
      const filtered = _.filter(rows, (row, idx) => {
        return selected[row.id] === 1;
      });
      setRows(filtered);
      setNumFiltered(filtered.length);
    } else {
      setRows(original);
      setNumFiltered(0);
    }
    setPage(0);
  };
  return (
    <>
      {open && (
        <RenderInWindow
          comp={
            <BookingSummary
              data={[bookings[firstSel[0]].data[firstSel[1]]]}
            ></BookingSummary>
          }
          size={{width: 900, height: 500, x: 400, y: 200}}
          onClose={() => {
            setOpen(false);
          }}
        ></RenderInWindow>
      )}
      <Paper sx={{width: "120%"}}>
        <TableToolbar
          numSelected={sumOfPropsValues(selected)}
          selected={selected}
          numFiltered={numFiltered}
          theme={themes.toolbar}
          spinner={spinner}
          onFilter={filterData}
          onHandlePast={handlePast}
          onHandleSummary={handleSummary}
        />
        <TableContainer>
          <Table
            stickyHeader
            aria-label="sticky table"
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <Tablehead
              headCells={headCells}
              numSelected={sumOfPropsValues(selected)}
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
              theme={themes.header}
            />
            <ThemeProvider theme={themes.body}>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={() => handleClick(row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        {Object.keys(row).map((item, idx) => {
                          return (
                            <TableCell
                              onClick={(e) => {
                                if (e.target.cellIndex === undefined) {
                                  //prevents row selection when clicking buttons inside cell >>> cell click behaviour unchanged (i.e row selection)
                                  e.stopPropagation();
                                  e.preventDefault();
                                }
                              }}
                              key={idx}
                              align={headCells[idx].align}
                              hidden={headCells[idx].hidden ? true : false}
                              style={{
                                color:
                                  idx === 8
                                    ? row[headCells[idx].name] === "false"
                                      ? "black"
                                      : "red"
                                    : "black",
                              }}
                            >
                              {row[headCells[idx].name]}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  ></TableRow>
                )}
              </TableBody>
            </ThemeProvider>
          </Table>
        </TableContainer>
        <ThemeProvider theme={themes.footer}>
          <TablePagination
            rowsPerPageOptions={[]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            labelRowsPerPage={null}
          />
        </ThemeProvider>
      </Paper>
    </>
  );
}
export default DataTable;
