import {useState, useEffect, useContext} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {Link, useNavigate} from "react-router-dom";
import {alpha} from "@mui/material/styles";
import {useCookies} from "react-cookie";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  ThemeProvider,
  Grid,
  Tooltip,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import FontAwesome from "react-fontawesome";
import _ from "lodash";
import {parseISO} from "date-fns";
import ImagesContext from "../../common/context/ImagesContext.js";
import {getFormattedDate} from "../../utils/utilityFunctions.js";
import intlData from "../../../intl/translations.json";
import "../../../../css/sliderInput.css";
import {handleDelete} from "./form/AnnounceForm.jsx";
import {getAnnounceImages} from "../../../../services/httpImages.js";
import {errorHandlingToast} from "../../../../services/utilsFunctions.js";
import {deleteConditionsSatisfied} from "./form/AnnounceForm.jsx";
import {toastError} from "../../common/toastSwal/ToastMessages.js";
import {sumOfPropsValues} from "../../utils/utilityFunctions.js";

let firstSelected = -1;
function EnhancedTableHead({
  headCells,
  numSelected,
  onSelectAllClick,
  rowCount,
  theme,
}) {
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
              key={headCell.name}
              align="center"
              hidden={headCell.hidden ? true : false}
              padding="normal"
            >
              {headCell.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </ThemeProvider>
  );
}
const EnhancedTableToolbar = ({
  intl,
  numSelected,
  rows,
  selected,
  edit,
  numFiltered,
  theme,
  onFilter,
  onHandlePastArchived,
  onHandleSaveDelete,
}) => {
  const {locale, formatMessage} = useIntl();
  const [cookies, setCookie] = useCookies(["user"]);
  const contextImages = useContext(ImagesContext);
  const navigate = useNavigate();
  const [filter, setFilterStatus] = useState(false);
  const [spin, setSpinner] = useState(false);
  const [trashConditions, setTrashConditions] = useState({
    cond: [false, ""],
    color: "#ccc",
  });
  useEffect(() => {
    async function setConditions() {
      const result = await deleteConditionsSatisfied(
        edit._id,
        false, //local=false
        edit,
        cookies.user,
        formatMessage
      );
      setTrashConditions({cond: result, color: result[0] ? "#7AA095" : "#ccc"});
    }
    if (numSelected === 0 || numSelected > 1)
      setTrashConditions({cond: [false, ""], color: "#ccc"});
    else setConditions(); //clean-up code in deleteConditionsSatisfiedRR()
  }, [edit]);
  function handleFilter(cond) {
    onFilter(cond);
    setFilterStatus(cond);
  }
  function getLabel() {
    function getURL() {
      let url = "";
      if (numSelected > 0) {
        url = `/member?MyAnnounces&${rows[0].user_id}&${firstSelected}`;
      } else url = "/member?MyAnnounces"; //new announce case
      if (numSelected > 1)
        Object.keys(selected).map((id) => {
          if (selected[id] === 1 && id !== firstSelected) url = `${url}&${id}`;
        });
      if (numFiltered > 0) url = `${url}&filtered`;
      if (document.getElementById("archivedSlider").checked)
        url = `${url}&archived`;
      if (document.getElementById("annPastSlider").checked)
        url = `${url}&noPast`;
      return url;
    }
    let num = "",
      txt = "";
    if (numFiltered > 0) {
      num = numFiltered;
      txt = intl.formatMessage({id: "user_msg.standard.filtered"});
    } else if (numSelected > 0) {
      num = numSelected;
      txt = intl.formatMessage({id: "user_msg.standard.selected"});
    }

    async function getImages() {
      if (
        contextImages &&
        contextImages[firstSelected] &&
        contextImages[firstSelected].length > 0
      )
        return contextImages[firstSelected];
      else {
        const abortController = new AbortController();
        const res = await getAnnounceImages(
          firstSelected,
          abortController.signal
        );
        if (!(await errorHandlingToast(res, locale, false)))
          return res.data.images.images;
      }
      return [];
    }
    return (
      <div className="d-inline-flex align-items-center">
        {`${num} ${txt}`}
        <Grid item xs={0.85} ml={4} mr={3}>
          <span>
            <Tooltip
              title={intl.formatMessage({
                id: "src.components.memberPage.tabs.annonces.MyAnnonces.span1",
              })}
              arrow
            >
              <button
                className="fa fa-eye fa-2x mx-3 "
                style={{
                  color: numSelected >= 1 ? "#7AA095" : "#ccc",
                  border: "0",
                }}
                onClick={async () => {
                  navigate(getURL(), {
                    replace: true,
                  });
                  setSpinner(true);
                  const images = await getImages();
                  setSpinner(false);
                  navigate(`/announce/details?id=${firstSelected}`, {
                    state: {images, id: firstSelected},
                  });
                }}
              ></button>
            </Tooltip>
          </span>
          <Tooltip
            title={intl.formatMessage({
              id: "src.components.memberPage.tabs.annonces.MyAnnonces.span4",
            })}
            arrow
          >
            <Link
              className="fa fa-pencil fa-2x mx-3"
              style={{
                color: numSelected >= 1 ? "#7AA095" : "#ccc",
                border: "0",
              }}
              to={
                numSelected > 0
                  ? `/member/announces/edit/${firstSelected}`
                  : null
              }
              state={{
                announce: edit,
                selected,
                userId: numSelected > 0 ? rows[0].user_id : null,
              }}
              onClick={() => {
                navigate(getURL(), {
                  replace: true,
                });
              }}
            ></Link>
          </Tooltip>
          <Tooltip
            title={intl.formatMessage({
              id: "src.components.memberPage.tabs.annonces.MyAnnonces.span3",
            })}
            arrow
          >
            <button
              className="fa fa-calendar fa-2x mx-3"
              style={{
                color: numSelected >= 1 ? "#7AA095" : "#ccc",
                border: "0",
              }}
              onClick={() => {
                //handleDeleteComment(comment._id);
              }}
            ></button>
          </Tooltip>
          <Tooltip
            title={intl.formatMessage({
              id: "src.components.memberPage.tabs.annonces.MyAnnonces.span6",
            })}
            arrow
          >
            <button
              className="fa fa-trash fa-2x mx-4"
              style={{
                color: trashConditions.color,
                border: "0",
              }}
              onClick={async () => {
                if (numSelected === 0 || numSelected > 1) return;
                if (!trashConditions.cond[0]) {
                  toastError(trashConditions.cond[1]);
                  return;
                }
                setSpinner(true);
                await handleDelete(
                  edit,
                  edit._id,
                  locale,
                  cookies.user,
                  onHandleSaveDelete,
                  formatMessage,
                  false,
                  navigate
                );
                setSpinner(false);
              }}
            ></button>
          </Tooltip>
          <h3 className="d-inline media-heading mr-4 ">
            {!spin ? null : (
              <FontAwesome
                className="fa fa-spinner fa-lg"
                style={{
                  color: "#7AA095",
                }}
                name="spinner"
                pulse
              />
            )}
          </h3>
        </Grid>
        <Link
          className="dropdown singleDrop btn btn-success p-2 pl-3 pr-3 ml-5"
          to="/member/announces/new"
          onClick={() => {
            navigate(getURL(), {
              replace: true,
            });
          }}
          state={{
            announce: {_id: -1},
            selected,
            userId: numSelected > 0 ? rows[0].user_id : null,
          }}
        >
          {intl.formatMessage({
            id: "src.components.memberPage.tabs.annonces.MyAnnonces.createButton",
          })}
        </Link>
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
        <Typography
          sx={{flex: "1 1 100%"}}
          color="inherit"
          variant="h6"
          component="div"
        >
          <div className="d-flex justify-content-end pt-3 pr-3">
            <div className="d-flex mr-5">
              <p>
                <FormattedMessage id="src.components.memberPage.tabs.annonces.MyAnnonces.slider2" />
              </p>
              <label className="switch ml-2">
                <input
                  id="annPastSlider"
                  type="checkbox"
                  onChange={() => {
                    onHandlePastArchived(
                      document.getElementById("annPastSlider").checked,
                      document.getElementById("archivedSlider").checked
                    );
                  }}
                />
                <span className="slider round "></span>
              </label>
            </div>
            <p>
              <FormattedMessage id="src.components.memberPage.tabs.annonces.MyAnnonces.slider1" />
            </p>
            <label className="switch ml-2">
              <input
                id="archivedSlider"
                type="checkbox"
                onChange={() => {
                  onHandlePastArchived(
                    document.getElementById("annPastSlider").checked,
                    document.getElementById("archivedSlider").checked
                  );
                }}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </Typography>

        <IconButton
          id="MyAnnouncesTabFilter"
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
  announces,
  selected: sel,
  themes,
  onHandleCreate,
  onHandleSaveDelete,
}) {
  const intl = useIntl();
  const lang = intl.locale;
  const [rows, setRows] = useState([]);
  useEffect(() => {
    original = prepareData(headCells, announces); //default past parameter=true (i.e. includes dates in the past)
    setRows(original);
  }, [announces]);
  const [selected, setSelected] = useState({});
  useEffect(() => {
    /*  if (sel) {
      const sl = {};
      sel.map((id) => {
        announces.map((ann) => {
          if (ann._id === id) sl.push(id); //case where selected announces do still exist (i.e not deleted)
        });
      });
      setSelected(sl);
    } */
    setSelected(sel);
  }, [sel]);
  const [edit, setEdit] = useState({});
  useEffect(() => {
    function getFirstSelected(obj) {
      let ids = Object.keys(obj),
        id = 0;
      for (id of ids) {
        if (obj[id] === 1) return id;
      }
    }
    firstSelected = getFirstSelected(selected);
    setEdit(
      sumOfPropsValues(selected) > 0
        ? _.filter(announces, {_id: firstSelected})[0]
        : {}
    );
  }, [selected]);
  const [numFiltered, setNumFiltered] = useState(0);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const types =
    intlData["en-EN"].src.components.allPages.Menu.navbar.activities.types;
  const subToType = {};
  Object.keys(types).map((type) => {
    Object.keys(types[type].subactivities).map((sub) => {
      subToType[sub] = type;
    });
  });
  function getItem(rec, idx, lang, past) {
    function getType(cs) {
      switch (cs) {
        case "Fixed_Fixed":
          return (
            <FormattedMessage id="src.components.announcePage.booking.fixed_fixed" />
          );
        case "Flex_Fixed":
          return (
            <FormattedMessage id="src.components.announcePage.booking.flex_fixed" />
          );
        case "Flex_Flex":
          return (
            <FormattedMessage id="src.components.announcePage.booking.flex_flex" />
          );
      }
    }
    function getDates(rec, past) {
      return (
        <div style={{minWidth: "140px"}}>
          {rec.dates.map((date, idx) => {
            const now = new Date().setHours(0, 0, 0, 0);
            if (
              past ||
              (!past &&
                ((parseISO(date.period.dateStart).setHours(0, 0, 0, 0) < now &&
                  parseISO(date.period.dateEnd).setHours(0, 0, 0, 0) >= now) ||
                  parseISO(date.period.dateStart).setHours(0, 0, 0, 0) >= now))
            )
              return (
                <ul key={idx}>{`${getFormattedDate(
                  date.period.dateStart,
                  "dd.MM.yyyy"
                )} - ${getFormattedDate(
                  date.period.dateEnd,
                  "dd.MM.yyyy"
                )}`}</ul>
              );
          })}
        </div>
      );
    }
    switch (idx) {
      case 0:
        return <div style={{minWidth: "100%"}}>{rec.title[lang]}</div>;
      case 1:
        return (
          <div style={{minWidth: "120%"}}>
            <FormattedMessage
              id={
                subToType[rec.category] !== undefined
                  ? `src.components.allPages.Menu.navbar.activities.types.${
                      subToType[rec.category]
                    }.subactivities.${rec.category}`
                  : "global.undefined"
              }
            ></FormattedMessage>
          </div>
        );
      case 2:
        return (
          <div style={{minWidth: "130%"}}>
            {`${rec.destination.join("-")},`}
            <br />
            {`${rec.postalCode}, ${rec.city}`}
          </div>
        );
      case 3:
        return <div style={{minWidth: "130%"}}>{getType(rec.datesType)}</div>;
      case 4:
        return `${rec.nbDays}/${rec.nbNights}`;
      case 5:
        return getDates(rec, past);
      case 6:
        return Object.keys(rec.title).join("-");
      case 7:
        return rec.status;
      case 8:
        return rec.archived.toString();
      case 9:
        return rec._id;
      case 10:
        return rec.id_user._id;
    }
  }
  function prepareData(headCells, data, past = true) {
    const rows = [];
    let obj = {};
    data.map((record) => {
      obj = {};
      for (let i = 0; i < 11; i++) {
        obj[headCells[i].name] = getItem(record, i, lang, past);
      }
      rows.push(obj);
    });
    return rows;
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
  const handlePastArchived = (past, archived) => {
    original = prepareData(headCells, announces, !past); //past parameter is the opposite of past slider position
    original = _.filter(original, (row) => {
      return archived ? row.archived === "false" : true;
    });
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
  function handleDelete(cs, id) {
    if (numFiltered > 1) setNumFiltered(numFiltered - 1);
    const sl = {...selected};
    delete sl[id];
    setSelected(sl);
    const rws = _.filter(rows, (row) => {
      return row.id !== id;
    });
    setRows(rws);
    onHandleSaveDelete(cs, id);
  }
  return (
    <Paper sx={{width: "110%"}}>
      <EnhancedTableToolbar
        intl={intl}
        numSelected={sumOfPropsValues(selected)}
        rows={rows}
        selected={selected}
        edit={edit}
        numFiltered={numFiltered}
        theme={themes.toolbar}
        onFilter={filterData}
        onHandleCreate={onHandleCreate}
        onHandlePastArchived={handlePastArchived}
        onHandleSaveDelete={handleDelete}
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
          //onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </ThemeProvider>
    </Paper>
  );
}
