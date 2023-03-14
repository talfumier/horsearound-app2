import {useState} from "react";
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
import Messaging from "./messaging/Messaging.jsx";

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
  onHandleParticipantsChange,
  onHandleInvoiceChange,
  onHandleConditionsChange,
  onHandleRefresh,
  onHandleBadges,
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
      height: 800,
      //overFlowY: "auto",
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
      let nbPending = 0;
      const usrs = _.cloneDeep(users);
      usrs.map((usr) => {
        if (usr._id === id) usr.status = "ACTIVE";
        else nbPending += usr.status === "PENDING" ? 1 : 0;
      });
      setUsers(usrs);
      onHandleBadges([["admin", nbPending > 0]]);
    }
  }
  let usr_details = null;
  function getuserDetails(usr) {
    return `${usr.firstName ? usr.firstName : ``} ${
      usr.lastName ? usr.lastName : ``
    }${usr.firstName || usr.lastName ? ` - ` : ``}${usr.email}${
      usr.status === "PENDING"
        ? formatMessage({
            id: "src.components.memberPage.DashBoard.pendingValid",
          })
        : ""
    }`;
  }
  function getTab1Content() {
    return users.map((usr, idx) => {
      usr_details = getuserDetails(usr);
      return (
        <div className="d-flex justify-content-center mr-4 pr-4" key={idx}>
          <ul key={idx}>
            <div className="d-flex flex-column mt-4">
              {currentUser.role === "ADMIN" ? (
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
                    {usr_details}
                  </h5>
                </Tooltip>
              ) : usr.status === "PENDING" ? (
                <h5
                  style={{
                    color: "orange",
                    fontWeight: "bold",
                  }}
                >
                  {usr_details}
                </h5>
              ) : null}
              {currentUser.role === "ADMIN" && usr.status === "PENDING" && (
                <div className="d-flex justify-content-center mt-4 mr-4 pr-4">
                  <textarea
                    value={value}
                    className="form-control ml-4 pl-4"
                    cols="10"
                    rows="4"
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                  ></textarea>
                  <button
                    className="dropdown singleDrop btn btn-success p-2 pl-3 ml-5 mr-4 pr-3 "
                    style={{height: "40%"}}
                    onClick={() => {
                      handleProValidation(usr._id);
                    }}
                  >
                    {formatMessage({
                      id: "buttons.valid",
                    })}
                  </button>
                </div>
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
    });
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
      {tab === 1 && (
        <div
          className="d-flex flex-column ml-0 pl-0 mr-4 pr-4"
          style={{
            overflow: "auto",
            height: 550,
            width: "110%",
          }}
        >
          {getTab1Content()}
        </div>
      )}
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
          onHandleParticipantsChange={onHandleParticipantsChange}
          onHandleToggle={onHandleToggle}
        ></MyBookings>
      )}
      {tab === 4 && <div>444444444444444444444</div>}
      {tab === 5 && (
        <MyInvoices
          invoices={invoices}
          announces={announces}
          spinner={spinner.invoices}
          onHandleInvoiceChange={onHandleInvoiceChange}
          onHandleConditionsChange={onHandleConditionsChange}
          onHandleSummary={(id) => {
            if (open !== null) {
              toastInfo(
                formatMessage({
                  id: "user_msg.standard.errors.windowOpen",
                })
              );
              return;
            }
            setOpen(id);
          }}
        ></MyInvoices>
      )}
      {tab === 6 && <Messaging onHandleBadges={onHandleBadges}></Messaging>}
      {tab === 7 && (
        <CorporateData
          user={currentUser}
          onHandleDirty={onHandleDirty}
          onHandleActionRequired={onHandleBadges}
        ></CorporateData>
      )}
      {tab === 8 && (
        <MyProfile
          user={currentUser}
          onHandleDirty={onHandleDirty}
          onHandleRefresh={onHandleRefresh}
          onHandleActionRequired={onHandleBadges}
        ></MyProfile>
      )}
    </div>
  );
}

export default PageContent;
