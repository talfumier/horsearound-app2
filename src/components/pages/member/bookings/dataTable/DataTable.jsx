import {useState, useEffect, useContext} from "react";
import {useIntl} from "react-intl";
import {Link, useNavigate} from "react-router-dom";
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
  Tooltip,
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
import ParticipantsList from "./participants/ParticipantsList.jsx";
import {toastInfo} from "../../../common/toastSwal/ToastMessages.js";
import {scrollToBottom} from "../../../utils/utilityFunctions.js";
import ImagesContext from "../../../common/context/ImagesContext.js";
import "./style.css";

export function getNextSteps(
  steps,
  id,
  stepsNumbering,
  formatMessage,
  formatRoot,
  onHandleChange
) {
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
                "paid",
              ].indexOf(e.target.id) !== -1
            )
              return;
            if (onHandleChange) onHandleChange(id, e.target.id);
          }}
        >
          {stepsNumbering[txt] !== undefined &&
            ` ${
              txt === "akn" ? stepsNumbering["akn"][key] : stepsNumbering[txt]
            } - `}
          {`${formatMessage({
            id: `${formatRoot}.${txt}`,
          })}`}
          {(txt === "completed" || txt === "paid") && (
            <span className="ml-2">&#x2714;</span>
          )}
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
export function getCompletedSteps(
  steps,
  txt,
  taskNbr,
  formatMessage,
  formatRoot
) {
  let step = null;
  return Object.keys(steps).map((key) => {
    step = steps[key];
    if (step && step[txt])
      return (
        <div
          className="d-flex justify-content-left ml-1 my-0 py-1"
          key={key}
          style={{
            color: "dark green",
            fontWeight: "600",
          }}
        >
          <div
            className="badge badge-light my-0 mr-2"
            style={{
              backgroundColor:
                step.by === "pro"
                  ? "yellow"
                  : step.by === "particulier"
                  ? "#4472C4"
                  : "#7aa095",
              color: step.by === "pro" ? "#305496" : "#ffffff",
              fontWeight: "normal",
              width: "30px",
              height: "19px",
              border: "solid 1px",
              paddingLeft: 0,
              paddingRight: 0,
            }}
          >
            {taskNbr}
          </div>
          <div>
            {`${formatMessage({
              id: `${formatRoot}.${txt}`,
            })} ${getFormattedDate(step[txt], "dd.MM.yyyy")} `}
            &#x2714;
          </div>
        </div>
      );
  });
}

let original = [];
function DataTable({
  headCells,
  bookings,
  selected: sel,
  themes,
  spinner,
  onHandleBookingChange,
  onHandleParticipantsChange,
  onHandleToggle,
}) {
  const navigate = useNavigate();
  const {locale, formatMessage} = useIntl();
  const contextImages = useContext(ImagesContext);
  const [rows, setRows] = useState([]);
  console.log("DataTable render");
  const [numFiltered, setNumFiltered] = useState(null);
  useEffect(() => {
    original = prepareData(headCells, bookings); //default past parameter=true (i.e. includes dates in the past)
    setRows(original);
    setNumFiltered(0);
  }, [bookings]);
  const [firstSel, setFirstSel] = useState(null);
  useEffect(() => {
    if (open.infos) setOpen({...open, infos: false});
  }, [firstSel]);
  const [selected, setSelected] = useState(sel);
  useEffect(() => {
    let flg = -1;
    Object.keys(selected).map((id) => {
      if (selected[id] === 1 && flg === -1) {
        Object.keys(bookings).map((usr) => {
          bookings[usr].data.map((bkg, idx) => {
            if (flg === -1 && bkg._id === id) {
              flg += 1;
              setFirstSel([usr, idx]);
            }
          });
        });
      }
    });
    if (flg === -1) setFirstSel(null);
  }, [selected]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState({summary: false, infos: false});
  function getURL(id) {
    let url = `/member?MyBookings_ids=${[id]}`;
    console.log("numFiltered", numFiltered, selected);
    if (document.getElementById("bkgPastSlider").checked) url = `${url}&past`;
    if (numFiltered > 0) url = `${url}&filtered`;
    return url;
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
                    <a
                      className="alink"
                      onClick={() => {
                        navigate(
                          getURL(rec._id), //add 'MyBookings' parameter in url to be able to come back on bookings tab when using browser back button
                          {
                            replace: true,
                          }
                        );
                        /* navigate(`/announce/details?id=${rec.announce._id}`,//navigate to Announce details page 
                        {
                          state: {
                            images:
                              contextImages &&
                              Object.keys(contextImages).length > 0
                                ? contextImages[rec.announce._id]
                                : [],
                          },
                        }); */
                      }}
                    >
                      {`${rec.announce.title[locale]}`}
                    </a>
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
                  <div style={{textAlign: "right"}}>
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
                  </div>
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
                          })} : ${Math.round(
                            rec.paymentRecap.deposit.amount
                          )} ${rec.announce.devise} - ${formatMessage({
                            id: "src.components.bookingPage.BookDetailInfo.asap",
                          })}
                        `}
                        </div>
                        <div className="d-flex justify-content-left ml-3">
                          {`${formatMessage({
                            id: "src.components.bookingPage.BookDetailInfo.balance",
                          })} : ${Math.round(
                            rec.paymentRecap.balance.amount
                          )} ${rec.announce.devise} - ${getFormattedDate(
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
                          })}: ${Math.round(rec.paymentRecap.total.amount)} ${
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
                        formatMessage,
                        "src.components.memberPage.tabs.MyReservation"
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
                      stepsNumbering,
                      formatMessage,
                      "src.components.memberPage.tabs.MyReservation",
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
  function getParticipantsButton(id) {
    let allSet = false,
      na = 0,
      nc = 0,
      ncp = 0;
    Object.keys(bookings).map((usr) => {
      bookings[usr].data.map((bkg) => {
        if (bkg._id === id) {
          try {
            bkg.participantsInfo.map((part) => {
              if (part) {
                na += part.as === "adult" ? 1 : 0;
                nc += part.as === "child" ? 1 : 0;
                ncp += part.as === "companion" ? 1 : 0;
              }
            });
          } catch (error) {}
          if (
            na === bkg.adults.nb &&
            nc === bkg.children.nb &&
            ncp === bkg.companions.nb
          )
            allSet = true;
        }
      });
    });
    return (
      <ThemeProvider theme={themes.infos}>
        <Tooltip
          title={formatMessage({
            id: "src.components.memberPage.tabs.MyReservation.infos",
          })}
          arrow
        >
          <button
            className="btn btn-warning ml-2 px-2 py-0"
            style={{
              fontSize: "1.2rem",
              fontWeight: "500",
              color: "#ffffff",
              backgroundColor:
                firstSel !== null &&
                id === bookings[firstSel[0]].data[firstSel[1]]._id
                  ? "#4472C4"
                  : "#A5BBE3",
              marginTop: 0,
              height: 25,
              width: 50,
            }}
            onClick={() => {
              if (
                firstSel === null ||
                id !== bookings[firstSel[0]].data[firstSel[1]]._id
              )
                return;
              handleSummaryParticipants("infos");
            }}
          >
            <span>infos</span> {allSet ? <span> &#x2714;</span> : null}
          </button>
        </Tooltip>
      </ThemeProvider>
    );
  }
  function handleSummaryParticipants(cs) {
    if (open[cs]) {
      toastInfo(formatMessage({id: "user_msg.standard.errors.windowOpen"}));
      return;
    }
    setOpen({...open, [cs]: true});
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
    console.log("filterData", filter);
    if (filter) {
      const filtered = _.filter(rows, (row, idx) => {
        return selected[row.id] === 1;
      });
      setRows(filtered);
      console.log("filtered.length", filtered.length);
      setNumFiltered(filtered.length);
    } else {
      console.log("xxx 0");
      setNumFiltered(0);
      setRows(original);
    }
    setPage(0);
  };
  try {
    return (
      <>
        {open.summary && (
          <RenderInWindow
            comp={
              <BookingSummary
                data={[bookings[firstSel[0]].data[firstSel[1]]]}
              ></BookingSummary>
            }
            size={{width: 900, height: 500, x: 400, y: 200}}
            onClose={() => {
              setOpen({...open, summary: false});
            }}
          ></RenderInWindow>
        )}
        {open.infos && (
          <RenderInWindow
            comp={
              <ParticipantsList
                data={[bookings[firstSel[0]].data[firstSel[1]]]}
                onHandleToggle={onHandleToggle}
                onHandleSave={(data) => {
                  bookings[data.userId].data.map((bkg, idx) => {
                    if (bkg._id === data._id) {
                      bookings[data.userId].data[idx].participantsInfo =
                        data.ticked;
                      onHandleParticipantsChange(
                        data.userId,
                        data._id,
                        data.ticked
                      );
                    }
                  });
                }}
              ></ParticipantsList>
            }
            size={{width: 900, height: 500, x: 400, y: 200}}
            onClose={() => {
              setOpen({...open, infos: false});
            }}
          ></RenderInWindow>
        )}
        <Paper sx={{width: "120%"}}>
          <TableToolbar
            numSelected={sumOfPropsValues(selected)}
            numFiltered={numFiltered}
            theme={themes.toolbar}
            spinner={spinner}
            onHandleFilter={filterData}
            onHandlePast={handlePast}
            onHandleSummary={() => {
              handleSummaryParticipants("summary");
            }}
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
                                  if (
                                    e.target.cellIndex === 2 ||
                                    e.target.cellIndex === undefined
                                  ) {
                                    //prevents row selection when clicking buttons inside cell >>> cell click behaviour unchanged (i.e row selection)
                                    e.stopPropagation();
                                    e.preventDefault();
                                  }
                                }}
                                key={idx}
                                align={headCells[idx].align}
                                width={headCells[idx].width}
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
                                {idx === 4 ? (
                                  <div className="d-flex justify-content-center">
                                    {row[headCells[idx].name]}
                                    {getParticipantsButton(row.id)}
                                  </div>
                                ) : (
                                  row[headCells[idx].name]
                                )}
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
  } catch (error) {
    console.log("error in MemberPage bookings tab >>> DataTable.jsx ", error);
    return null;
  }
}
export default DataTable;
