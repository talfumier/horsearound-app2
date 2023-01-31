import {useState, useEffect} from "react";
import {useIntl} from "react-intl";
import {Tooltip} from "@mui/material";
import SimpleText from "../announces/form/SimpleText.jsx";
import {alert} from "../validation.js";

function Check({reset, dataIn, valid, onHandleGlobals}) {
  //console.log("dataIn", dataIn);
  const {formatMessage} = useIntl();
  const keys = ["checkOrder", "checkAdress"];
  const [state, setState] = useState({});
  useEffect(() => {
    setState({checkOrder: dataIn.checkOrder, checkAdress: dataIn.checkAdress});
  }, [reset, dataIn.checkOrder, dataIn.checkAdress]);
  const wd = {
    checkOrder: [300, 320],
    checkAdress: [300, 320],
  };
  function getLastUpdated(key) {
    return Object.keys(dataIn[key].pending).indexOf("init") === -1
      ? dataIn[key].pending
      : dataIn[key].data;
  }
  function handleCheckCopy(key) {
    const corpName = getLastUpdated("corpName");
    let address = getLastUpdated("address");
    address = `${address.address}\n${
      address.postcode
    } ${address.city.trim()}\n${address.country.trim()}`;
    setState({
      ...state,
      [key]: {
        name: key,
        data: {default: "", saved: key === "checkOrder" ? corpName : address},
      },
    });
    onHandleGlobals("value", [key, key === "checkOrder" ? corpName : address]);
    const result = alert(
      key,
      null,
      key === "checkOrder" ? corpName : address,
      true
    );
    valid[key] = result.props.obj[1];
    onHandleGlobals("valid", result.props.obj);
  }
  return (
    Object.keys(state).length > 0 && (
      <div className="container mx-0 px-0">
        <table style={{width: "80%"}}>
          <thead>
            <tr>
              {keys.map((key, idx) => {
                return (
                  <th key={key}>
                    <div className="d-flex justify-content-center w-50">
                      <h5
                        style={{
                          textAlign: "center",
                          width: wd[key][0],
                        }}
                      >
                        {formatMessage({
                          id: `src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.${key}`,
                        })}
                      </h5>
                      <Tooltip
                        title={formatMessage({
                          id: `src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.checkTT${idx}`,
                        })}
                        arrow
                      >
                        <span
                          style={{
                            fontSize: "2rem",
                            color: "#7aa095",
                            cursor: "pointer",
                            marginLeft: "-80px",
                          }}
                          className="glyphicon mt-2 pt-1"
                          onClick={() => {
                            handleCheckCopy(key);
                          }}
                        >
                          &#xe134;
                        </span>
                      </Tooltip>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              {keys.map((key) => {
                return (
                  <td
                    key={key}
                    style={{
                      maxWidth: wd[key][0],
                      verticalAlign: "top",
                    }}
                  >
                    <SimpleText
                      reset={reset}
                      type="textarea"
                      dataIn={state[key]}
                      required={true}
                      valid={valid[key]}
                      onHandleGlobals={onHandleGlobals}
                      label={false}
                      w={wd[key][1]}
                    ></SimpleText>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    )
  );
}

export default Check;
