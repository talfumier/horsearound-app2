import {useState, useEffect} from "react";
import {useCookies} from "react-cookie";
import {decodeJWT} from "../../../../services/httpUsers.js";
import {
  getParrainageCounters,
  patchCompany,
} from "../../../../services/httpUsers.js";
import {errorHandlingToast} from "../../../../services/utilsFunctions.js";
import {FormattedMessage, useIntl} from "react-intl";
import {Link} from "react-router-dom";
import {hexToRgb, Tooltip} from "@mui/material";
import SimpleText from "../announces/form/SimpleText.jsx";
import "./myconditions.css";
import {successFailure} from "../announces/form/AnnounceForm.jsx";

let globals = {};
function MyConditions({data, onHandleConditionsChange, onHandleSummary}) {
  const {locale, formatMessage} = useIntl();
  const [cookies, setCookie] = useCookies(["user"]);
  const currentUser = cookies.user ? decodeJWT(cookies.user) : null;
  const [parrainage, setParrainage] = useState({});
  useEffect(() => {
    async function loadData(signal) {
      let res = null,
        obj = {};
      await Promise.all(
        Object.keys(data).map(async (userId) => {
          globals[userId] = {
            tarif: {
              valid: false,
              value: null,
              saved: data[userId].data[0].tarif,
            },
            annual: {
              valid: false,
              value: null,
              saved: data[userId].data[0].annual,
            },
            penalty: {
              valid: false,
              value: null,
              saved: data[userId].data[0].penalty,
            },
          };
          res = await getParrainageCounters(
            data[userId].data[0].code_parrainage,
            cookies.user,
            signal
          );
          if (!(await errorHandlingToast(res, locale, false)))
            obj[userId] = {
              code_parrainage_given: res.data.total,
              code_parrainage_given_to_pro: res.data.pro,
            };
        })
      ).then(() => {
        setParrainage(obj);
      });
    }
    const abortController = new AbortController();
    loadData(abortController.signal);
    return () => {
      abortController.abort(); //clean-up code after component has unmounted
    };
  }, [data]);
  async function handleSave(userId) {
    if (
      document.getElementById(`myConditionsSave_${userId}`).style.color ===
      hexToRgb("#ccc")
    )
      return;
    const body = {};
    Object.keys(globals[userId]).map((key) => {
      if (
        globals[userId][key].value !== null &&
        globals[userId][key].valid &&
        globals[userId][key].value != globals[userId][key].saved
      )
        body[key] = parseInt(globals[userId][key].value);
    });
    console.log("body MyConditions", body);
    const abortController = new AbortController();
    const res = await patchCompany(
      userId,
      body,
      cookies.user,
      abortController.signal
    );
    const bl = !(await errorHandlingToast(res, locale, false));
    if (bl) {
      successFailure("PATCH", [bl], formatMessage, "UpdateConditions");
      Object.keys(body).map((key) => {
        globals[userId][key] = {valid: true, value: null, saved: body[key]};
      });
      onHandleConditionsChange(userId, body);
      document.getElementById(`myConditionsSave_${userId}`).style.color =
        "#ccc";
    } else abortController.abort();
  }
  function handleGlobals(userId, cs, val) {
    let col = "#ccc";
    globals[userId][val[0]][cs] = val[1];
    switch (cs) {
      case "value":
        if (
          globals[userId][val[0]].valid &&
          val[1] != globals[userId][val[0]].saved
        )
          col = "#7aa095";
        try {
          document.getElementById(`myConditionsSave_${userId}`).style.color =
            col;
        } catch (error) {} //no save button when pro user is logged in
    }
  }
  return (
    Object.keys(parrainage).length > 0 && (
      <div className="pt-0">
        {Object.keys(data).map((userId, idx) => {
          return (
            <div
              key={idx}
              style={{
                border: "solid 1px",
                borderRadius: 5,
                borderColor: "#D9D9D9",
              }}
            >
              <div className="d-flex justify-content-between p-4 mb-0">
                {currentUser.role === "ADMIN" && (
                  <Tooltip
                    title={formatMessage({
                      id: "src.components.memberPage.DashBoard.summaryTT",
                    })}
                    arrow
                  >
                    <h5
                      className="mt-0 pt-1"
                      style={{
                        color:
                          typeof data[userId].data[0].corpName ===
                            "undefined" ||
                          data[userId].data[0].corpName.length === 0
                            ? "orange"
                            : "blue",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        onHandleSummary(userId);
                      }}
                    >
                      {typeof data[userId].data[0].corpName !== "undefined" &&
                      data[userId].data[0].corpName.length > 0
                        ? data[userId].data[0].corpName
                        : "t.b.d"}
                    </h5>
                  </Tooltip>
                )}
                {currentUser.role !== "ADMIN" && (
                  <div className="d-flex justify-content-center w-100">
                    <p className="ml-4" style={{fontWeight: "bolder"}}>
                      <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.phrase" />
                      <Link
                        className="fa fa-info-circle fa-lg pt-2 pl-2 mr-3"
                        style={{
                          color: "#7aa095",
                          background: "transparent",
                          border: "0",
                          marginTop: "-8px",
                        }}
                        onClick={() => {}}
                      ></Link>
                    </p>
                  </div>
                )}
                {currentUser.role === "ADMIN" && (
                  <Tooltip
                    title={formatMessage({
                      id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.save",
                    })}
                    arrow
                  >
                    <i
                      id={`myConditionsSave_${userId}`}
                      className="fa fa-save fa-2x mr-4"
                      style={{
                        color: "#ccc",
                        border: "0",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        handleSave(userId);
                      }}
                    ></i>
                  </Tooltip>
                )}
              </div>
              <div className="d-flex justify-content-between mx-4">
                <table className="table conditions table-bordered mr-4">
                  <thead className="conditions">
                    <tr className="conditions">
                      <th className="conditions" colSpan="2">
                        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t1head" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="conditions">
                      <td className="conditions">
                        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t1r1c1" />
                      </td>
                      <td className="conditions">
                        <SimpleText
                          label={false}
                          col="3"
                          disabled={currentUser.role !== "ADMIN" ? true : false}
                          dataIn={{
                            name: "tarif",
                            data: data[userId].data[0].tarif,
                          }}
                          valid={{tarif: false}}
                          required={true}
                          trash={false}
                          onHandleGlobals={(cs, val) => {
                            handleGlobals(userId, cs, val);
                          }}
                        ></SimpleText>
                        <label className="ml-0 pl-0 mt-2 pt-1">%</label>
                      </td>
                    </tr>
                    <tr className="conditions">
                      <td className="conditions">
                        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t1r2c1" />
                      </td>
                      <td className="conditions">
                        <SimpleText
                          label={false}
                          col="3"
                          disabled={currentUser.role !== "ADMIN" ? true : false}
                          dataIn={{
                            name: "annual",
                            data: data[userId].data[0].annual,
                          }}
                          valid={{annual: false}}
                          required={true}
                          trash={false}
                          onHandleGlobals={(cs, val) => {
                            handleGlobals(userId, cs, val);
                          }}
                        ></SimpleText>
                        <label className="ml-0 pl-0 mt-2 pt-1">€</label>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table className="table conditions table-bordered ml-4">
                  <thead className="conditions">
                    <tr className="conditions">
                      <th className="conditions" colSpan="2">
                        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t2head" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="conditions">
                      <td className="conditions">
                        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t2r1c1" />
                      </td>
                      <td className="conditions">
                        <SimpleText
                          label={false}
                          col="3"
                          dataIn={{
                            name: "tarif",
                            data: 10,
                          }}
                          valid={{tarif: false}}
                          disabled={true}
                          trash={false}
                          onHandleGlobals={handleGlobals}
                        ></SimpleText>
                        <label className="ml-0 pl-0 mt-2 pt-1">%</label>
                      </td>
                    </tr>
                    <tr className="conditions">
                      <td className="conditions">
                        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t2r2c1" />
                      </td>
                      <td className="conditions">
                        <SimpleText
                          label={false}
                          col="3"
                          dataIn={{
                            name: "annual",
                            data: 0,
                          }}
                          valid={{annual: false}}
                          disabled={true}
                          trash={false}
                          onHandleGlobals={handleGlobals}
                        ></SimpleText>
                        <label className="ml-0 pl-0 mt-2 pt-1">€</label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between mx-4">
                <table className="table conditions table-bordered mr-4">
                  <thead className="conditions">
                    <tr className="conditions">
                      <th className="conditions" colSpan="4">
                        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t3head" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{fontWeight: "600", backgroundColor: "#e9ecef"}}>
                      <td className="conditions">
                        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t3r1c1" />
                      </td>
                      <td className="conditions">
                        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t3r1c2" />
                      </td>
                      <td className="conditions">
                        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t3r1c3" />
                      </td>
                      <td className="conditions">
                        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t3r1c4" />
                      </td>
                    </tr>
                    <tr className="conditions">
                      <td className="conditions">
                        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t3r2c1" />
                      </td>
                      <td className="conditions">0/1</td>
                      <td className="conditions">
                        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t3r2c3" />
                      </td>
                      <td className="conditions">0%</td>
                    </tr>
                    <tr className="conditions">
                      <td className="conditions">
                        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t3r3c1" />
                      </td>
                      <td className="conditions">
                        {parrainage[userId].code_parrainage_given_to_pro}
                        /3
                      </td>
                      <td className="conditions">
                        {parrainage[userId].code_parrainage_given_to_pro ===
                        3 ? (
                          <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t3r3c3a" />
                        ) : (
                          <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t3r3c3b" />
                        )}
                      </td>
                      <td className="conditions">
                        {parrainage[userId].code_parrainage_given_to_pro * 0.5}%
                      </td>
                    </tr>
                    <tr className="conditions">
                      <td className="conditions">
                        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t3r4c1a" />
                        <br></br>
                        {`(code: ${data[userId].data[0].code_parrainage})`}
                      </td>
                      <td className="conditions">
                        {parrainage[userId].code_parrainage_given}
                      </td>
                      <td className="conditions">
                        {parrainage[userId].code_parrainage_given === 12 ? (
                          <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t3r4c3a" />
                        ) : (
                          <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t3r4c3b" />
                        )}
                      </td>
                      <td className="conditions">
                        {parrainage[userId].code_parrainage_given > 2
                          ? parrainage[userId].code_parrainage_given -
                            2 * 0.5 +
                            2
                          : parrainage[userId].code_parrainage_given}
                        %
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table className="table conditions table-bordered ml-4">
                  <thead className="conditions">
                    <tr className="conditions">
                      <th className="conditions">
                        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t4head" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="conditions">
                      <td
                        className="conditions"
                        style={{
                          color:
                            data[userId].data[0].penalty > 0
                              ? "orange"
                              : "green",
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        {data[userId].data[0].penaltyAmount > 0 ? (
                          //  && this.state.penaltyFinder === true ?
                          <span>
                            {data[userId].data[0].penalty}
                            <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t4r1c1a" />
                          </span>
                        ) : (
                          <span>
                            <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.t4r1c1b" />
                          </span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    )
  );
}

export default MyConditions;
