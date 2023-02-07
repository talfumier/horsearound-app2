import {useState, useEffect} from "react";
import {useCookies} from "react-cookie";
import {useIntl} from "react-intl";
import {Tooltip} from "@mui/material";
import _ from "lodash";
import {decodeJWT} from "../../../services/httpUsers.js";
import MyAnnounces from "./announces/MyAnnounces.jsx";
import MyBookings from "./bookings/MyBookings.jsx";
import MyInvoices from "./invoices/MyInvoices";
import MyProfile from "./profile/MyProfile.jsx";
import CorporateData from "./corporate/CorporateData.jsx";
import {SwalOkCancel} from "../common/toastSwal/SwalOkCancel.jsx";
import {patchUser, patchCompany} from "../../../services/httpUsers.js";
import {errorHandlingToast} from "../../../services/utilsFunctions.js";
import {successFailure} from "./announces/form/AnnounceForm.jsx";
import DashBoard from "./Dashboard.jsx";
import {RenderInWindow} from "../common/RenderInWindow.jsx";
import CorporateSummary from "./corporate/CorporateSummary.jsx";
import {toastInfo} from "../common/toastSwal/ToastMessages.js";

function PageContent({
  announces,
  users: usrs,
  bookings,
  invoices,
  selected,
  tab,
  spinner,
  onHandleToggle,
  onHandleSaveDelete,
  onHandleDirty,
  onHandleBookingChange,
  onHandleInvoiceChange,
}) {
  window.scrollTo(0, 0);
  const {locale, formatMessage} = useIntl();
  const [cookies, setCookie] = useCookies(["user"]);
  const currentUser = cookies.user ? decodeJWT(cookies.user) : null;
  const [users, setUsers] = useState(_.orderBy(usrs, "status", "desc")); //usrs.length > 0 in ADMIN case, ordered to ensure PENDING user(s) come on top of the list
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(null);
  const styles = {
    container: {
      minHeight: 500,
      marginTop: 160,
      marginLeft: "auto",
      width: "100%",
      //maxHeight: 800, style={styles.container}
    },
  };
  async function handleProValidation(id) {
    const result = await SwalOkCancel(
      formatMessage,
      "src.components.memberPage.DashBoard.validPro"
    );
    if (result === "cancel") return;
    const abortController = new AbortController();
    //update admin comments in companies collection
    let res = await patchCompany(
      id,
      {admin_validation: value},
      cookies.user,
      abortController.signal
    );
    let bl = !(await errorHandlingToast(res, locale, false));
    successFailure("PATCH", [bl], formatMessage, "UpdateCompany");
    //update pro status
    res = await patchUser(
      id,
      {status: "ACTIVE"},
      cookies.user,
      abortController.signal
    );
    bl = !(await errorHandlingToast(res, locale, false));
    successFailure("PATCH", [bl], formatMessage, "UpdateProfile");
    if (bl) {
      const usrs = _.cloneDeep(users);
      usrs.map((usr) => {
        if (usr._id === id) usr.status = "ACTIVE";
      });
      setUsers(usrs); //style={styles.container}
    }
  }
  return (
    <div className="container p-0 " style={styles.container}>
      {open !== null && (
        <RenderInWindow
          comp={<CorporateSummary pro={open}></CorporateSummary>}
          size={{width: 900, height: 500, x: 400, y: 200}}
          onClose={() => {
            setOpen(null);
          }}
        ></RenderInWindow>
      )}
      {tab === 1 &&
        users.map((usr, idx) => {
          return (
            <div className="m-0 p-0" key={idx}>
              <ul key={idx}>
                <div className="d-flex mt-4 ">
                  <Tooltip
                    title={formatMessage({
                      id: "src.components.memberPage.DashBoard.summaryTT",
                    })}
                    arrow
                  >
                    <h5
                      id={usr._id}
                      style={{
                        color: usr.status !== "PENDING" ? "blue" : "orange",
                        fontWeight: "bold",
                        width: usr.status !== "PENDING" ? null : "100%",
                        height: "5%",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        if (open !== null) {
                          toastInfo(
                            formatMessage({
                              id: "user_msg.standard.errors.windowOpen",
                            })
                          );
                          return;
                        }
                        setOpen(e.target.id);
                      }}
                    >
                      {`${usr.firstName ? usr.firstName : ``} ${
                        usr.lastName ? usr.lastName : ``
                      }${usr.firstName || usr.lastName ? ` - ` : ``}${
                        usr.email
                      }${
                        usr.status === "PENDING"
                          ? formatMessage({
                              id: "src.components.memberPage.DashBoard.pendingValid",
                            })
                          : ""
                      }`}
                    </h5>
                  </Tooltip>
                  {currentUser.role === "ADMIN" && usr.status === "PENDING" && (
                    <>
                      <textarea
                        value={value}
                        className="form-control"
                        rows="4"
                        onChange={(e) => {
                          setValue(e.target.value);
                        }}
                      ></textarea>
                      <button
                        className="dropdown singleDrop btn btn-success p-2 pl-3 ml-5 mr-4 pr-3 "
                        style={{height: "10%"}}
                        onClick={() => {
                          handleProValidation(usr._id);
                        }}
                      >
                        {formatMessage({
                          id: "buttons.valid",
                        })}
                      </button>
                    </>
                  )}
                </div>
                <DashBoard
                  announces={
                    currentUser.role === "ADMIN"
                      ? _.filter(announces, (ann) => {
                          return ann.id_user._id === usr._id;
                        })
                      : announces
                  }
                  bookings={bookings[usr._id]}
                  invoices={invoices[usr._id]}
                  user={usr}
                  onHandleToggle={onHandleToggle}
                  style={{margin: 0}}
                />
              </ul>
            </div>
          );
        })}
      {tab === 2 && (
        <MyAnnounces
          announces={announces}
          selected={selected.announces}
          // onHandleToggle={onHandleToggle}
          onHandleSaveDelete={onHandleSaveDelete}
        />
      )}
      {tab === 3 && (
        <MyBookings
          bookings={bookings}
          announces={announces}
          selected={selected.bookings}
          spinner={spinner.bookings}
          onHandleBookingChange={onHandleBookingChange}
        ></MyBookings>
      )}
      {tab === 4 && <div>444444444444444444444</div>}
      {tab === 5 && (
        <MyInvoices
          invoices={invoices}
          announces={announces}
          spinner={spinner.invoices}
          onHandleInvoiceChange={onHandleInvoiceChange}
        ></MyInvoices>
      )}
      {tab === 6 && <div>66666666666666666666</div>}
      {tab === 7 && (
        <CorporateData
          user={currentUser}
          onHandleDirty={onHandleDirty}
        ></CorporateData>
      )}
      {tab === 8 && (
        <MyProfile user={currentUser} onHandleDirty={onHandleDirty}></MyProfile>
      )}
    </div>
  );
}

export default PageContent;
