import {useState} from "react";
import {useIntl} from "react-intl";
import {Link} from "react-router-dom";
import {
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import {RenderInWindow} from "../../../common/RenderInWindow.jsx";
import ViewerPage from "../../../common/viewer/ViewerPage.jsx";
import {invoiceProcessImg} from "../../../../../static_data/invoiceProcessImg.js";
import {toastInfo} from "../../../common/toastSwal/ToastMessages.js";

function Tablehead({
  headCells,
  numSelected,
  onSelectAllClick,
  rowCount,
  theme,
}) {
  const {locale, formatMessage} = useIntl();
  const [open, setOpen] = useState({steps_todo: false, cancel: false});
  return (
    <>
      {Object.keys(open).map((name) => {
        if (open[name])
          return (
            <RenderInWindow
              key={name}
              comp={
                <ViewerPage
                  data={invoiceProcessImg[locale]}
                  prt={false}
                ></ViewerPage>
              }
              size={{width: 600, height: 250, x: 400, y: 200}}
              onClose={() => {
                setOpen({...open, [name]: false});
              }}
            ></RenderInWindow>
          );
      })}
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
              >
                {headCell.label}
                {headCell.name === "steps_todo" ? (
                  <Tooltip
                    title={formatMessage({
                      id: `src.components.memberPage.tabs.price.MyPrice.Column${headCell.name}TT`,
                    })}
                    arrow
                  >
                    <Link
                      id="btn_info"
                      className="fa fa-info-circle fa-lg pt-2 pl-2 mr-3"
                      style={{
                        color: "white",
                        background: "transparent",
                        border: "0",
                        maxWidth: "15px",
                        marginTop: "-8px",
                      }}
                      onClick={() => {
                        if (open[headCell.name]) {
                          toastInfo(
                            formatMessage({
                              id: "user_msg.standard.errors.windowOpen",
                            })
                          );
                          return;
                        }
                        setOpen({...open, [headCell.name]: true});
                      }}
                    ></Link>
                  </Tooltip>
                ) : null}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      </ThemeProvider>
    </>
  );
}

export default Tablehead;
/* 
open && (
  <RenderInWindow
    comp={<BookingSteps></BookingSteps>} 
    size={{width: 600, height: 400, x: 400, y: 200}}
    onClose={() => {
      setOpen(false);
    }}
  ></RenderInWindow>
)
 */
