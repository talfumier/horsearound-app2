import {useState, useEffect} from "react";
import {alpha} from "@mui/material/styles";
import Box from "@mui/material/Box";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  ThemeProvider,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import {visuallyHidden} from "@mui/utils";
import {FormattedMessage, useIntl} from "react-intl";
import _ from "lodash";
import {addDays} from "date-fns";
import {parseISO, format, isDate, differenceInCalendarDays} from "date-fns";
import {useCookies} from "react-cookie";
import {useNavigate, useLocation} from "react-router-dom";
import {testGuaranteedDeparture} from "../../../utils/utilityFunctions";
import {sumOfPropsValues} from "../../../utils/utilityFunctions";
import {decodeJWT} from "../../../../../services/httpUsers.js";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
function EnhancedTableHead({
  headCells,
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
  theme,
  sx,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <ThemeProvider theme={theme}>
      <TableHead>
        <TableRow>
          <TableCell>
            <Checkbox
              style={{color: "white", padding: "0", margin: "0"}}
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              style={{padding: "0", margin: "0"}}
              key={headCell.name}
              align={headCell.numeric ? "right" : "left"}
              hidden={headCell.hidden ? true : false}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.name ? order : false}
            >
              <TableSortLabel
                sx={sx}
                active={orderBy === headCell.name}
                direction={orderBy === headCell.name ? order : "asc"}
                onClick={createSortHandler(headCell.name)}
                style={{color: "white"}}
                hidden={headCell.hidden ? true : false}
              >
                {headCell.label}
                {orderBy === headCell.name ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </ThemeProvider>
  );
}
const EnhancedTableToolbar = ({
  announce,
  formatMessage,
  rows,
  selected,
  numSelected,
  numFiltered,
  theme,
  onFilter,
  onHandleFormBooking,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["user"]);
  const currentUser = cookies.user ? decodeJWT(cookies.user) : null;
  const [filter, setFilterStatus] = useState(false);
  //const [open, setOpen] = useState(false);
  function handleFilter(cond) {
    onFilter(cond);
    setFilterStatus(cond);
  }
  function getLabel() {
    let num = "",
      txt = "";
    if (numFiltered > 0) {
      num = numFiltered;
      txt = formatMessage({id: "user_msg.standard.filtered"});
    } else if (numSelected > 0) {
      num = numSelected;
      txt = formatMessage({id: "user_msg.standard.selected"});
    }
    return (
      <div className="d-inline-flex align-items-center ">
        {`${num} ${txt}`}
        <div
          disabled={
            !cookies.user || Number(num) === 0 || currentUser.type === "pro"
          }
          className="dropdown singleDrop btn btn-success p-2 pl-3 pr-3 ml-5"
          onClick={() => {
            if (
              !cookies.user ||
              Number(num) === 0 ||
              currentUser.type === "pro"
            )
              return;
            onHandleFormBooking(
              true,
              _.filter(rows, (row) => {
                return selected.indexOf(row.id) !== -1;
              })
            );
          }}
        >
          {formatMessage({
            id: "src.components.announcePage.booking.bookButton",
          })}
        </div>
        {!cookies.user && (
          <div className="d-inline-flex alert alert-danger justify-content-center m-0 ml-4 p-0 pl-4 pr-4 ">
            <h5>
              <FormattedMessage id="src.components.announcePage.booking.userLoggedIn"></FormattedMessage>
            </h5>
          </div>
        )}
        {cookies.user && (
          <>
            <div className="d-inline-flex alert alert-success justify-content-center m-0 p-0 pl-4 pr-4 ">
              <h5 className="p-1 my-2">
                {announce.datesType === "Fixed_Fixed" ? (
                  <FormattedMessage id="src.components.announcePage.booking.fixed_fixed"></FormattedMessage>
                ) : null}
                {announce.datesType === "Flex_Fixed" ? (
                  <FormattedMessage id="src.components.announcePage.booking.flex_fixed"></FormattedMessage>
                ) : null}
                {announce.datesType === "Flex_Flex" ? (
                  <FormattedMessage id="src.components.announcePage.booking.flex_flex"></FormattedMessage>
                ) : null}
              </h5>
            </div>
            <div
              className="dropdown singleDrop btn btn-success"
              onClick={() => {
                navigate(
                  `${location.pathname}${location.search}&MyBookings_ann_id=${announce._id}`, //add 'MyBookings' parameter in url to be able to come back on tab3 when using browser back button
                  {
                    replace: true,
                    state: location.state,
                  }
                );
                navigate(`/member?MyBookings_ann_id=${announce._id}`); //navigate to MemberPage 'Bookings' tab instead of landing on DashBoard tab
              }}
            >
              <FormattedMessage id="src.components.bookingPage.StepFour.redirect" />
            </div>
          </>
        )}
      </div>
    );
  }
  return (
    <ThemeProvider theme={theme}>
      <Toolbar
        variant="dense"
        sx={{
          pl: {sm: 2},
          pr: {xs: 1, sm: 1},
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        <Typography
          sx={{flex: "1 1 100%"}}
          color="inherit"
          variant="h6"
          component="div"
        >
          {getLabel()}
        </Typography>
        <IconButton
          onClick={() => {
            handleFilter(true);
          }}
        >
          <FilterListIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            handleFilter(false);
          }}
        >
          <FilterListOffIcon />
        </IconButton>
      </Toolbar>
    </ThemeProvider>
  );
};
let original = [];
export default function DataTable({
  headCells,
  announce,
  themes,
  onHandleFormBooking,
}) {
  const {locale, formatMessage} = useIntl();
  const [rows, setRows] = useState([]);
  useEffect(() => {
    original = prepareData(headCells, announce);
    setRows(original);
  }, []);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(headCells[0].name);
  const [selected, setSelected] = useState([]);
  const [numFiltered, setNumFiltered] = useState(0);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  function formatDate(date) {
    return _.isString(date) ? parseISO(date) : date;
  }
  function getPriceRecap(promo) {
    return (
      <div>
        {announce.priceAdulte
          ? `${formatMessage({
              id: "src.components.announcePage.booking.adult",
            })}
          : ${getPrice(announce.priceAdulte, promo)}`
          : null}
        {announce.priceAdulte ? <br></br> : null}
        {announce.priceChild
          ? `${formatMessage({
              id: "src.components.announcePage.booking.child",
            })}
           : ${getPrice(announce.priceChild, promo)}`
          : null}
        {announce.priceChild ? <br></br> : null}
        {announce.priceAccompagnateur
          ? `${formatMessage({
              id: "src.components.announcePage.booking.companion",
            })}
            : ${getPrice(announce.priceAccompagnateur, promo)}`
          : null}
      </div>
    );
  }
  function getPrice(price, promo) {
    return (
      (promo
        ? Math.round((price - (price * promo) / 100) * 100 + Number.EPSILON) /
          100
        : price) +
      " " +
      announce.devise
    );
  }
  function getOptionRecap(options) {
    if (options.length === 0) return "";
    return (
      <div style={{whiteSpace: "pre"}}>
        {options.map((option, idx) => {
          return (
            <div className="mt-1" key={idx}>
              {`Option#${option.option}: ${option.price} ${
                announce.devise
              } ${formatMessage({
                id: `src.components.memberPage.tabs.annonces.details.AddOption.option${option.type}`,
              })}`}
            </div>
          );
        })}
      </div>
    );
  }
  function getPriceDatesData(announce) {
    if (announce.dates) {
      const data = [];
      let rowData = [],
        bookingsByDay = [];
      announce.dates.forEach((date, idx) => {
        rowData = [];
        bookingsByDay = initBookingsByDay(
          formatDate(date.period.dateStart),
          formatDate(date.period.dateEnd),
          _.cloneDeep(date.bookingsByDay)
        );
        rowData.push(
          formatDate(date.period.dateStart),
          formatDate(date.period.dateEnd)
        );
        switch (announce.datesType) {
          case "Fixed_Fixed":
            rowData.push(
              differenceInCalendarDays(
                formatDate(date.period.dateEnd),
                formatDate(date.period.dateStart)
              ) + 1, //stay duration
              `${
                bookingsByDay !== null
                  ? sumOfPropsValues(bookingsByDay[0].bookings) //sum up object's props values for the 1st day (in Fixed_Fixed case, bookings for each day of the period is the same)
                  : 0
              } / ${announce.participantMax}`,
              formatMessage({
                id: testGuaranteedDeparture(
                  [announce.dates[idx]],
                  announce.participantMin,
                  announce.participantMax
                ),
              })
            );
            break;
          case "Flex_Fixed":
            rowData.push(announce.nbDays); //stay duration=announce nbDays
        }
        rowData.push(
          date.comments ? date.comments[locale] : null,
          getPriceRecap(date.promotion),
          getOptionRecap(announce.options),
          date.promotion ? "-" + date.promotion + "%" : "",
          idx,
          date.promotion,
          bookingsByDay
        );
        data.push(rowData);
      });
      return data;
    }
  }
  function initBookingsByDay(start, end, bookingsByDay) {
    let i = 0,
      n = 0,
      day = start;
    try {
      n = bookingsByDay.length;
    } catch (error) {}
    const bBD = [];
    while (day.setHours(0, 0, 0, 0) <= end.setHours(0, 0, 0, 0)) {
      if (n > 0) {
        for (let j = 0; j < n; j++) {
          if (
            day.setHours(0, 0, 0, 0) === //existing bookingByDay for that day
            formatDate(bookingsByDay[j].day).setHours(0, 0, 0, 0)
          ) {
            bBD.push({day, bookings: bookingsByDay[j].bookings});
            break;
          }
          if (j === n - 1)
            bBD.push({
              day,
              bookings: {0: 0, 1: 0, 2: 0}, //adult,child,companion
            });
        }
      } else bBD.push({day, bookings: {0: 0, 1: 0, 2: 0}});
      i++;
      day = addDays(start, i);
    }
    return bBD;
  }
  function prepareData(headCells, announce) {
    const data = getPriceDatesData(announce);
    const rows = [];
    let obj = {};
    data.map((record) => {
      obj = {};
      record.map((item, idx) => {
        try {
          obj[headCells[idx].name] = item;
        } catch (error) {
          switch (`${idx}-${announce.datesType}`) {
            case "7-Flex_Flex":
            case "8-Flex_Fixed":
            case "10-Fixed_Fixed":
              obj.promotion = item;
              break;
            case "8-Flex_Flex":
            case "9-Flex_Fixed":
            case "11-Fixed_Fixed":
              obj.bookingsByDay = item;
          }
        }
      });
      rows.push(obj);
    });
    return rows;
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((row) => row.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [...selected];
    if (selectedIndex === -1) newSelected.push(id);
    else newSelected.splice(selectedIndex, 1);
    setSelected(newSelected);
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
  const isSelected = (id) => selected.indexOf(id) !== -1;
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const filterData = (filter) => {
    if (filter) {
      const filtered = _.filter(rows, (row, idx) => {
        return selected.indexOf(row.id) !== -1;
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
    <Box sx={{width: "100%"}}>
      <Paper sx={{width: "100%", mb: 2}}>
        <EnhancedTableToolbar
          announce={announce}
          formatMessage={formatMessage}
          rows={rows}
          selected={selected}
          numSelected={selected.length}
          numFiltered={numFiltered}
          theme={themes.toolbar}
          onFilter={filterData}
          onHandleFormBooking={onHandleFormBooking}
        />
        <TableContainer>
          <Table
            stickyHeader
            aria-label="sticky table"
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              theme={themes.header}
              sx={themes.header_sx}
            />
            <ThemeProvider theme={themes.body}>
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                  rows.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
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
                          return idx === 0 ? (
                            <TableCell
                              key={idx}
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                              align={headCells[idx].align}
                            >
                              {isDate(row[headCells[idx].name])
                                ? format(row[headCells[idx].name], "dd.MM.yyyy")
                                : row[headCells[idx].name]}
                            </TableCell>
                          ) : (
                            idx <= headCells.length - 1 && (
                              <TableCell
                                key={idx}
                                align={headCells[idx].align}
                                hidden={headCells[idx].hidden ? true : false}
                              >
                                {isDate(row[headCells[idx].name])
                                  ? format(
                                      row[headCells[idx].name],
                                      "dd.MM.yyyy"
                                    )
                                  : row[headCells[idx].name]}
                              </TableCell>
                            )
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
            //onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </ThemeProvider>
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </Box>
  );
}
