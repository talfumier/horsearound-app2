import {useState} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {Link} from "react-router-dom";
import {alpha} from "@mui/material/styles";
import {
  Toolbar,
  Typography,
  IconButton,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import _ from "lodash";
import FontAwesome from "react-fontawesome";

function TableToolbar({
  numSelected,
  selected,
  numFiltered,
  theme,
  onFilter,
  spinner,
  onHandlePast,
  onHandleSummary,
}) {
  const {locale, formatMessage} = useIntl();
  const [filter, setFilterStatus] = useState(false);
  const [spin, setSpinner] = useState(spinner);
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
      <div className="d-inline-flex align-items-center ">{`${num} ${txt}`}</div>
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
          <Tooltip
            title={formatMessage({
              id: "src.components.memberPage.tabs.MyReservation.summaryButtonTT",
            })}
            arrow
          >
            <Link
              className="dropdown singleDrop btn btn-success p-2 pl-3 pr-3 ml-5"
              disabled={numSelected === 0}
              onClick={onHandleSummary}
            >
              {formatMessage({
                id: "src.components.memberPage.tabs.MyReservation.summaryButton",
              })}
            </Link>
          </Tooltip>
        </Typography>
        <Typography
          sx={{flex: "1 1 100%"}}
          color="inherit"
          variant="h6"
          component="div"
        >
          <div className="d-flex justify-content-end pt-3 pr-3">
            <div className="d-flex mr-5">
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
              <p>
                <FormattedMessage id="src.components.memberPage.tabs.annonces.MyAnnonces.slider2" />
              </p>
              <label className="switch ml-2">
                <input
                  id="bkgPastSlider"
                  type="checkbox"
                  onChange={() => {
                    onHandlePast(
                      document.getElementById("bkgPastSlider").checked
                    );
                  }}
                />
                <span className="slider round "></span>
              </label>
            </div>
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
}

export default TableToolbar;
