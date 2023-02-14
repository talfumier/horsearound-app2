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
import {useCookies} from "react-cookie";
import {decodeJWT} from "../../../../../services/httpUsers.js";
import TableToolbar from "./TableToolbar.jsx";
import Tablehead from "./Tablehead.jsx";
import {
  getFormattedDate,
  sumOfPropsValues,
} from "../../../utils/utilityFunctions.js";
import stepsNumbering from "./stepsNumbering.json";
import {
  getCompletedSteps,
  getNextSteps,
} from "../../bookings/dataTable/DataTable.jsx";
import {RenderInWindow} from "../../../common/RenderInWindow.jsx";
import InvoiceSummary from "./summary/InvoiceSummary.jsx";
import {toastInfo} from "../../../common/toastSwal/ToastMessages.js";
import {scrollToBottom} from "../../../utils/utilityFunctions.js";

let original = [],
  firstSel = null;
function DataTable({
  headCells,
  invoices,
  themes,
  spinner,
  onHandleInvoiceChange,
}) {
  const {locale, formatMessage} = useIntl();
  const [cookies, setCookie] = useCookies(["user"]);
  const currentUser = cookies.user ? decodeJWT(cookies.user) : null;
  const [rows, setRows] = useState([]);
  useEffect(() => {
    original = prepareData(headCells, invoices); //default closed parameter=true (i.e. includes invoices that have been paid)
    setRows(original);
  }, [invoices]);
  const [selected, setSelected] = useState({});
  const [numFiltered, setNumFiltered] = useState(0);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  function getRelatedBookingsByAnn(ids, bkgs, anns) {
    let result = [];
    anns.map((ann) => {
      result.push({[ann._id]: {title: ann.title, bookings: []}});
    });
    bkgs.map((bkg) => {
      if (ids.indexOf(bkg._id) !== -1) {
        result.map((ann, idx) => {
          if (Object.keys(ann)[0] === bkg.id_announce)
            result[idx][
              bkg.id_announce
            ].bookings = `${result.bookings}, ${bkg.ref}`;
        });
      }
    });
    return result;
  }
  function prepareData(headCells, data, closed = true) {
    const rows = [],
      n = headCells.length;
    let company = null,
      obj = {},
      key = null;
    Object.keys(data).map((proId) => {
      try {
        company = data[proId].data[0];
        company.invoice.map((invoice) => {
          if (
            closed ||
            (!closed && invoice.steps[3].paymentReceived === null)
          ) {
            //filter out paid invoices (closed=false)
            obj = {};
            for (let i = 0; i < n; i++) {
              {
                switch (i) {
                  case 0: //reference-company
                    obj[headCells[i].name] = (
                      <>
                        {`${invoice.ref}`}
                        <br />
                        {`${company.corpName}`}
                      </>
                    );
                    break;
                  case 1: //period
                    obj[headCells[i].name] = (
                      <>
                        {`${getFormattedDate(
                          invoice.period.dateStart,
                          "dd.MM.yyyy"
                        )} - ${getFormattedDate(
                          invoice.period.dateEnd,
                          "dd.MM.yyyy"
                        )}`}
                      </>
                    );
                    break;
                  case 2: //related announces & bookings
                    obj[headCells[i].name] = (
                      <>
                        {getRelatedBookingsByAnn(
                          invoice.id_booking,
                          company.booking,
                          company.announce
                        ).map((item, idx) => {
                          key = Object.keys(item)[0];
                          return (
                            <ul key={idx}>
                              {`${formatMessage({
                                id: "src.components.memberPage.tabs.price.MyPrice.relatedAnn",
                              })}: ${item[key].title[locale]}`}
                              <br></br>
                              {`${formatMessage({
                                id: "src.components.memberPage.tabs.price.MyPrice.relatedBook",
                              })}: ${item[key].bookings}`}
                            </ul>
                          );
                        })}
                      </>
                    );
                    break;
                  case 3: //amount
                    obj[headCells[i].name] = (
                      <>{`${invoice.amount + invoice.penaltyAmount} ${
                        company.announce[0].devise
                      }`}</>
                    );
                    break;
                  case 4: //deadline
                    obj[headCells[i].name] = getFormattedDate(
                      invoice.steps["1"].next.pro.payInvoice,
                      "dd.MM.yyyy"
                    );
                    break;
                  case 5: //steps completed
                    obj[headCells[i].name] = (
                      <div
                        id={invoice._id}
                        className="d-flex flex-column mx-0 px-0 my-2"
                        style={{
                          maxHeight: "70px",
                          overflowY: "scroll",
                        }}
                      >
                        {Object.keys(stepsNumbering).map((txt) => {
                          return getCompletedSteps(
                            invoice.steps,
                            txt,
                            stepsNumbering[txt],
                            formatMessage,
                            "src.components.memberPage.tabs.price.MyPrice"
                          );
                        })}
                      </div>
                    );
                    setTimeout(() => {
                      scrollToBottom(invoice._id);
                    }, 500);
                    break;
                  case 6: //steps to be done
                    obj[headCells[i].name] = (
                      <div className="justify-content-left mx-1 px-1">
                        {getNextSteps(
                          invoice.steps,
                          invoice._id,
                          stepsNumbering,
                          formatMessage,
                          "src.components.memberPage.tabs.price.MyPrice",
                          onHandleInvoiceChange
                        )}
                      </div>
                    );
                    break;
                  case 7: //cancel
                    obj[headCells[i].name] = (
                      <>
                        <button
                          className="fa fa-trash mx-4"
                          style={{
                            color:
                              currentUser.role !== "ADMIN" ? "#ccc" : "#7aa095",
                            border: "0",
                            fontSize: "20px",
                          }}
                          onClick={(e) => {
                            onHandleInvoiceChange(
                              invoice._id,
                              e.target.id,
                              "cancel"
                            );
                          }}
                        ></button>
                      </>
                    );
                    break;
                  case 8: //id
                    obj[headCells[i].name] = invoice._id;
                    break;
                }
              }
            }
            rows.push(obj);
          }
        });
      } catch (error) {} //pro with a 'PENDING' status
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
        Object.keys(invoices).map((usr) => {
          invoices[usr].data[0].invoice.map((invoice, idx) => {
            if (firstSel === null && invoice._id === id) {
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
  const handleClosed = (closed) => {
    original = prepareData(headCells, invoices, !closed); //closed parameter is the opposite of closed slider position
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
            <InvoiceSummary
              data={{
                invoice: invoices[firstSel[0]].data[0].invoice[firstSel[1]],
                data: invoices[firstSel[0]].data[0],
              }}
            ></InvoiceSummary>
          }
          size={{width: 900, height: 500, x: 400, y: 200}}
          onClose={() => {
            setOpen(false);
          }}
        ></RenderInWindow>
      )}
      <Paper sx={{width: "100%"}}>
        <TableToolbar
          numSelected={sumOfPropsValues(selected)}
          selected={selected}
          numFiltered={numFiltered}
          theme={themes.toolbar}
          spinner={spinner}
          onFilter={filterData}
          onHandleClosed={handleClosed}
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
