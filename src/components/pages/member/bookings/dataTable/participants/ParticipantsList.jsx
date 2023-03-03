import {useState, useEffect} from "react";
import {useIntl} from "react-intl";
import {useCookies} from "react-cookie";
import _ from "lodash";
import {decodeJWT} from "../../../../../../services/httpUsers.js";
import {Tooltip, ThemeProvider} from "@mui/material";
import {getMuiThemes} from "../../../../common/mui/MuiThemes.js";
import Person from "./Person.jsx";
import {patchBooking} from "../../../../../../services/httpBookings.js";
import {errorHandlingToast} from "../../../../../../services/utilsFunctions.js";
import {successFailure} from "../../../announces/form/AnnounceForm.jsx";

function ParticipantsList({data: dataIn, onHandleToggle, onHandleSave}) {
  const {locale, formatMessage} = useIntl();
  const [cookies, setCookie] = useCookies(["user"]);
  const currentUser = cookies.user ? decodeJWT(cookies.user) : null;
  const [data, setData] = useState({});
  const [counts, setCounts] = useState({});
  useEffect(() => {
    setData({
      _id: dataIn[0]._id, //booking._id
      ref: dataIn[0].ref,
      userId: dataIn[0].id_user,
      lastName: dataIn[0].user.lastName,
      firstName: dataIn[0].user.firstName,
      people: dataIn[0].user.participantsInfo,
      ticked: dataIn[0].participantsInfo, //[{_id:ObjectId, as:"adult"},...]
    });
    const obj = getCounts(dataIn[0].participantsInfo);
    setCounts({
      adult: {nb: dataIn[0].adults.nb, ticked: obj.na},
      child: {nb: dataIn[0].children.nb, ticked: obj.nc},
      companion: {nb: dataIn[0].companions.nb, ticked: obj.ncp},
    });
  }, [dataIn]);
  function getCounts(partsInfo) {
    let na = 0,
      nc = 0,
      ncp = 0;
    if (partsInfo[0])
      partsInfo.map((partInfo) => {
        switch (partInfo.as) {
          case "adult":
            na += 1;
            break;
          case "child":
            nc += 1;
            break;
          case "companion":
            ncp += 1;
        }
      });
    return {na, nc, ncp};
  }
  function handleChange(id, val, etid) {
    if (val && counts[etid].ticked + 1 > counts[etid].nb) return;
    const dta = _.cloneDeep(data),
      cnts = _.cloneDeep(counts);
    if (!val)
      dta.ticked = _.filter(dta.ticked, (tick) => {
        if (!tick) return false;
        return tick._id !== id;
      });
    else {
      dta.ticked.push({_id: id, as: etid});
    }
    setData(dta);
    cnts[etid] = {...cnts[etid], ticked: (cnts[etid].ticked += val ? 1 : -1)};
    setCounts(cnts);
  }
  function getTickedAs(id) {
    let result = null;
    data.ticked.map((tick) => {
      if (tick && tick._id === id) result = tick.as;
    });
    return result;
  }
  async function handleSave() {
    const abortController = new AbortController();
    const res = await patchBooking(
      data._id,
      {participantsInfo: data.ticked},
      cookies.user,
      abortController.signal
    );
    const bl = !(await errorHandlingToast(res, locale, false));
    if (bl) {
      successFailure("PATCH", [bl], formatMessage, "UpdateBooking");
      onHandleSave(data);
    } else abortController.abort();
  }
  return (
    Object.keys(data).length > 0 &&
    Object.keys(counts).length > 0 && (
      <div className="mt-4  pt-2">
        <ThemeProvider theme={getMuiThemes("MyBookingsTable", locale)}>
          <table className="table conditions table-bordered mt-4 mr-4">
            <thead className="conditions">
              <tr className="conditions ">
                <th className="conditions text-center">
                  {formatMessage({
                    id: `src.components.memberPage.tabs.MyReservation.registeredParticipants${
                      currentUser.type !== "pro" && currentUser.role !== "ADMIN"
                        ? ""
                        : "Pro"
                    }`,
                  })}
                  {currentUser.type !== "pro" && (
                    <Tooltip
                      title={formatMessage({
                        id: `src.components.memberPage.tabs.MyReservation.profileTT`,
                      })}
                      arrow
                    >
                      <i
                        className="fa fa-user fa-1x ml-4 pl-4"
                        style={{
                          border: "0",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          onHandleToggle(8);
                        }}
                      ></i>
                    </Tooltip>
                  )}
                </th>
                <th className="conditions text-center">
                  {`${formatMessage({
                    id: "src.components.announcePage.booking.adult",
                  })} >> ${counts.adult.nb} `}
                  {counts.adult.nb === counts.adult.ticked && (
                    <span>&#x2714;</span>
                  )}
                </th>
                <th className="conditions text-center">
                  {`${formatMessage({
                    id: "src.components.announcePage.booking.child",
                  })} >> ${counts.child.nb} `}
                  {counts.child.nb === counts.child.ticked && (
                    <span>&#x2714;</span>
                  )}
                </th>
                <th className="conditions text-center">
                  {`${formatMessage({
                    id: "src.components.announcePage.booking.companion",
                  })} >> ${counts.companion.nb} `}
                  {counts.companion.nb === counts.companion.ticked && (
                    <span>&#x2714;</span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              <Person
                data={{
                  id: data.userId,
                  lastName: data.lastName,
                  firstName: data.firstName,
                  type: "user",
                  ticked: getTickedAs(data.userId),
                }}
                counts={counts}
                onHandleChange={handleChange}
              ></Person>
              {data.people.map((person, idx) => {
                return (
                  <Person
                    key={idx}
                    data={{
                      id: person._id,
                      lastName: person.lastName,
                      firstName: person.firstName,
                      type: "participant",
                      ticked: getTickedAs(person._id),
                    }}
                    onHandleChange={handleChange}
                  ></Person>
                );
              })}
            </tbody>
          </table>
        </ThemeProvider>
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-success btn-default w-50"
            onClick={handleSave}
          >
            {`${formatMessage({
              id: "src.components.memberPage.tabs.MyReservation.updateButton",
            })} #${data.ref}`}
          </button>
        </div>
      </div>
    )
  );
}

export default ParticipantsList;
